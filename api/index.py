"""
Vercel serverless function entry point for FastAPI
"""
import sys
import os

# Add parent directory to path to import app modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from app.main import app


