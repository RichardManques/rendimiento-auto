import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  alpha,
  useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/material/styles';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimelineIcon from '@mui/icons-material/Timeline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RouteIcon from '@mui/icons-material/Route';
import EvStationIcon from '@mui/icons-material/EvStation';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.paper, 1),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.divider, 0.15),
  },
  '& .MuiInputLabel-root': {
    color: alpha(theme.palette.text.primary, 0.7),
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      color: alpha(theme.palette.primary.main, 0.7),
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
  boxShadow: `0 8px 20px -6px ${alpha(theme.palette.primary.main, 0.4)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 24px -8px ${alpha(theme.palette.primary.main, 0.5)}`,
  },
}));

const BackgroundIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  color: alpha(theme.palette.primary.main, 0.08),
  transition: 'all 0.5s ease-in-out',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
  '&:hover': {
    color: alpha(theme.palette.primary.main, 0.12),
    transform: 'scale(1.1) rotate(5deg)',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/login');
    } catch (error) {
      setError('Error al registrar el usuario. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <BackgroundIcon
        sx={{
          top: '5%',
          right: '8%',
          transform: 'rotate(15deg)',
        }}
      >
        <DirectionsCarIcon sx={{ fontSize: 200 }} />
      </BackgroundIcon>
      
      <BackgroundIcon
        sx={{
          top: '30%',
          left: '10%',
          transform: 'rotate(-15deg)',
        }}
      >
        <LocalGasStationIcon sx={{ fontSize: 160 }} />
      </BackgroundIcon>
      
      <BackgroundIcon
        sx={{
          bottom: '20%',
          left: '15%',
          transform: 'rotate(10deg)',
        }}
      >
        <SpeedIcon sx={{ fontSize: 180 }} />
      </BackgroundIcon>
      
      <BackgroundIcon
        sx={{
          top: '15%',
          right: '25%',
          transform: 'rotate(-20deg)',
        }}
      >
        <TimelineIcon sx={{ fontSize: 170 }} />
      </BackgroundIcon>
      
      <BackgroundIcon
        sx={{
          bottom: '25%',
          right: '12%',
          transform: 'rotate(25deg)',
        }}
      >
        <RouteIcon sx={{ fontSize: 150 }} />
      </BackgroundIcon>

      <BackgroundIcon
        sx={{
          bottom: '10%',
          left: '35%',
          transform: 'rotate(-10deg)',
        }}
      >
        <EvStationIcon sx={{ fontSize: 165 }} />
      </BackgroundIcon>

      {/* Animated Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
          animation: 'pulse 10s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 0.7,
            },
            '50%': {
              transform: 'scale(1.5)',
              opacity: 1,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 0.7,
            },
          },
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 80,
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`,
              backdropFilter: 'blur(8px)',
              zIndex: 0,
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              p: 4,
              borderRadius: '24px',
              background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <Box
              sx={{
                mb: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Crear cuenta
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                Regístrate para comenzar a calcular el rendimiento de tu vehículo
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <StyledTextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                InputProps={{
                  startAdornment: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                InputProps={{
                  startAdornment: <EmailOutlinedIcon sx={{ mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ mr: 1 }} />,
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                    '& .MuiAlert-icon': {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
              >
                Crear cuenta
              </StyledButton>

              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                  '& a': {
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                      textDecoration: 'underline',
                    },
                  },
                }}
              >
                ¿Ya tienes una cuenta?{' '}
                <Link component={RouterLink} to="/login">
                  Inicia sesión
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register; 