export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface VehicleData {
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  transmission: string;
  engineSize: number;
}

export interface EfficiencyRecord {
  startKm: number;
  endKm: number;
  liters: number;
  cost: number;
  date: Date;
}

export interface Api {
  auth: {
    login: (email: string, password: string) => Promise<LoginResponse>;
    register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
    verifyToken: (token: string) => Promise<{ user: User }>;
  };
  vehicles: {
    create: (vehicleData: VehicleData) => Promise<VehicleData>;
  };
  efficiency: {
    createRecord: (recordData: EfficiencyRecord) => Promise<EfficiencyRecord>;
  };
} 