import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

// Simple 2D fallback version that works without 3D libraries
function Stats3DScene({ stats }) {
  const statItems = [
    { 
      value: stats?.total_jobs || 0, 
      label: 'Total', 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      value: stats?.completed_jobs || 0, 
      label: 'Done', 
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    { 
      value: stats?.failed_jobs || 0, 
      label: 'Failed', 
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
    },
    { 
      value: stats?.running_jobs || 0, 
      label: 'Running', 
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      value: `${stats?.success_rate?.toFixed(0) || 0}%`, 
      label: 'Success', 
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 80%, #764ba2 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.1 },
            '50%': { opacity: 0.2 },
          },
        }}
      />
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        3D Statistics View
      </Typography>
      
      <Grid container spacing={2} sx={{ maxWidth: 500, position: 'relative', zIndex: 1 }}>
        {statItems.map((item, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Card
              sx={{
                background: item.gradient,
                color: 'white',
                textAlign: 'center',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                },
                animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <CardContent sx={{ p: '16px !important' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 0.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.7rem',
                  }}
                >
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Stats3DScene;
