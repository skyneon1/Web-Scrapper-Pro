#!/usr/bin/env python3
"""
Build script for Vercel deployment
Replaces requirements.txt with requirements-vercel.txt to exclude Playwright
"""
import shutil
import os
import sys

def main():
    """Replace requirements.txt with Vercel-compatible version"""
    vercel_requirements = "requirements-vercel.txt"
    requirements = "requirements.txt"
    
    if os.path.exists(vercel_requirements):
        print(f"Copying {vercel_requirements} to {requirements} for Vercel build...")
        shutil.copy(vercel_requirements, requirements)
        print("✓ Requirements file updated for Vercel")
        return 0
    else:
        print(f"Warning: {vercel_requirements} not found, using existing {requirements}")
        return 0

if __name__ == "__main__":
    sys.exit(main())

