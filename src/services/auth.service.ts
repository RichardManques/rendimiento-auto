import axios from 'axios';
import type { LoginResponse, RegisterResponse, User } from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios para auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar el token a todas las peticiones
authAxios.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
  return request;
});

// Interceptor para manejar respuestas y errores
authAxios.interceptors.response.use(
  response => response,
  error => {
    // Solo eliminamos el token si el servidor específicamente nos dice que expiró
    if (error.response?.status === 401 && 
        error.response?.data?.message?.toLowerCase().includes('expired')) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await authAxios.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await authAxios.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  verifyToken: async (token: string): Promise<{ user: User }> => {
    const response = await authAxios.get('/auth/verify');
    return response.data;
  },
}; 