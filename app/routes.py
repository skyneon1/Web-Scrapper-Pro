from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Query, Request
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import json
import os
import csv
import io
from collections import defaultdict
from bson import ObjectId

from app.models import ScrapeRequest, ScrapeResult, ScrapeJobStatus, AnalyticsResponse
from app.scraper import WebScraper
from app.database import get_database

router = APIRouter()
scraper = WebScraper()

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable dict"""
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc

def run_scrape_job_bg(job_id: str, url: str, selectors: List[str] = None, 
                      use_playwright: bool = False, wait_time: int = 5,
                      crawl_site: bool = False, max_pages: int = 10):
    """Wrapper to run scrape job in background - updated for MongoDB"""
    # Note: verify if we can access asyncio loop here or if we need sync wrapper
    # Since this is a background task, we might need a new loop or use run_in_executor
    import asyncio
    
    async def _async_run():
        db = get_database()
        if db is None:
             # If db connection failed, we can't do much. 
             # In production, we'd want robust error handling here.
             return

        try:
            # Update status to running
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {"status": ScrapeJobStatus.RUNNING}}
            )
            
            start_time = datetime.now()
            
            # Run blocking scraper in executor to avoid blocking event loop
            loop = asyncio.get_event_loop()
            result_data = await loop.run_in_executor(
                None, 
                lambda: scraper.scrape(
                    url=url,
                    selectors=selectors,
                    use_playwright=use_playwright,
                    wait_time=wait_time,
                    crawl_site=crawl_site,
                    max_pages=max_pages
                )
            )
            
            completed_at = datetime.now()
            duration = (completed_at - start_time).total_seconds()
            
            result_record = {
                "job_id": job_id,
                "url": url,
                "status": ScrapeJobStatus.COMPLETED,
                "data": result_data,
                "error": None,
                "completed_at": completed_at.isoformat(),
                "duration_seconds": duration
            }
            
            # Update job
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {
                    "status": ScrapeJobStatus.COMPLETED,
                    "completed_at": completed_at.isoformat(),
                    "duration_seconds": duration,
                    "result": result_record
                }}
            )
            
        except Exception as e:
            completed_at = datetime.now()
            error_msg = str(e)
            
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {
                    "status": ScrapeJobStatus.FAILED,
                    "error": error_msg,
                    "completed_at": completed_at.isoformat()
                }}
            )

    # Fire and forget async wrapper
    # In Vercel serverless, background tasks might be cut off if function returns.
    # However, for FastApi on Vercel, awaitable background tasks are tricky.
    # We will try to run this. If Vercel kills it, we need a queue (Redis/SQS).
    # For now, we assume simple usage.
    asyncio.run(_async_run())

@router.post("/scrape", response_model=dict)
async def create_scrape_job(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Create a new scraping job"""
    job_id = str(uuid.uuid4())
    db = get_database()
    
    job = {
        "job_id": job_id,
        "url": request.url,
        "selectors": request.selectors,
        "use_playwright": request.use_playwright,
        "wait_time": request.wait_time,
        "crawl_site": request.crawl_site,
        "max_pages": request.max_pages or 10,
        "status": ScrapeJobStatus.PENDING,
        "created_at": datetime.now().isoformat()
    }
    
    if db is not None:
        await db.jobs.insert_one(job.copy())
    
    # Add background task
    background_tasks.add_task(
        run_scrape_job_bg,
        job_id=job_id,
        url=request.url,
        selectors=request.selectors,
        use_playwright=request.use_playwright,
        wait_time=request.wait_time or 5,
        crawl_site=request.crawl_site,
        max_pages=request.max_pages or 10
    )
    
    return {
        "job_id": job_id,
        "status": "pending",
        "message": "Scraping job created successfully"
    }

@router.get("/results/{job_id}", response_model=ScrapeResult)
async def get_result(job_id: str):
    """Get scraping result by job ID"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    result = job.get("result")
    if result:
        return result
        
    return {
        "job_id": job_id,
        "url": job["url"],
        "status": job["status"],
        "data": None,
        "error": job.get("error"),
        "created_at": job["created_at"],
        "completed_at": job.get("completed_at")
    }

@router.get("/jobs", response_model=List[dict])
async def list_jobs(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all scraping jobs"""
    db = get_database()
    if db is None:
        # Fallback empty list if db down
        return []
        
    query = {}
    if status:
        query["status"] = status
        
    cursor = db.jobs.find(query).sort("created_at", -1).skip(offset).limit(limit)
    jobs = await cursor.to_list(length=limit)
    
    return [
        {
            "job_id": j["job_id"],
            "url": j["url"],
            "status": j["status"],
            "created_at": j["created_at"],
            "completed_at": j.get("completed_at"),
            "duration_seconds": j.get("duration_seconds")
        }
        for j in jobs
    ]

