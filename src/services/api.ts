import axios from 'axios';
import type { FuelRecord } from '../types';
import type { Api, EfficiencyRecord } from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for authentication
axiosInstance.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug log
  console.log('Request with auth:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    token: token ? 'Present' : 'Not present'
  });
  
  return request;
});

// Add interceptor for debugging
axiosInstance.interceptors.request.use(request => {
  console.log('Request:', {
    fullUrl: `${API_URL}${request.url}`,
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });

    // Si el error es de autenticación (401), no eliminamos el token
    // Solo lo eliminamos si el endpoint es /auth/verify
    if (error.response?.status === 401 && error.config?.url === '/auth/verify') {
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  }
);

// Función auxiliar para agregar el token a las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Servicio para registros de combustible
export const fuelService = {
  getAllRecords: async (): Promise<FuelRecord[]> => {
    try {
      const response = await axiosInstance.get('/fuel');
      
      if (!response.data) {
        console.warn('No data received from API');
        return [];
      }

      const records = response.data.map((record: any) => ({
        ...record,
        _id: record._id || record.id,
        date: new Date(record.date)
      }));

      return records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  createRecord: async (record: Omit<FuelRecord, '_id'>): Promise<FuelRecord> => {
    try {
      const response = await axiosInstance.post('/fuel', {
        ...record,
        date: record.date || new Date().toISOString(),
      });
      return {
        ...response.data,
        _id: response.data._id || response.data.id,
        date: new Date(response.data.date)
      };
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  },

  updateRecord: async (id: string, record: Partial<FuelRecord>): Promise<FuelRecord> => {
    try {
      const response = await axiosInstance.put(`/fuel/${id}`, record);
      return {
        ...response.data,
        _id: response.data._id || response.data.id,
        date: new Date(response.data.date)
      };
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  },

  deleteRecord: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/fuel/${id}`);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  },
};

export const efficiencyService = {
  createRecord: async (recordData: EfficiencyRecord): Promise<EfficiencyRecord> => {
    try {
      const response = await fetch(`${API_URL}/efficiency/records`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error('Error al crear registro de eficiencia');
      }

      return response.json();
    } catch (error) {
      console.error('Error al crear registro de eficiencia:', error);
      throw error;
    }
  },
};

// Implementación del objeto api
export const api: Api = {
  auth: {
    login: async (email, password) => {
      console.log('Login attempt with:', { email });
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const responseData = await response.json();
      console.log('Login response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al iniciar sesión');
      }

      return responseData;
    },

    register: async (name, email, password) => {
      console.log('Register attempt with:', { name, email });
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('Register response status:', response.status);
      const responseData = await response.json();
      console.log('Register response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al registrar usuario');
      }

      return responseData;
    },

    verifyToken: async (token) => {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return response.json();
    },
  },

  efficiency: {
    createRecord: async (recordData) => {
      const response = await fetch(`${API_URL}/efficiency/records`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error('Error al crear registro de eficiencia');
      }

      return response.json();
    },
  },
}; 