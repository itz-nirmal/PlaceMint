// Modern cyberpunk theme for Placemint with glassmorphism and neon accents
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      light: '#33ddff',
      dark: '#00a8cc',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#a855f7',
      light: '#ba68f8',
      dark: '#8b5cf6',
      contrastText: '#ffffff'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff'
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0f0f23',
      paper: 'rgba(255, 255, 255, 0.05)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      disabled: '#6b7280'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    // Custom neon colors
    neon: {
      blue: '#00d4ff',
      purple: '#a855f7',
      green: '#10b981',
      pink: '#ec4899',
      yellow: '#eab308'
    }
  },
  typography: {
    fontFamily: '"Inter", "Space Grotesk", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.6
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.03em'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 16px 32px rgba(0, 0, 0, 0.18)',
    // Neon shadows
    '0 0 20px rgba(0, 212, 255, 0.3)',
    '0 0 30px rgba(168, 85, 247, 0.3)',
    '0 0 40px rgba(16, 185, 129, 0.3)',
    // Glass shadows
    '0px 8px 32px rgba(0, 0, 0, 0.3), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
    '0px 16px 48px rgba(0, 0, 0, 0.4), inset 0px 1px 0px rgba(255, 255, 255, 0.1)',
    // Enhanced shadows for depth
    '0px 20px 60px rgba(0, 0, 0, 0.5), 0px 0px 40px rgba(0, 212, 255, 0.1)',
    '0px 24px 72px rgba(0, 0, 0, 0.6), 0px 0px 50px rgba(168, 85, 247, 0.1)',
    '0px 32px 96px rgba(0, 0, 0, 0.7), 0px 0px 60px rgba(16, 185, 129, 0.1)',
    '0px 40px 120px rgba(0, 0, 0, 0.8), 0px 0px 80px rgba(0, 212, 255, 0.2)',
    // Maximum depth shadows
    '0px 48px 144px rgba(0, 0, 0, 0.9), 0px 0px 100px rgba(168, 85, 247, 0.2)',
    '0px 56px 168px rgba(0, 0, 0, 0.95), 0px 0px 120px rgba(16, 185, 129, 0.2)',
    '0px 64px 192px rgba(0, 0, 0, 1), 0px 0px 140px rgba(0, 212, 255, 0.3)',
    '0px 72px 216px rgba(0, 0, 0, 1), 0px 0px 160px rgba(168, 85, 247, 0.3)',
    '0px 80px 240px rgba(0, 0, 0, 1), 0px 0px 180px rgba(16, 185, 129, 0.3)',
    '0px 88px 264px rgba(0, 0, 0, 1), 0px 0px 200px rgba(0, 212, 255, 0.4)',
    '0px 96px 288px rgba(0, 0, 0, 1), 0px 0px 220px rgba(168, 85, 247, 0.4)',
    '0px 104px 312px rgba(0, 0, 0, 1), 0px 0px 240px rgba(16, 185, 129, 0.4)',
    '0px 112px 336px rgba(0, 0, 0, 1), 0px 0px 260px rgba(0, 212, 255, 0.5)',
    '0px 120px 360px rgba(0, 0, 0, 1), 0px 0px 280px rgba(168, 85, 247, 0.5)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease'
        },
        contained: {
          background: 'linear-gradient(45deg, #00d4ff, #a855f7)',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00b4d8, #9333ea)',
            boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.5)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4ff',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
            }
          }
        }
      }
    }
  }
});

export default theme;