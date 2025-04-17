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
  styled
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
  backgroundColor: 'white',
  color: 'black',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  height: 64,
});

const NavButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.87)',
  textTransform: 'none',
  padding: '6px 8px',
  minWidth: 'auto',
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
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

  const renderProfileMenu = (
    <Menu
      anchorEl={profileMenuAnchor}
      open={Boolean(profileMenuAnchor)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1.5,
          minWidth: 220,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
            gap: 1.5,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user?.name || 'Usuario'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {user?.email || 'usuario@email.com'}
        </Typography>
      </Box>
      <Divider />
      <MenuItem 
        onClick={() => {
          handleProfileMenuClose();
          window.location.href = '/settings';
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <SettingsIcon fontSize="small" />
        <Typography>Perfil</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LogoutIcon fontSize="small" />
        <Typography>Cerrar Sesión</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <Box sx={{ flex: 1 }} />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mr: 1
          }}>
            {!isMobile && menuItems.map((item) => (
              <Box key={item.text} component={Link} to={item.path} sx={{ textDecoration: 'none' }}>
                <NavButton
                  active={location.pathname === item.path}
                  startIcon={item.icon}
                  sx={{ 
                    fontSize: '0.9rem',
                    '& .MuiButton-startIcon': {
                      mr: 0.5
                    }
                  }}
                >
                  {item.text}
                </NavButton>
              </Box>
            ))}
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            <IconButton 
              onClick={handleProfileMenuOpen}
              sx={{ ml: 0.5 }}
            >
              <Avatar sx={{ 
                width: 35, 
                height: 35, 
                bgcolor: 'transparent'
              }}>
                <PersonIcon sx={{ color: 'black', fontSize: '1.8rem' }} />
              </Avatar>
            </IconButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              gap: 1.5,
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
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            {item.icon}
            <Typography>{item.text}</Typography>
          </MenuItem>
        ))}
      </Menu>
      {renderProfileMenu}
      <Toolbar />
    </>
  );
};

export default Navbar; 