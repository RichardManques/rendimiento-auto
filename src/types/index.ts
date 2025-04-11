export interface FuelRecord {
  _id?: string;
  date: Date;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  gasStation: string;
  location?: string;
  __v?: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
} 