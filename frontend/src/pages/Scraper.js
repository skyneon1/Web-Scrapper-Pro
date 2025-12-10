import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { scraperAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Scraper() {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState('');
  const [usePlaywright, setUsePlaywright] = useState(false);
  const [waitTime, setWaitTime] = useState(5);
  const [crawlSite, setCrawlSite] = useState(false);
  const [maxPages, setMaxPages] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectorList = selectors
        .split('\n')
        .map(s => s.trim())
        .filter(s => s);

      const response = await scraperAPI.createJob({
        url,
        selectors: selectorList.length > 0 ? selectorList : null,
        use_playwright: usePlaywright,
        wait_time: waitTime,
        crawl_site: crawlSite,
        max_pages: crawlSite ? maxPages : undefined,
      });

      setSuccess(`Job created successfully! Job ID: ${response.job_id}`);
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create scraping job');
    } finally {
      setLoading(false);
    }
  };

  const isDomainOnly = () => {
    if (!url) return false;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.pathname === '/' || urlObj.pathname === '';
    } catch {
      return true;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
          Create Scraping Job
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Extract data from any website with advanced features for metadata, contact info, and site-wide crawling.
        </Typography>

        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="URL or Domain to Scrape"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                margin="normal"
                placeholder="example.com or https://example.com/page"
                helperText={
                  isDomainOnly() && !crawlSite
                    ? "Enter just a domain to scrape the homepage, or enable 'Crawl Entire Site' to crawl multiple pages"
                    : "Enter the full URL or domain name"
                }
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={crawlSite}
                    onChange={(e) => setCrawlSite(e.target.checked)}
                  />
                }
                label="Crawl Entire Site (when domain is provided)"
                sx={{ mb: 2 }}
              />

              {crawlSite && (
                <TextField
                  fullWidth
                  label="Maximum Pages to Crawl"
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value) || 10)}
                  margin="normal"
                  inputProps={{ min: 1, max: 50 }}
                  helperText="Maximum number of pages to crawl from the site"
                  sx={{ mb: 3 }}
                />
              )}

              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Advanced Options</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="CSS Selectors (optional)"
                        multiline
                        rows={4}
                        value={selectors}
                        onChange={(e) => setSelectors(e.target.value)}
                        placeholder="h1&#10;.article-title&#10;#main-content"
                        helperText="Enter CSS selectors, one per line. Leave empty to scrape all content including metadata, contact info, and social links."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={usePlaywright}
                            onChange={(e) => setUsePlaywright(e.target.checked)}
                          />
                        }
                        label="Use Playwright (for JavaScript-heavy sites)"
                      />
                    </Grid>

                    {usePlaywright && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Wait Time (seconds)"
                          type="number"
                          value={waitTime}
                          onChange={(e) => setWaitTime(parseInt(e.target.value) || 5)}
                          inputProps={{ min: 1, max: 30 }}
                          helperText="Time to wait for page to load completely"
                        />
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  {success}
                </Alert>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Creating...' : 'Start Scraping'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/history')}
                >
                  View History
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ mt: 4 }} elevation={1}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              What Gets Extracted
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                  Always Extracted:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip label="Page Title & Meta Tags" size="small" variant="outlined" />
                  <Chip label="Open Graph Tags" size="small" variant="outlined" />
                  <Chip label="Twitter Card Tags" size="small" variant="outlined" />
                  <Chip label="Structured Data (JSON-LD)" size="small" variant="outlined" />
                  <Chip label="Contact Info (Emails, Phones)" size="small" variant="outlined" />
                  <Chip label="Social Media Links" size="small" variant="outlined" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                  When No Selectors:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip label="All Text Content" size="small" variant="outlined" />
                  <Chip label="All Links with Titles" size="small" variant="outlined" />
                  <Chip label="Images with Alt Text" size="small" variant="outlined" />
                  <Chip label="Headings (H1, H2, H3)" size="small" variant="outlined" />
                  <Chip label="Paragraphs" size="small" variant="outlined" />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Scraper;
