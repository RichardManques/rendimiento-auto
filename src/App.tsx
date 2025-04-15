import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleRegistration from './pages/VehicleRegistration';
import FuelEfficiency from './pages/FuelEfficiency';
import FullHistory from './pages/FullHistory';
import { AuthProvider } from './contexts/AuthContext';

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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Si hay token, permitimos el acceso. Punto.
  if (localStorage.getItem('token')) {
    return <>{children}</>;
  }

  // Solo si NO hay token, redirigimos al login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

const AppRoutes = () => {
  // Si hay token, mostramos el Navbar
  const hasToken = !!localStorage.getItem('token');

  return (
    <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {hasToken && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/vehicle" element={<PrivateRoute><VehicleRegistration /></PrivateRoute>} />
        <Route path="/rendimiento" element={<PrivateRoute><FuelEfficiency /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><FullHistory /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
