import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import createCustomTheme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import '@fontsource/inter';
import './styles/globals.css';
import { useLocation } from 'react-router-dom';

const AppContent: React.FC<{ mode: 'light' | 'dark', toggleTheme: () => void }> = ({ mode, toggleTheme }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme => theme.palette.background.default,
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      {!isAuthPage && <Navbar onThemeToggle={toggleTheme} currentTheme={mode} />}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: isAuthPage ? '100vh' : 'calc(100vh - 64px)',
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = React.useMemo(() => createCustomTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <AuthProvider>
          <BrowserRouter>
            <AppContent mode={mode} toggleTheme={toggleTheme} />
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
