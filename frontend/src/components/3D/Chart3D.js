import React from 'react';
import { Box, Typography } from '@mui/material';

// Simple 2D fallback version that works without 3D libraries
function Chart3DScene({ data }) {
  const bars = [
    { 
      height: data?.completed_jobs || 0, 
      color: '#10b981', 
      label: 'Completed',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    { 
      height: data?.failed_jobs || 0, 
      color: '#ef4444', 
      label: 'Failed',
      gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
    },
    { 
      height: data?.running_jobs || 0, 
      color: '#f59e0b', 
      label: 'Running',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      height: data?.pending_jobs || 0, 
      color: '#8b5cf6', 
      label: 'Pending',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      height: data?.success_rate || 0, 
      color: '#667eea', 
      label: 'Success %',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
  ];

  const maxHeight = Math.max(...bars.map(b => b.height), 1);

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
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
        }}
      >
        3D Chart View
      </Typography>
      
      <Box
        sx={{
          width: '100%',
          height: '60%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 1.5,
          position: 'relative',
        }}
      >
        {bars.map((bar, index) => (
          <Box 
            key={index} 
            sx={{ 
              textAlign: 'center', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: `${Math.max((bar.height / maxHeight) * 200, 20)}px`,
                background: bar.gradient,
                borderRadius: '8px 8px 0 0',
                mb: 1,
                minHeight: '20px',
                transition: 'height 0.5s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '30%',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px 8px 0 0',
                },
                animation: `growUp 0.8s ease ${index * 0.1}s both`,
                '@keyframes growUp': {
                  from: {
                    height: '20px',
                    opacity: 0,
                  },
                  to: {
                    height: `${Math.max((bar.height / maxHeight) * 200, 20)}px`,
                    opacity: 1,
                  },
                },
              }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.65rem',
                mb: 0.5,
              }}
            >
              {bar.label}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                color: bar.color,
              }}
            >
              {typeof bar.height === 'number' ? bar.height.toFixed(0) : bar.height}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Chart3DScene;
