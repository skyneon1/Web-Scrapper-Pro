# Quick Vercel Deployment Setup

## Step-by-Step Deployment

### 1. Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from Project Root

```bash
# From project root directory
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default)
- Directory? **./** (project root)
- Override settings? **No**

### 4. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
- `REACT_APP_API_URL`: Leave empty (uses relative paths)
- `ALLOWED_ORIGINS`: Your Vercel domain (e.g., `https://your-app.vercel.app`)

### 5. Deploy Production

```bash
vercel --prod
```

## Manual Deployment via GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
6. Add environment variables (see step 4 above)
7. Click "Deploy"

## Important Notes

- **Mangum**: Required for FastAPI on Vercel (already added to requirements.txt)
- **API Routes**: All `/api/*` requests go to serverless functions
- **Cold Starts**: First request may be slower
- **Time Limits**: 10s for Hobby plan, 60s for Pro plan
- **Playwright**: May not work in serverless - consider alternatives for JS-heavy sites

## Testing Locally with Vercel

```bash
vercel dev
```

This runs both frontend and backend locally with Vercel's serverless functions.

## Troubleshooting

### API 404 Errors
- Check that `api/index.py` exists
- Verify `vercel.json` routes are correct
- Check function logs in Vercel dashboard

### Build Errors
- Ensure `mangum` is in requirements.txt
- Check Python version compatibility
- Review build logs in Vercel dashboard

### CORS Errors
- Update `ALLOWED_ORIGINS` environment variable
- Check `app/main.py` CORS configuration

