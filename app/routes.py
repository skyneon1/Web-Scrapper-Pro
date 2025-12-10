from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Query
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import json
import os
import csv
import io
from collections import defaultdict

from app.models import ScrapeRequest, ScrapeResult, ScrapeJobStatus, AnalyticsResponse
from app.scraper import WebScraper

router = APIRouter()

# In-memory storage (replace with database in production)
jobs_storage = {}
results_storage = {}

scraper = WebScraper()


def save_result(job_id: str, result: dict):
    """Save scraping result to file"""
    # Use /tmp for Vercel/Serverless environments
    if os.environ.get("VERCEL") or os.access("/", os.W_OK) is False:
        results_dir = os.path.join("/tmp", "results")
    else:
        results_dir = os.getenv("RESULTS_DIR", "results")
        
    try:
        os.makedirs(results_dir, exist_ok=True)
        file_path = os.path.join(results_dir, f"{job_id}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: Could not save result to disk: {e}")
        # Continue execution even if save fails
        pass


def run_scrape_job(job_id: str, url: str, selectors: List[str] = None, 
                   use_playwright: bool = False, wait_time: int = 5,
                   crawl_site: bool = False, max_pages: int = 10):
    """Background task to run scraping job"""
    start_time = datetime.now()
    try:
        # Update job status
        jobs_storage[job_id]["status"] = ScrapeJobStatus.RUNNING
        
        # Run scraper
        result_data = scraper.scrape(
            url=url,
            selectors=selectors,
            use_playwright=use_playwright,
            wait_time=wait_time,
            crawl_site=crawl_site,
            max_pages=max_pages
        )
        
        completed_at = datetime.now()
        duration = (completed_at - start_time).total_seconds()
        
        # Create result
        result = {
            "job_id": job_id,
            "url": url,
            "status": ScrapeJobStatus.COMPLETED,
            "data": result_data,
            "error": None,
            "created_at": jobs_storage[job_id]["created_at"].isoformat(),
            "completed_at": completed_at.isoformat(),
            "duration_seconds": duration
        }
        
        # Store result
        results_storage[job_id] = result
        save_result(job_id, result)
        
        # Update job status
        jobs_storage[job_id]["status"] = ScrapeJobStatus.COMPLETED
        jobs_storage[job_id]["completed_at"] = completed_at
        jobs_storage[job_id]["duration_seconds"] = duration
        
    except Exception as e:
        completed_at = datetime.now()
        # Handle error
        result = {
            "job_id": job_id,
            "url": url,
            "status": ScrapeJobStatus.FAILED,
            "data": None,
            "error": str(e),
            "created_at": jobs_storage[job_id]["created_at"].isoformat(),
            "completed_at": completed_at.isoformat()
        }
        
        results_storage[job_id] = result
        save_result(job_id, result)
        jobs_storage[job_id]["status"] = ScrapeJobStatus.FAILED
        jobs_storage[job_id]["completed_at"] = completed_at


