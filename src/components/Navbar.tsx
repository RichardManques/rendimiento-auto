import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
  styled,
  alpha,
  Container
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${alpha('#0A1929', 0.96)}, ${alpha('#1A2027', 0.98)})`
    : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.96)}, ${alpha('#FAFBFF', 0.98)})`,
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 1px 24px ${alpha('#000000', 0.12)}`
    : `0 1px 24px ${alpha('#000000', 0.06)}`,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 72,
  padding: '0 !important',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  position: 'relative',
  color: active ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.75),
  textTransform: 'none',
  minWidth: 'auto',
  padding: '8px 16px',
  fontSize: '0.925rem',
  fontWeight: active ? 600 : 500,
  letterSpacing: '-0.01em',
  borderRadius: '12px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active 
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.06),
    transform: 'translateY(-1px)',
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
    '& svg': {
      fontSize: '1.35rem',
      transition: 'transform 0.2s ease',
    },
  },
  '&:hover .MuiButton-startIcon svg': {
    transform: 'scale(1.1)',
  },
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  '& .logo-icon': {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.85)})`,
    boxShadow: `0 4px 18px ${alpha(theme.palette.primary.main, 0.25)}`,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: 'translateZ(0)',
    '&:hover': {
      transform: 'translateZ(0) scale(1.08) rotate(-4deg)',
      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
    }
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 42,
  height: 42,
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}`,
  }
}));

const Navbar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Inicio', path: '/', icon: <HomeIcon /> },
    { text: 'Combustible', path: '/fuel-efficiency', icon: <LocalGasStationIcon /> },
    { text: 'Vehículos', path: '/vehiculos', icon: <DirectionsCarIcon /> },
    { text: 'Historial', path: '/history', icon: <HistoryIcon /> },
  ];

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
          <StyledToolbar>
            <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
              <Logo>
                <Box className="logo-icon">
                  <LocalGasStationIcon sx={{ 
                    color: '#fff',
                    fontSize: '1.5rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }} />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                  }}
                >
                  GasMonitor
                </Typography>
              </Logo>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2
            }}>
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  background: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '6px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.06)}`,
                }}>
                  {menuItems.map((item) => (
                    <Box key={item.text} component={Link} to={item.path} sx={{ textDecoration: 'none' }}>
                      <NavButton
                        active={location.pathname === item.path}
                        startIcon={item.icon}
                      >
                        {item.text}
                      </NavButton>
                    </Box>
                  ))}
                </Box>
              )}

              {isMobile && (
                <StyledIconButton onClick={handleMobileMenuOpen}>
                  <MenuIcon sx={{ fontSize: '1.5rem' }} />
                </StyledIconButton>
              )}

              <StyledIconButton 
                onClick={handleProfileMenuOpen}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.primary.main, 0.12)})`,
                  }
                }}
              >
                <PersonIcon sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: '1.5rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} />
              </StyledIconButton>
            </Box>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 2,
            overflow: 'visible',
            borderRadius: '16px',
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.12)}`,
            '& .MuiMenuItem-root': {
              px: 2.5,
              py: 1.5,
              my: 0.5,
              mx: 1,
              borderRadius: '12px',
              gap: 1.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(4px)',
              },
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              handleMobileMenuClose();
              window.location.href = item.path;
            }}
            selected={location.pathname === item.path}
            sx={{
              color: location.pathname === item.path ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.75),
              backgroundColor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            }}
          >
            {React.cloneElement(item.icon, {
              sx: { 
                color: location.pathname === item.path ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.6),
                fontSize: '1.5rem',
                transition: 'transform 0.2s ease',
                transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
              }
            })}
            <Typography sx={{ 
              fontWeight: location.pathname === item.path ? 600 : 500,
              fontSize: '0.95rem',
              letterSpacing: '-0.01em'
            }}>
              {item.text}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 2,
            minWidth: 240,
            borderRadius: '16px',
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.12)}`,
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 18,
              width: 12,
              height: 12,
              bgcolor: 'inherit',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            },
            '& .MuiMenuItem-root': {
              px: 2.5,
              py: 1.5,
              borderRadius: '12px',
              gap: 1.5,
              margin: '4px 8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(4px)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ 
          px: 3, 
          py: 2.5,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.04)})`,
          borderRadius: '12px',
          margin: '8px',
        }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 600, 
            mb: 0.5,
            fontSize: '1rem',
            letterSpacing: '-0.01em'
          }}>
            {user?.name || 'Usuario'}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: alpha(theme.palette.text.primary, 0.7),
            fontSize: '0.875rem',
            letterSpacing: '-0.01em'
          }}>
            {user?.email || 'usuario@email.com'}
          </Typography>
        </Box>

        <MenuItem 
          onClick={() => {
            handleProfileMenuClose();
            window.location.href = '/settings';
          }}
        >
          <SettingsIcon sx={{ 
            color: alpha(theme.palette.text.primary, 0.7),
            fontSize: '1.4rem'
          }} />
          <Typography sx={{ fontWeight: 500 }}>Perfil</Typography>
        </MenuItem>

        <Divider sx={{ 
          my: 1.5, 
          mx: 2,
          borderColor: alpha(theme.palette.divider, 0.08) 
        }} />

        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            }
          }}
        >
          <LogoutIcon sx={{ fontSize: '1.4rem' }} />
          <Typography sx={{ fontWeight: 500 }}>Cerrar Sesión</Typography>
        </MenuItem>
      </Menu>

      <Toolbar sx={{ minHeight: 72 }} />
    </>
  );
};

export default Navbar;