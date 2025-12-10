import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  alpha,
  useTheme,
  Paper,
  Avatar,
  Rating,
  Divider,
} from '@mui/material';
import {
  Web,
  Analytics,
  Download,
  Speed,
  Security,
  DataObject,
  CheckCircle,
  ArrowForward,
  TrendingUp,
} from '@mui/icons-material';

const features = [
  {
    icon: <Web sx={{ fontSize: 40 }} />,
    title: 'Advanced Web Scraping',
    description: 'Extract data from any website with support for static and JavaScript-rendered pages.',
    color: '#667eea',
  },
  {
    icon: <DataObject sx={{ fontSize: 40 }} />,
    title: 'Metadata Extraction',
    description: 'Automatically extract meta tags, Open Graph, Twitter Cards, and structured data.',
    color: '#764ba2',
  },
  {
    icon: <Analytics sx={{ fontSize: 40 }} />,
    title: 'Site-Wide Crawling',
    description: 'Crawl entire websites with configurable depth and intelligent link following.',
    color: '#f093fb',
  },
  {
    icon: <Download sx={{ fontSize: 40 }} />,
    title: 'Multiple Export Formats',
    description: 'Export your data as JSON or CSV for easy integration with other tools.',
    color: '#4facfe',
  },
  {
    icon: <Speed sx={{ fontSize: 40 }} />,
    title: 'Fast & Efficient',
    description: 'Background job processing ensures your scraping tasks run smoothly.',
    color: '#43e97b',
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Respectful Scraping',
    description: 'Built-in rate limiting and polite headers to respect website policies.',
    color: '#fa709a',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Data Scientist',
    company: 'Tech Corp',
    avatar: 'SJ',
    rating: 5,
    text: 'Web Scraper Pro has revolutionized how we collect data. The API is intuitive and the results are always accurate.',
  },
  {
    name: 'Michael Chen',
    role: 'Developer',
    company: 'StartupXYZ',
    avatar: 'MC',
    rating: 5,
    text: 'The site-wide crawling feature saved us weeks of manual work. Highly recommended!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'DataFlow Inc',
    avatar: 'ER',
    rating: 5,
    text: 'Best scraping tool we\'ve used. The metadata extraction is incredibly detailed.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 scraping jobs/month',
      'Basic metadata extraction',
      'JSON export',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'month',
    features: [
      'Unlimited scraping jobs',
      'Advanced metadata extraction',
      'Site-wide crawling',
      'CSV & JSON export',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Custom rate limits',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Professional Hero Section - No Blue Banner */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Enterprise Web Scraping Platform"
                sx={{
                  mb: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                  color: 'text.primary',
                }}
              >
                Extract Data from
                <br />
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Any Website
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  maxWidth: '600px',
                  fontWeight: 400,
                  lineHeight: 1.7,
                }}
              >
                Powerful web scraping tool with advanced features for metadata extraction,
                site crawling, and data export. Built with modern technologies for reliability and performance.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/scraper')}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  View Dashboard
                </Button>
              </Stack>

              {/* Stats */}
              <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Active Users
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    1M+
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Jobs Completed
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Uptime
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                  </Stack>
                </Box>
                <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
                  <Typography
                    component="pre"
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#c9d1d9' : '#24292f',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      m: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {`POST /api/scrape
{
  "url": "example.com",
  "crawl_site": true,
  "max_pages": 10
}

→ Job created
→ Status: Processing
→ Results available`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip
                label="Features"
                sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Everything You Need
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Powerful features designed to make web scraping simple, fast, and reliable
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'all 0.3s',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            color: feature.color,
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Code Example Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Developer Friendly"
                sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600 }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Simple API, Powerful Results
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                Integrate web scraping into your applications with our RESTful API.
                Create scraping jobs, monitor progress, and export results programmatically.
              </Typography>
              <Stack spacing={2}>
                {[
                  'Metadata extraction',
                  'Contact information detection',
                  'Social media links',
                  'Site-wide crawling',
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircle sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Typography sx={{ fontWeight: 500 }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                  borderRadius: 2,
                  p: 3,
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  component="pre"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#c9d1d9' : '#24292f',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    m: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {`POST /api/scrape
{
  "url": "example.com",
  "crawl_site": true,
  "max_pages": 10,
  "use_playwright": false
}

Response:
{
  "job_id": "uuid",
  "status": "pending",
  "message": "Job created"
}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                label="Testimonials"
                sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Loved by Developers
              </Typography>
              <Typography variant="h6" color="text.secondary">
                See what our users are saying
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                          "{testimonial.text}"
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {testimonial.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {testimonial.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {testimonial.role} at {testimonial.company}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Pricing"
              sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600 }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Choose the plan that's right for you
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      border: plan.popular ? '2px solid' : '1px solid',
                      borderColor: plan.popular ? 'primary.main' : 'divider',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="Most Popular"
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                        {plan.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          {plan.price}
                        </Typography>
                        {plan.period && (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            /{plan.period}
                          </Typography>
                        )}
                      </Box>
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {plan.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      <Button
                        fullWidth
                        variant={plan.popular ? 'contained' : 'outlined'}
                        onClick={() => navigate('/scraper')}
                        sx={{ py: 1.5, textTransform: 'none', fontWeight: 600 }}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 3,
                p: { xs: 4, md: 8 },
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Ready to Start Scraping?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Join thousands of developers who trust Web Scraper Pro for their data extraction needs
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/scraper')}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Start Scraping Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  View Dashboard
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
