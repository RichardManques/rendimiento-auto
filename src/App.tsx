import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import RecentRecords from './pages/RecentRecords';
import FullHistory from './pages/FullHistory';
import NewRecord from './pages/NewRecord';
import FuelEfficiency from './pages/FuelEfficiency';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0'
    },
    secondary: {
      main: '#FF6B6B',
      light: '#ff8787',
      dark: '#fa5252'
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<RecentRecords />} />
            <Route path="/historial" element={<FullHistory />} />
            <Route path="/nuevo" element={<NewRecord />} />
            <Route path="/rendimiento" element={<FuelEfficiency />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
