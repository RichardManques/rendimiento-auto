import api from './api';
import { Vehicle } from '../types';

export const vehicleService = {
  getVehicles: async () => {
    console.log('🚗 Obteniendo vehículos del usuario...');
    try {
      const response = await api.get<{ success: boolean; data: Vehicle[] }>('/vehicles');
      console.log('✅ Vehículos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener vehículos:', error);
      throw error;
    }
  },

  getVehicle: async (id: string) => {
    console.log('🚗 Obteniendo vehículo:', id);
    try {
      const response = await api.get<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`);
      console.log('✅ Vehículo obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener vehículo:', error);
      throw error;
    }
  },

  createVehicle: async (vehicle: Omit<Vehicle, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    console.log('🚗 Creando nuevo vehículo:', vehicle);
    try {
      const response = await api.post<{ success: boolean; data: Vehicle }>('/vehicles', vehicle);
      console.log('✅ Vehículo creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear vehículo:', error);
      throw error;
    }
  },

  updateVehicle: async (id: string, vehicle: Partial<Omit<Vehicle, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    console.log('🚗 Actualizando vehículo:', id, vehicle);
    try {
      const response = await api.put<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`, vehicle);
      console.log('✅ Vehículo actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar vehículo:', error);
      throw error;
    }
  },

  deleteVehicle: async (id: string) => {
    console.log('🚗 Eliminando vehículo:', id);
    try {
      const response = await api.delete<{ success: boolean; data: {} }>(`/vehicles/${id}`);
      console.log('✅ Vehículo eliminado');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar vehículo:', error);
      throw error;
    }
  }
}; 