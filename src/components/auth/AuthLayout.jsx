import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box 
      className="min-h-screen flex items-center justify-center"
      sx={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
          zIndex: 1
        }}
      />
      
      {/* Floating Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(16, 185, 129, 0.1))',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={4} alignItems="center">
          {/* Brand Header */}
          <Box className="text-center">
            <Typography 
              variant="h2" 
              className="font-bold mb-2"
              sx={{ 
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 'clamp(2rem, 5vw, 3rem)'
              }}
            >
              Placemint
            </Typography>
            <Typography variant="h6" color="text.secondary" className="font-medium">
              Your Gateway to Career Success
            </Typography>
          </Box>

          {/* Auth Form */}
          {children}
        </Stack>
      </Container>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </Box>
  );
};

export default AuthLayout;