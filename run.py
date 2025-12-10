#!/usr/bin/env python3
"""
Simple script to run the web scraper application
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    # Create results directory if it doesn't exist
    results_dir = os.getenv("RESULTS_DIR", "results")
    os.makedirs(results_dir, exist_ok=True)
    
    print(f"Starting Web Scraper API on http://{host}:{port}")
    print(f"Results will be saved to: {results_dir}")
    print(f"API docs available at: http://{host}:{port}/docs")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True
    )

