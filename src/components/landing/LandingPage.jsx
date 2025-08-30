import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  Fade,
  Grow
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Keyframe animations
const aurora = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
`;

const neonPulse = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 10px rgba(168, 85, 247, 0.4),
      0 0 20px rgba(168, 85, 247, 0.3),
      0 0 30px rgba(168, 85, 247, 0.2);
  }
  50% { 
    box-shadow: 
      0 0 20px rgba(168, 85, 247, 0.6),
      0 0 30px rgba(168, 85, 247, 0.5),
      0 0 40px rgba(168, 85, 247, 0.4);
  }
`;

// Styled components
const LandingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(45deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)
  `,
  backgroundSize: '400% 400%',
  animation: `${aurora} 15s ease infinite`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
    `,
    zIndex: 1
  }
}));

const FloatingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))',
  animation: `${float} 6s ease-in-out infinite`,
  zIndex: 1
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  }
}));

const NeonButton = styled(Button)(({ theme, neoncolor }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${neoncolor}`,
  borderRadius: '15px',
  padding: '15px 30px',
  color: '#ffffff',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: `${neoncolor}15`,
    boxShadow: `
      0 0 20px ${neoncolor}40,
      0 0 40px ${neoncolor}20,
      inset 0 0 20px ${neoncolor}10
    `,
    transform: 'translateY(-2px)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${neoncolor}20, transparent)`,
    transition: 'left 0.5s ease'
  },
  '&:hover::before': {
    left: '100%'
  }
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Space Grotesk", "Inter", sans-serif',
  fontSize: 'clamp(3rem, 8vw, 6rem)',
  fontWeight: 800,
  background: 'linear-gradient(45deg, #00d4ff, #a855f7, #10b981)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '2rem',
  textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
  // Remove any box-like styling
  border: 'none',
  backgroundColor: 'transparent',
  boxShadow: 'none'
}));

const TypewriterText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", sans-serif',
  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
  color: '#a1a1aa',
  textAlign: 'center',
  minHeight: '2.5rem',
  marginBottom: '3rem',
  '&::after': {
    content: '"|"',
    animation: 'blink 1s infinite',
    color: '#00d4ff'
  },
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0 }
  }
}));

const FeatureCard = styled(GlassCard)(({ theme }) => ({
  width: '200px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  animation: `${neonPulse} 4s ease-in-out infinite`,
  margin: '0 auto',
  '&:nth-of-type(2)': {
    animationDelay: '1s'
  },
  '&:nth-of-type(3)': {
    animationDelay: '2s'
  },
  '&:nth-of-type(4)': {
    animationDelay: '3s'
  }
}));

const LandingPage = ({ onEnterApp }) => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const taglines = [
    "Your Gateway to Dream Placements",
    "Streamline Campus Recruitment",
    "Connect Students, TPOs & Companies",
    "Practice, Apply, Get Placed"
  ];

  useEffect(() => {
    let timeout;
    const currentText = taglines[currentTagline];
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTagline, taglines]);

  const features = [
    {
      icon: TrendingUpIcon,
      title: "Smart Analytics",
      description: "Track your placement journey with detailed insights"
    },
    {
      icon: AssignmentIcon,
      title: "Resume Builder",
      description: "Create professional resumes with AI assistance"
    },
    {
      icon: QuizIcon,
      title: "Practice Tests",
      description: "Ace your interviews with mock tests"
    },
    {
      icon: NotificationsIcon,
      title: "Real-time Updates",
      description: "Never miss important placement notifications"
    }
  ];

  return (
    <LandingContainer>
      {/* Floating shapes */}
      <FloatingShape
        sx={{
          width: 100,
          height: 100,
          top: '10%',
          left: '10%',
          animationDelay: '0s'
        }}
      />
      <FloatingShape
        sx={{
          width: 150,
          height: 150,
          top: '60%',
          right: '10%',
          animationDelay: '2s'
        }}
      />
      <FloatingShape
        sx={{
          width: 80,
          height: 80,
          bottom: '20%',
          left: '20%',
          animationDelay: '4s'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        <Stack spacing={6} alignItems="center">
          {/* Hero Section */}
          <Fade in timeout={1000}>
            <Box textAlign="center" sx={{ background: 'transparent' }}>
              <BrandTitle variant="h1">
                Placemint
              </BrandTitle>
              <TypewriterText variant="h4">
                {displayText}
              </TypewriterText>
            </Box>
          </Fade>

          {/* CTA Buttons */}
          <Grow in timeout={1500}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={4} 
              sx={{ width: '100%', justifyContent: 'center' }}
            >
              <NeonButton
                neoncolor="#00d4ff"
                startIcon={<SchoolIcon />}
                onClick={() => onEnterApp('student')}
                size="large"
              >
                Sign Up as Student
              </NeonButton>
              <NeonButton
                neoncolor="#a855f7"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => onEnterApp('tpo')}
                size="large"
              >
                Sign Up as TPO
              </NeonButton>
              <NeonButton
                neoncolor="#10b981"
                startIcon={<BusinessIcon />}
                onClick={() => onEnterApp('company')}
                size="large"
              >
                Sign Up as Company
              </NeonButton>
            </Stack>
          </Grow>

          {/* Features Grid */}
          <Box sx={{ width: '100%', mt: 8 }}>
            <Typography
              variant="h3"
              sx={{
                color: '#ffffff',
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                fontSize: 'clamp(2rem, 5vw, 3rem)'
              }}
            >
              Why Choose Placemint?
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={4} 
              sx={{ 
                justifyContent: 'center', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 4
              }}
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Grow in timeout={2000 + index * 200} key={index}>
                    <FeatureCard>
                      <CardContent sx={{ 
                        textAlign: 'center',
                        padding: '16px',
                        '&:last-child': {
                          paddingBottom: '16px'
                        }
                      }}>
                        <IconComponent 
                          sx={{ 
                            fontSize: 40, 
                            color: '#00d4ff', 
                            mb: 1.5 
                          }} 
                        />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: '#ffffff', 
                            fontWeight: 600, 
                            mb: 1,
                            fontSize: '0.9rem'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#a1a1aa',
                            lineHeight: 1.4,
                            fontSize: '0.75rem'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Grow>
                );
              })}
            </Stack>
          </Box>

          {/* Bottom CTA */}
          <Fade in timeout={3000}>
            <Box textAlign="center" sx={{ mt: 8 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#a1a1aa',
                  mb: 3,
                  fontSize: '1.1rem'
                }}
              >
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => onEnterApp('login')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Fade>
        </Stack>
      </Container>
    </LandingContainer>
  );
};

export default LandingPage;