# Web Scraper Pro

A full-featured web scraping application with a modern React frontend and FastAPI backend, deployable on Vercel.

https://web-scrapper-pro-eight.vercel.app

## Features

- 🎯 **Dashboard**: Real-time statistics and overview with 3D visualizations
- 🕷️ **Web Scraping**: Extract data from any website
- 📊 **Analytics**: Visual charts and job statistics
- 📜 **Job History**: View and manage all scraping jobs with organized data display
- 📥 **Export**: Download results as JSON or CSV
- 🎨 **Modern UI**: Material-UI design with responsive layout and dark mode
- ⚡ **Fast API**: Async FastAPI backend with background jobs
- 🔍 **Advanced Extraction**: Metadata, contact info, social links, and more
- 🌐 **Playwright Support**: Scrape JavaScript-heavy websites
- 🏗️ **Vercel Ready**: Fully configured for Vercel deployment

## Tech Stack

- **Backend**: FastAPI (Python) with Mangum for Vercel
- **Frontend**: React 18 + Material-UI 5 + React Router
- **Scraping**: requests + BeautifulSoup4, Playwright (for JS pages)
- **Storage**: In-memory storage (SQLite ready)
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel (serverless functions)

## Quick Start

### Local Development

#### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python run.py
```

Backend runs at `http://localhost:8000`

#### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
```

Frontend runs at `http://localhost:3000`

## Vercel Deployment

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed deployment instructions.

### Quick Deploy

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel login
   vercel
   ```

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
5. Add environment variables (optional):
   - `REACT_APP_API_URL`: Leave empty for relative paths
   - `ALLOWED_ORIGINS`: Your Vercel domain
6. Deploy!

## Project Structure

```
WebScrapper/
├── api/                 # Vercel serverless functions
│   ├── index.py        # Main API handler
│   └── __init__.py
├── app/                 # Backend application
│   ├── main.py         # FastAPI application
│   ├── routes.py       # API routes
│   ├── scraper.py      # Scraping logic
│   ├── models.py       # Data models
│   └── database.py    # Database models
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service
│   │   └── contexts/   # React contexts
│   └── package.json
├── results/             # Scraped data storage
├── vercel.json         # Vercel configuration
├── requirements.txt    # Python dependencies
├── run.py             # Backend startup script
└── README.md
```

## API Endpoints

- `POST /api/scrape` - Create a new scraping job
- `GET /api/jobs/{job_id}` - Get job details
- `GET /api/jobs` - List all jobs
- `DELETE /api/jobs/{job_id}` - Delete a job
- `GET /api/analytics` - Get analytics and statistics
- `GET /api/export/{job_id}/json` - Export result as JSON
- `GET /api/export/{job_id}/csv` - Export result as CSV
- `GET /api/health` - Health check

View interactive API documentation at `/docs` (when running locally)

## Usage

### Using the Web Interface

1. **Dashboard**: View statistics and overview of all jobs
2. **Scraper**: Create new scraping jobs by entering a URL
3. **History**: View all past jobs, export results, or delete jobs
4. **Analytics**: See visual charts and statistics
5. **Settings**: View application information and configure dark mode

### Creating a Scraping Job

1. Go to the "Scraper" page
2. Enter the URL you want to scrape
3. Optionally enable:
   - **Playwright**: For JavaScript-heavy sites
   - **Site-wide Crawl**: Crawl entire website
   - **Max Pages**: Limit number of pages to crawl
4. Click "Start Scraping"
5. View results in the "History" page

## Features

### Data Extraction

- ✅ Page title and meta tags
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD, microdata)
- ✅ Contact information (emails, phones)
- ✅ Social media links
- ✅ All images with details
- ✅ All links with titles
- ✅ Headings (H1, H2, H3)
- ✅ Paragraphs

### Advanced Options

- **Playwright Mode**: For JavaScript-heavy sites
- **Wait Time**: Configurable wait time for Playwright (1-30 seconds)
- **Site Crawling**: Enable to crawl entire site
- **Max Pages**: Control how many pages to crawl (1-50)

## Environment Variables

- `REACT_APP_API_URL`: Frontend API URL (optional, defaults to `/api`)
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)
- `RESULTS_DIR`: Directory for storing results (default: `results`)
- `USER_AGENT`: Custom user agent for scraping
- `REQUEST_TIMEOUT`: Request timeout in seconds (default: 30)
- `MAX_RETRIES`: Maximum retry attempts (default: 3)

## Production Considerations

1. **Database**: Replace in-memory storage with a database (PostgreSQL, MongoDB)
2. **File Storage**: Use cloud storage (AWS S3, Cloudinary) for results
3. **Background Jobs**: Consider using a job queue (Celery, RQ) for long-running tasks
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Error Handling**: Improve error handling and logging
6. **Monitoring**: Set up monitoring and alerts
7. **Playwright**: May not work in serverless - consider alternatives for JS-heavy sites

## License

MIT
