import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Avatar,
  useTheme
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            sx={{ mr: 2 }}
          >
            <LocalGasStationIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            sx={{ 
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            GasMonitor
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={RouterLink}
            to="/"
            color={isActive('/') ? 'primary' : 'inherit'}
            sx={{
              fontWeight: isActive('/') ? 600 : 400,
              bgcolor: isActive('/') ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: isActive('/') ? 'primary.light' : 'action.hover'
              }
            }}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/historial"
            color={isActive('/historial') ? 'primary' : 'inherit'}
            sx={{
              fontWeight: isActive('/historial') ? 600 : 400,
              bgcolor: isActive('/historial') ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: isActive('/historial') ? 'primary.light' : 'action.hover'
              }
            }}
          >
            Historial
          </Button>
          <Button
            component={RouterLink}
            to="/rendimiento"
            color={isActive('/rendimiento') ? 'primary' : 'inherit'}
            sx={{
              fontWeight: isActive('/rendimiento') ? 600 : 400,
              bgcolor: isActive('/rendimiento') ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: isActive('/rendimiento') ? 'primary.light' : 'action.hover'
              }
            }}
          >
            Rendimiento
          </Button>
        </Box>

        <Box sx={{ ml: 2 }}>
          <Avatar 
            sx={{ 
              width: 35, 
              height: 35,
              bgcolor: theme.palette.primary.main
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 