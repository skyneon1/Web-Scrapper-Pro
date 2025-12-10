# Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your code pushed to a GitHub repository

## Deployment Steps

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (project root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following (if needed):
   - `REACT_APP_API_URL`: Leave empty (will use relative paths)
   - `ALLOWED_ORIGINS`: Your Vercel domain (e.g., `https://your-app.vercel.app`)
   - `RESULTS_DIR`: `results` (default)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-app.vercel.app`

## Project Structure for Vercel

```
WebScrapper/
├── api/              # Vercel serverless functions
│   ├── index.py      # Main API handler
│   ├── scrape.py     # Scrape endpoint
│   ├── jobs.py       # Jobs endpoints
│   ├── analytics.py  # Analytics endpoint
│   └── export.py     # Export endpoints
├── app/              # FastAPI application
│   ├── main.py
│   ├── routes.py
│   └── ...
├── frontend/         # React frontend
│   ├── src/
│   └── package.json
├── vercel.json              # Vercel configuration
├── requirements.txt         # Python dependencies (full, for local dev)
├── requirements-vercel.txt  # Python dependencies (without Playwright, for Vercel)
└── vercel-build.py          # Build script to prepare for Vercel
```

## How It Works

1. **Frontend**: Vercel builds the React app and serves it as static files
2. **Backend**: Vercel converts FastAPI routes to serverless functions using Mangum
3. **API Routes**: All `/api/*` requests are routed to Python serverless functions
4. **Static Files**: React build files are served from the root

## API Endpoints

All API endpoints are available at:
- `https://your-app.vercel.app/api/scrape`
- `https://your-app.vercel.app/api/jobs`
- `https://your-app.vercel.app/api/analytics`
- etc.

## Important Notes

1. **Serverless Functions**: Each API endpoint runs as a separate serverless function
2. **Cold Starts**: First request may be slower due to serverless cold starts
3. **Time Limits**: Vercel serverless functions have execution time limits (10s for Hobby, 60s for Pro)
4. **Playwright**: Excluded from Vercel deployment due to size limitations (250MB limit). The app will gracefully handle Playwright requests by returning an error message. For local development, Playwright works normally.
5. **File Storage**: Results are stored in memory (in-memory storage). For production, use a database or file storage service

## Troubleshooting

### Build Fails with "Serverless Function exceeded 250 MB"
- This is fixed! The build automatically uses `requirements-vercel.txt` which excludes Playwright
- If you still see this error, check that `vercel-build.py` is running correctly
- Playwright browser binaries are excluded via `.vercelignore`

### Build Fails
- Check that all dependencies are in `requirements.txt` or `requirements-vercel.txt`
- Ensure `mangum` is installed
- Check build logs in Vercel dashboard

### API Not Working
- Verify API routes are accessible at `/api/*`
- Check function logs in Vercel dashboard
- Ensure CORS is configured correctly

### Frontend Can't Connect to API
- Check `REACT_APP_API_URL` environment variable
- Verify API routes are working in Vercel function logs
- Check browser console for CORS errors

## Production Considerations

1. **Database**: Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. **File Storage**: Use cloud storage (AWS S3, Cloudinary) for results
3. **Background Jobs**: Consider using a job queue (Celery, RQ) for long-running tasks
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Error Handling**: Improve error handling and logging
6. **Monitoring**: Set up monitoring and alerts

## Alternative: Split Deployment

If you encounter issues with full Vercel deployment, consider:
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Render, or Fly.io
- Update `REACT_APP_API_URL` to point to your backend URL

