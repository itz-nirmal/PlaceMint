import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: IconComponent, 
  color = 'primary',
  onClick,
  className = '',
  trend = null,
  trendDirection = 'up'
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      onClick={onClick}
      sx={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}.main, ${color}.light)`,
        },
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
          borderColor: `${color}.main`,
          boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${color === 'primary' ? 'rgba(0,212,255,0.2)' : color === 'success' ? 'rgba(16,185,129,0.2)' : color === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(168,85,247,0.2)'}`,
        }
      }}
    >
      <CardContent className="p-6">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box className="flex-1">
            <Typography 
              variant="body2" 
              color="text.secondary" 
              className="font-medium mb-3 uppercase tracking-wider"
              sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h3" 
              className="font-bold mb-2" 
              sx={{ 
                color: `${color}.main`,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.1
              }}
            >
              {value}
            </Typography>
            
            {subtitle && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary" className="text-sm">
                  {subtitle}
                </Typography>
                {trend && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: trendDirection === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    {trendDirection === 'up' ? '↗' : '↘'} {trend}
                  </Typography>
                )}
              </Stack>
            )}
          </Box>
          
          {IconComponent && (
            <Box 
              sx={{ 
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${color}.main, ${color}.light)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 64,
                minHeight: 64,
                boxShadow: `0 8px 16px ${color === 'primary' ? 'rgba(0,212,255,0.3)' : color === 'success' ? 'rgba(16,185,129,0.3)' : color === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(168,85,247,0.3)'}`,
              }}
            >
              <IconComponent 
                sx={{ 
                  fontSize: 28, 
                  color: 'white',
                }} 
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;