@router.post("/scrape", response_model=dict)
async def create_scrape_job(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Create a new scraping job"""
    job_id = str(uuid.uuid4())
    
    # Create job record
    job = {
        "job_id": job_id,
        "url": request.url,
        "selectors": request.selectors,
        "use_playwright": request.use_playwright,
        "wait_time": request.wait_time,
        "crawl_site": request.crawl_site,
        "max_pages": request.max_pages or 10,
        "status": ScrapeJobStatus.PENDING,
        "created_at": datetime.now()
    }
    
    jobs_storage[job_id] = job
    
    # Add background task
    background_tasks.add_task(
        run_scrape_job,
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
    if job_id not in results_storage:
        if job_id in jobs_storage:
            # Job exists but result not ready
            job = jobs_storage[job_id]
            return {
                "job_id": job_id,
                "url": job["url"],
                "status": job["status"],
                "data": None,
                "error": None,
                "created_at": job["created_at"],
                "completed_at": job.get("completed_at")
            }
        else:
            raise HTTPException(status_code=404, detail="Job not found")
    
    result = results_storage[job_id]
    return result


@router.get("/jobs", response_model=List[dict])
async def list_jobs(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all scraping jobs with optional filtering"""
    jobs = list(jobs_storage.values())
    
    # Filter by status if provided
    if status:
        jobs = [job for job in jobs if job["status"] == status]
    
    # Sort by created_at descending
    jobs.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Paginate
    paginated_jobs = jobs[offset:offset + limit]
    
    return [
        {
            "job_id": job["job_id"],
            "url": job["url"],
            "status": job["status"],
            "created_at": job["created_at"].isoformat(),
            "completed_at": job.get("completed_at").isoformat() if job.get("completed_at") else None,
            "duration_seconds": job.get("duration_seconds")
        }
        for job in paginated_jobs
    ]


@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get job details by job ID"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs_storage[job_id]
    result = None
    if job_id in results_storage:
        result = results_storage[job_id]
    
    return {
        "job_id": job_id,
        "url": job["url"],
        "status": job["status"],
        "data": result.get("data") if result else None,
        "error": result.get("error") if result else None,
        "created_at": job["created_at"].isoformat() if hasattr(job["created_at"], "isoformat") else job["created_at"],
        "completed_at": job.get("completed_at").isoformat() if job.get("completed_at") and hasattr(job.get("completed_at"), "isoformat") else job.get("completed_at"),
        "duration_seconds": job.get("duration_seconds")
    }


@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a scraping job and its result"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Remove from storage
    del jobs_storage[job_id]
    if job_id in results_storage:
        del results_storage[job_id]
    
    # Delete result file
    results_dir = os.getenv("RESULTS_DIR", "results")
    file_path = os.path.join(results_dir, f"{job_id}.json")
    if os.path.exists(file_path):
        os.remove(file_path)
    
    return {"message": "Job deleted successfully"}


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Get analytics and statistics"""
    jobs = list(jobs_storage.values())
    results = list(results_storage.values())
    
    total_jobs = len(jobs)
    completed_jobs = sum(1 for j in jobs if j["status"] == ScrapeJobStatus.COMPLETED)
    failed_jobs = sum(1 for j in jobs if j["status"] == ScrapeJobStatus.FAILED)
    pending_jobs = sum(1 for j in jobs if j["status"] == ScrapeJobStatus.PENDING)
    running_jobs = sum(1 for j in jobs if j["status"] == ScrapeJobStatus.RUNNING)
    
    success_rate = (completed_jobs / total_jobs * 100) if total_jobs > 0 else 0
    
    # Calculate average completion time
    completed_with_duration = [
        r for r in results 
        if r.get("status") == ScrapeJobStatus.COMPLETED and "duration_seconds" in r
    ]
    avg_completion_time = (
        sum(r["duration_seconds"] for r in completed_with_duration) / len(completed_with_duration)
        if completed_with_duration else None
    )
    
    # Jobs by date
    jobs_by_date = defaultdict(int)
    for job in jobs:
        date_str = job["created_at"].date().isoformat()
        jobs_by_date[date_str] += 1
    
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
    if job_id not in results_storage:
        raise HTTPException(status_code=404, detail="Result not found")
    
    result = results_storage[job_id]
    json_str = json.dumps(result, indent=2, ensure_ascii=False)
    
    return StreamingResponse(
        io.BytesIO(json_str.encode('utf-8')),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=scrape_{job_id}.json"}
    )


@router.get("/export/{job_id}/csv")
async def export_csv(job_id: str):
    """Export job result as CSV"""
    if job_id not in results_storage:
        raise HTTPException(status_code=404, detail="Result not found")
    
    result = results_storage[job_id]
    data = result.get("data", {})
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write headers
    writer.writerow(["Field", "Value"])
    writer.writerow(["Job ID", result["job_id"]])
    writer.writerow(["URL", result["url"]])
    writer.writerow(["Status", result["status"]])
    writer.writerow(["Created At", result["created_at"]])
    
    if data:
        if "title" in data:
            writer.writerow(["Title", data["title"]])
        
        if "links" in data and data["links"]:
            writer.writerow([])
            writer.writerow(["Links"])
            writer.writerow(["Text", "URL"])
            for link in data["links"][:100]:  # Limit to 100 links
                writer.writerow([link.get("text", ""), link.get("href", "")])
        
        if "images" in data and data["images"]:
            writer.writerow([])
            writer.writerow(["Images"])
            writer.writerow(["Alt", "Source"])
            for img in data["images"][:100]:  # Limit to 100 images
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
    return {"status": "healthy", "service": "web-scraper-api"}
