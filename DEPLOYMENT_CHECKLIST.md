# Vercel Deployment Checklist

## Pre-Deployment

- [x] Created `vercel.json` configuration
- [x] Created `api/index.py` for serverless functions
- [x] Added `mangum` to `requirements.txt`
- [x] Updated `frontend/src/services/api.js` for Vercel
- [x] Added `vercel-build` script to `frontend/package.json`
- [x] Created `.vercelignore` file
- [x] Updated CORS configuration in `app/main.py`

## Files Created/Modified

### New Files
- `vercel.json` - Vercel configuration
- `api/index.py` - Main serverless function handler
- `api/__init__.py` - Python package init
- `.vercelignore` - Files to ignore in deployment
- `VERCEL_SETUP.md` - Deployment guide
- `VERCEL_DEPLOYMENT.md` - Detailed deployment docs

### Modified Files
- `requirements.txt` - Added `mangum==0.17.0`
- `frontend/package.json` - Added `vercel-build` script
- `frontend/src/services/api.js` - Updated for Vercel API paths
- `app/main.py` - Updated CORS configuration
- `README.md` - Updated with Vercel deployment info

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

### 3. Environment Variables (Optional)

Add in Vercel Dashboard → Settings → Environment Variables:
- `REACT_APP_API_URL`: (Leave empty for relative paths)
- `ALLOWED_ORIGINS`: Your Vercel domain URL

### 4. Deploy

Click "Deploy" and wait for build to complete.

## Testing After Deployment

1. Visit your Vercel URL
2. Test frontend loads correctly
3. Test API endpoints:
   - Create a scraping job
   - View job history
   - Check analytics
4. Verify CORS is working (no CORS errors in browser console)

## Troubleshooting

### Build Fails
- Check `requirements.txt` includes `mangum`
- Verify Python version compatibility
- Check build logs in Vercel dashboard

### API Not Working
- Check function logs in Vercel dashboard
- Verify `api/index.py` exists
- Check `vercel.json` routes configuration

### Frontend Can't Connect
- Verify API base URL in `frontend/src/services/api.js`
- Check CORS configuration
- Verify environment variables are set

## Important Notes

⚠️ **Serverless Limitations**:
- Cold starts may cause slower first requests
- Execution time limits (10s Hobby, 60s Pro)
- Playwright may not work in serverless environment
- In-memory storage is ephemeral (use database for production)

✅ **What Works**:
- FastAPI routes as serverless functions
- React frontend deployment
- Static file serving
- API endpoints via `/api/*`

## Next Steps for Production

1. Replace in-memory storage with database
2. Add cloud storage for results
3. Implement proper error handling
4. Add monitoring and logging
5. Set up CI/CD pipeline
6. Configure custom domain

