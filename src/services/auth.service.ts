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
    console.error('Error en la petición:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401 && 
        error.response?.data?.message?.toLowerCase().includes('expired')) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authAxios.post('/auth/login', { email, password });
      console.log('Respuesta completa del login:', response.data);
      
      // La respuesta viene en response.data.data
      const { data } = response.data;
      
      return {
        token: data.token,
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await authAxios.post('/auth/register', { name, email, password });
      console.log('Respuesta completa del registro:', response.data);
      
      // La respuesta viene en response.data.data
      const { data } = response.data;
      
      return {
        token: data.token,
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  verifyToken: async (token: string): Promise<{ user: User }> => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Respuesta de verificación:', response.data);
      
      const { data } = response.data;
      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error en verificación:', error);
      throw error;
    }
  },
}; 