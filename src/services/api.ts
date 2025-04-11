import axios from 'axios';
import { FuelRecord } from '../types';

// Usar localhost para desarrollo local
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for debugging
api.interceptors.request.use(request => {
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

api.interceptors.response.use(
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
    return Promise.reject(error);
  }
);

export const fuelService = {
  getAllRecords: async (): Promise<FuelRecord[]> => {
    try {
      console.log('Fetching records from:', `${API_URL}/fuel`);
      const response = await api.get('/fuel');
      
      if (!response.data) {
        console.warn('No data received from API');
        return [];
      }

      // Asegurarse de que las fechas sean objetos Date y los IDs estén correctos
      const records = response.data.map((record: any) => ({
        ...record,
        _id: record._id || record.id, // Manejar ambos casos
        date: new Date(record.date)
      }));

      console.log('Processed records:', records);
      return records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  createRecord: async (record: Omit<FuelRecord, '_id'>): Promise<FuelRecord> => {
    try {
      console.log('Creating new record:', record);
      const response = await api.post('/fuel', {
        ...record,
        date: record.date || new Date().toISOString(),
      });
      const createdRecord = {
        ...response.data,
        _id: response.data._id || response.data.id,
        date: new Date(response.data.date)
      };
      console.log('Created record:', createdRecord);
      return createdRecord;
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  },

  updateRecord: async (id: string, record: Partial<FuelRecord>): Promise<FuelRecord> => {
    try {
      const response = await api.put(`/fuel/${id}`, record);
      const updatedRecord = {
        ...response.data,
        _id: response.data._id || response.data.id,
        date: new Date(response.data.date)
      };
      console.log('Updated record:', updatedRecord);
      return updatedRecord;
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  },

  deleteRecord: async (id: string): Promise<void> => {
    try {
      await api.delete(`/fuel/${id}`);
      console.log('Record deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  },
}; 