from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ScrapeJobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ScrapeRequest(BaseModel):
    url: str  # Can be domain or full URL
    selectors: Optional[List[str]] = None  # CSS selectors
    use_playwright: bool = False  # Use Playwright for JS-heavy sites
    wait_time: Optional[int] = 5  # Wait time for Playwright (seconds)
    crawl_site: bool = False  # If True and domain provided, crawl entire site
    max_pages: Optional[int] = 10  # Maximum pages to crawl


class ScrapeResult(BaseModel):
    job_id: str
    url: str
    status: ScrapeJobStatus
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None


class ScrapeJob(BaseModel):
    job_id: str
    url: str
    selectors: Optional[List[str]] = None
    use_playwright: bool = False
    wait_time: Optional[int] = 5
    status: ScrapeJobStatus
    created_at: datetime
    completed_at: Optional[datetime] = None


class AnalyticsResponse(BaseModel):
    total_jobs: int
    completed_jobs: int
    failed_jobs: int
    pending_jobs: int
    running_jobs: int
    success_rate: float
    average_completion_time: Optional[float] = None
    jobs_by_date: Dict[str, int]

