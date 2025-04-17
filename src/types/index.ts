export interface FuelRecord {
  _id: string;
  date: Date;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  gasStation: string;
  location: string;
  userId: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface ConsumptionData {
  city: number;
  highway: number;
  mixed: number;
}

export interface Vehicle {
  _id: string;
  userId: string;
  model: string;
  brand: string;
  year: number;
  plate: string;
  isDefault: boolean;
  transmission: string;
  fuelType: string;
  engineSize: number;
  consumption: {
    city: number;
    highway: number;
    mixed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EfficiencyRecord {
  _id: string;
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
    start: string;
    end: string;
  };
}

declare module 'react-router-dom' {
  export function useNavigate(): (path: string) => void;
} 