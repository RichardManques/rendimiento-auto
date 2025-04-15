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
    verifyToken: (token: string) => Promise<{ valid: boolean }>;
  };
  efficiency: {
    createRecord: (recordData: EfficiencyRecord) => Promise<EfficiencyRecord>;
  };
} 