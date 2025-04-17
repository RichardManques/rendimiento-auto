import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuario autenticado, redirigiendo al dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 100); // Pequeño retraso para asegurar que el estado se ha actualizado
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
      // La redirección se manejará en el useEffect
    } catch (error) {
      console.error('Error en login:', error);
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Iniciar Sesión
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Ingresa tus credenciales para acceder a tu cuenta
        </Typography>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Iniciar Sesión
            </Button>
            <Typography variant="body2" align="center">
              ¿No tienes una cuenta?{' '}
              <Link component={RouterLink} to="/register">
                Regístrate
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 