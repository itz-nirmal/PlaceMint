import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: IconComponent, 
  color = 'primary',
  onClick,
  className = ''
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={onClick}
      sx={{ 
        borderLeft: 4, 
        borderLeftColor: `${color}.main`,
        height: '100%'
      }}
    >
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" color="text.secondary" className="font-medium">
            {title}
          </Typography>
          {IconComponent && (
            <IconComponent 
              sx={{ 
                fontSize: 32, 
                color: `${color}.main`,
                opacity: 0.8
              }} 
            />
          )}
        </Box>
        
        <Typography variant="h3" className="font-bold mb-2" color={`${color}.main`}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;