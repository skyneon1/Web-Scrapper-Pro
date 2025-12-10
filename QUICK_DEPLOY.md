# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
6. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

### Step 3: Environment Variables (Optional)

In Vercel Dashboard → Settings → Environment Variables:

- `REACT_APP_API_URL`: (Leave empty - uses relative paths)
- `ALLOWED_ORIGINS`: Your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 4: Done! 🎉

Your app is live at: `https://your-app.vercel.app`

## 📋 What's Configured

✅ **Frontend**: React app builds and deploys automatically  
✅ **Backend**: FastAPI converted to serverless functions  
✅ **API Routes**: All `/api/*` endpoints work  
✅ **CORS**: Configured for Vercel domain  
✅ **Build**: Automatic build on every push  

## 🔍 Test Your Deployment

1. Visit your Vercel URL
2. Try creating a scraping job
3. Check the Dashboard
4. View job history

## ⚠️ Important Notes

- **Cold Starts**: First request may be slower (serverless)
- **Time Limits**: 10s (Hobby) or 60s (Pro) per function
- **Playwright**: May not work in serverless - test first
- **Storage**: In-memory (ephemeral) - use database for production

## 🐛 Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure `mangum` is in `requirements.txt`
- Verify Python version

**API not working?**
- Check function logs in Vercel dashboard
- Verify `api/index.py` exists
- Test API endpoints directly

**Frontend errors?**
- Check browser console
- Verify API base URL
- Check CORS configuration

## 📚 More Info

See `VERCEL_SETUP.md` for detailed instructions.

