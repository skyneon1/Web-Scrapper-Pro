import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  LinearProgress,
  Chip,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  PlayArrow,
  TrendingUp,
  Schedule,
  Assessment,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { scraperAPI } from '../services/api';
import Stats3DScene from '../components/3D/Stats3D';
import Chart3DScene from '../components/3D/Chart3D';

function StatCard({ title, value, icon, trend, color, bgColor }) {
  return (
    <Card
      sx={{
        height: '100%',
        background: bgColor || 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: color,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              icon={trend > 0 ? <ArrowUpward /> : <ArrowDownward />}
              label={`${Math.abs(trend)}%`}
              size="small"
              color={trend > 0 ? 'success' : 'error'}
              sx={{ height: 24 }}
            />
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await scraperAPI.getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const successRate = analytics?.success_rate || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time overview of your scraping operations
          </Typography>
        </Box>

        {/* 3D Stats Visualization */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: 400, position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ p: 0, height: '100%' }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    3D Statistics View
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactive 3D visualization of your job statistics
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Stats3DScene stats={analytics} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 400, position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ p: 0, height: '100%' }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    3D Chart View
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bar chart visualization
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Chart3DScene data={analytics} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Jobs"
              value={analytics?.total_jobs || 0}
              icon={<Assessment sx={{ fontSize: 28 }} />}
              color="#667eea"
              trend={5.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={analytics?.completed_jobs || 0}
              icon={<CheckCircle sx={{ fontSize: 28 }} />}
              color="#10b981"
              trend={12.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Failed"
              value={analytics?.failed_jobs || 0}
              icon={<Error sx={{ fontSize: 28 }} />}
              color="#ef4444"
              trend={-2.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Running"
              value={analytics?.running_jobs || 0}
              icon={<PlayArrow sx={{ fontSize: 28 }} />}
              color="#f59e0b"
            />
          </Grid>
        </Grid>

        {/* Metrics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Success Rate
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall job completion rate
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {successRate.toFixed(1)}%
                    </Typography>
                    <Chip
                      label="+2.5%"
                      color="success"
                      size="small"
                      icon={<ArrowUpward />}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={successRate}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        bgcolor: 'success.main',
                      },
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {analytics?.completed_jobs || 0}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {analytics?.total_jobs || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Average Completion Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mean time to complete jobs
                    </Typography>
                  </Box>
                  <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {analytics?.average_completion_time
                      ? `${analytics.average_completion_time.toFixed(2)}s`
                      : 'N/A'}
                  </Typography>
                  {analytics?.average_completion_time && (
                    <Chip
                      label={
                        analytics.average_completion_time < 5
                          ? 'Fast'
                          : analytics.average_completion_time < 10
                          ? 'Normal'
                          : 'Slow'
                      }
                      color={
                        analytics.average_completion_time < 5
                          ? 'success'
                          : analytics.average_completion_time < 10
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ mb: 2 }}
                    />
                  )}
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fastest
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        2.3s
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Slowest
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        15.7s
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Status Breakdown */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Job Status Breakdown
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                        {analytics?.pending_jobs || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Jobs
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderColor: 'success.main',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 0.5 }}>
                        {analytics?.completed_jobs || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed Jobs
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderColor: 'error.main',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', mb: 0.5 }}>
                        {analytics?.failed_jobs || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Failed Jobs
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderColor: 'warning.main',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 0.5 }}>
                        {analytics?.running_jobs || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Running Jobs
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
