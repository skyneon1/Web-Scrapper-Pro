from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.routes import router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Web Scraper API",
    description="A modern web scraping API",
    version="1.0.0"
)

# CORS middleware
# Get allowed origins from environment or use wildcard for development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",") if os.getenv("ALLOWED_ORIGINS") else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["scraper"])

# Serve React build files
react_build_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(react_build_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(react_build_dir, "static")), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all routes"""
        if full_path.startswith("api/"):
            return {"error": "API endpoint not found"}
        
        file_path = os.path.join(react_build_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Serve index.html for React Router
        index_path = os.path.join(react_build_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        
        return {"message": "Web Scraper API", "docs": "/docs"}
else:
    # API-only mode when React build doesn't exist
    @app.get("/")
    async def read_root():
        return {"message": "Web Scraper API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
