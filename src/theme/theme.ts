import { createTheme, alpha } from '@mui/material/styles';

const createCustomTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        light: '#60A5FA',
        dark: '#1E40AF',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isLight ? '#F8FAFC' : '#0F172A',
        paper: isLight ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: isLight ? '#1E293B' : '#F8FAFC',
        secondary: isLight ? '#64748B' : '#94A3B8',
      },
      error: {
        main: '#EF4444',
        light: '#FCA5A5',
        dark: '#B91C1C',
      },
      success: {
        main: '#10B981',
        light: '#6EE7B7',
        dark: '#047857',
      },
      info: {
        main: '#3B82F6',
        light: '#93C5FD',
        dark: '#1D4ED8',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
      '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
      '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 10px 15px rgba(0, 0, 0, 0.1)',
      '0px 6px 8px rgba(0, 0, 0, 0.05), 0px 12px 18px rgba(0, 0, 0, 0.1)',
      '0px 8px 10px rgba(0, 0, 0, 0.05), 0px 16px 24px rgba(0, 0, 0, 0.1)',
      '0px 10px 12px rgba(0, 0, 0, 0.05), 0px 20px 30px rgba(0, 0, 0, 0.1)',
      '0px 12px 14px rgba(0, 0, 0, 0.05), 0px 24px 36px rgba(0, 0, 0, 0.1)',
      '0px 14px 16px rgba(0, 0, 0, 0.05), 0px 28px 42px rgba(0, 0, 0, 0.1)',
      '0px 16px 18px rgba(0, 0, 0, 0.05), 0px 32px 48px rgba(0, 0, 0, 0.1)',
      '0px 18px 20px rgba(0, 0, 0, 0.05), 0px 36px 54px rgba(0, 0, 0, 0.1)',
      '0px 20px 22px rgba(0, 0, 0, 0.05), 0px 40px 60px rgba(0, 0, 0, 0.1)',
      '0px 22px 24px rgba(0, 0, 0, 0.05), 0px 44px 66px rgba(0, 0, 0, 0.1)',
      '0px 24px 26px rgba(0, 0, 0, 0.05), 0px 48px 72px rgba(0, 0, 0, 0.1)',
      '0px 26px 28px rgba(0, 0, 0, 0.05), 0px 52px 78px rgba(0, 0, 0, 0.1)',
      '0px 28px 30px rgba(0, 0, 0, 0.05), 0px 56px 84px rgba(0, 0, 0, 0.1)',
      '0px 30px 32px rgba(0, 0, 0, 0.05), 0px 60px 90px rgba(0, 0, 0, 0.1)',
      '0px 32px 34px rgba(0, 0, 0, 0.05), 0px 64px 96px rgba(0, 0, 0, 0.1)',
      '0px 34px 36px rgba(0, 0, 0, 0.05), 0px 68px 102px rgba(0, 0, 0, 0.1)',
      '0px 36px 38px rgba(0, 0, 0, 0.05), 0px 72px 108px rgba(0, 0, 0, 0.1)',
      '0px 38px 40px rgba(0, 0, 0, 0.05), 0px 76px 114px rgba(0, 0, 0, 0.1)',
      '0px 40px 42px rgba(0, 0, 0, 0.05), 0px 80px 120px rgba(0, 0, 0, 0.1)',
      '0px 42px 44px rgba(0, 0, 0, 0.05), 0px 84px 126px rgba(0, 0, 0, 0.1)',
      '0px 44px 46px rgba(0, 0, 0, 0.05), 0px 88px 132px rgba(0, 0, 0, 0.1)',
      '0px 46px 48px rgba(0, 0, 0, 0.05), 0px 92px 138px rgba(0, 0, 0, 0.1)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

export default createCustomTheme; 