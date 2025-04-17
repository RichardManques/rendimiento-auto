import api from './api';

export interface EfficiencyRecord {
  _id?: string;
  userId: string;
  vehicleId: string;
  startKm: number;
  endKm: number;
  kmConsumed: number;
  drivingStyle: 'suave' | 'normal' | 'agresivo';
  routeType: 'ciudad' | 'carretera' | 'mixta';
  useAC: boolean;
  efficiency: {
    base: number;
    adjusted: number;
  };
  cost: {
    perKm: number;
    total: number;
  };
  date: Date;
  location: {
    start?: string;
    end?: string;
  };
}

export const efficiencyService = {
  createRecord: async (record: Omit<EfficiencyRecord, '_id' | 'userId'>) => {
    console.log('📊 Iniciando creación de registro de eficiencia:', record);
    try {
      const response = await api.post<{ success: boolean; data: EfficiencyRecord }>('/efficiency', record);
      console.log('✅ Registro de eficiencia creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear registro de eficiencia:', error);
      throw error;
    }
  },

  getRecords: async () => {
    console.log('📊 Obteniendo registros de eficiencia');
    try {
      const response = await api.get<{ success: boolean; data: EfficiencyRecord[] }>('/efficiency');
      console.log('✅ Registros de eficiencia obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener registros de eficiencia:', error);
      throw error;
    }
  },

  getRecordsByVehicle: async (vehicleId: string) => {
    console.log('📊 Obteniendo registros de eficiencia para vehículo:', vehicleId);
    try {
      const response = await api.get<{ success: boolean; data: EfficiencyRecord[] }>(`/efficiency/vehicle/${vehicleId}`);
      console.log('✅ Registros de eficiencia por vehículo obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener registros de eficiencia por vehículo:', error);
      throw error;
    }
  },

  getRecord: async (id: string) => {
    console.log('📊 Obteniendo registro de eficiencia:', id);
    try {
      const response = await api.get<{ success: boolean; data: EfficiencyRecord }>(`/efficiency/${id}`);
      console.log('✅ Registro de eficiencia obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener registro de eficiencia:', error);
      throw error;
    }
  },

  updateRecord: async (id: string, record: Partial<Omit<EfficiencyRecord, '_id' | 'userId'>>) => {
    console.log('📊 Actualizando registro de eficiencia:', id, record);
    try {
      const response = await api.put<{ success: boolean; data: EfficiencyRecord }>(`/efficiency/${id}`, record);
      console.log('✅ Registro de eficiencia actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar registro de eficiencia:', error);
      throw error;
    }
  },

  deleteRecord: async (id: string) => {
    console.log('📊 Eliminando registro de eficiencia:', id);
    try {
      const response = await api.delete<{ success: boolean; data: {} }>(`/efficiency/${id}`);
      console.log('✅ Registro de eficiencia eliminado');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar registro de eficiencia:', error);
      throw error;
    }
  },

  getStats: async (vehicleId: string) => {
    console.log('📊 Obteniendo estadísticas de eficiencia para vehículo:', vehicleId);
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/efficiency/stats/${vehicleId}`);
      console.log('✅ Estadísticas de eficiencia obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de eficiencia:', error);
      throw error;
    }
  }
}; 