@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get job details"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # include result data if completed
    result = job.get("result", {})
    
    return {
        "job_id": job_id,
        "url": job["url"],
        "status": job["status"],
        "data": result.get("data"),
        "error": job.get("error"),
        "created_at": job["created_at"],
        "completed_at": job.get("completed_at"),
        "duration_seconds": job.get("duration_seconds")
    }

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a scraping job"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    result = await db.jobs.delete_one({"job_id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {"message": "Job deleted successfully"}

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Get analytics"""
    db = get_database()
    if db is None:
        # Return empty stats if no DB
        return {
            "total_jobs": 0, "completed_jobs": 0, "failed_jobs": 0,
            "pending_jobs": 0, "running_jobs": 0, "success_rate": 0,
            "average_completion_time": None, "jobs_by_date": {}
        }
        
    # Aggregations
    total_jobs = await db.jobs.count_documents({})
    completed_jobs = await db.jobs.count_documents({"status": ScrapeJobStatus.COMPLETED})
    failed_jobs = await db.jobs.count_documents({"status": ScrapeJobStatus.FAILED})
    pending_jobs = await db.jobs.count_documents({"status": ScrapeJobStatus.PENDING})
    running_jobs = await db.jobs.count_documents({"status": ScrapeJobStatus.RUNNING})
    
    success_rate = (completed_jobs / total_jobs * 100) if total_jobs > 0 else 0
    
    # Avg duration
    pipeline = [
        {"$match": {"status": ScrapeJobStatus.COMPLETED, "duration_seconds": {"$ne": None}}},
        {"$group": {"_id": None, "avg_time": {"$avg": "$duration_seconds"}}}
    ]
    avg_result = await db.jobs.aggregate(pipeline).to_list(length=1)
    avg_completion_time = avg_result[0]["avg_time"] if avg_result else None
    
    # Jobs by date
    # Note: date string format is "YYYY-MM-DDTHH:MM:SS.mmmmmm"
    # We'll just fetch all dates and process in python for simplicity unless dataset is huge
    cursor = db.jobs.find({}, {"created_at": 1})
    jobs_list = await cursor.to_list(length=1000)
    
    jobs_by_date = defaultdict(int)
    for j in jobs_list:
        try:
            dt_str = j["created_at"]
            if isinstance(dt_str, str):
                date_part = dt_str.split("T")[0]
                jobs_by_date[date_part] += 1
        except: 
            pass
            
    return {
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "pending_jobs": pending_jobs,
        "running_jobs": running_jobs,
        "success_rate": round(success_rate, 2),
        "average_completion_time": round(avg_completion_time, 2) if avg_completion_time else None,
        "jobs_by_date": dict(jobs_by_date)
    }

@router.get("/export/{job_id}/json")
async def export_json(job_id: str):
    """Export job result as JSON"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    job = await db.jobs.find_one({"job_id": job_id})
    if not job or "result" not in job:
        raise HTTPException(status_code=404, detail="Result not found")
    
    result = job["result"]
    json_str = json.dumps(result, indent=2, ensure_ascii=False)
    
    return StreamingResponse(
        io.BytesIO(json_str.encode('utf-8')),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=scrape_{job_id}.json"}
    )

@router.get("/export/{job_id}/csv")
async def export_csv(job_id: str):
    """Export job result as CSV"""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    job = await db.jobs.find_one({"job_id": job_id})
    if not job or "result" not in job:
        raise HTTPException(status_code=404, detail="Result not found")
        
    result = job["result"]
    data = result.get("data", {})
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Field", "Value"])
    writer.writerow(["Job ID", result.get("job_id")])
    writer.writerow(["URL", result.get("url")])
    writer.writerow(["Status", result.get("status")])
    writer.writerow(["Created At", job.get("created_at")])
    
    if data:
        if "title" in data:
            writer.writerow(["Title", data.get("title")])
            
        if "links" in data and data["links"]:
            writer.writerow([])
            writer.writerow(["Links"])
            writer.writerow(["Text", "URL"])
            for link in data["links"][:100]:
                writer.writerow([link.get("text", ""), link.get("href", "")])
                
        if "images" in data and data["images"]:
            writer.writerow([])
            writer.writerow(["Images"])
            writer.writerow(["Alt", "Source"])
            for img in data["images"][:100]:
                writer.writerow([img.get("alt", ""), img.get("src", "")])

    csv_str = output.getvalue()
    return StreamingResponse(
        io.BytesIO(csv_str.encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=scrape_{job_id}.csv"}
    )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "web-scraper-api", "database": "connected" if get_database() is not None else "disconnected"}
