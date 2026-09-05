export type HeatLevel = 'high' | 'medium' | 'low' | 'normal';

export interface DistrictData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  supply: number;
  demand: number;
  crop: string;
  level: HeatLevel;
}

export interface HeatLevelMeta {
  key: HeatLevel;
  label: string;
  color: string;
}

export const heatLevels: HeatLevelMeta[] = [
  { key: 'high', label: 'High', color: '#F6BD60' },
  { key: 'medium', label: 'Medium', color: '#FAD48A' },
  { key: 'low', label: 'Low', color: '#7CCFA2' },
  { key: 'normal', label: 'Normal', color: '#2E8B57' },
];

export const mockSupplyDemand: DistrictData[] = [
  { id: 'chn', name: 'Chennai', lat: 13.0827, lng: 80.2707, supply: 3200, demand: 5000, crop: 'Tomato', level: 'high' },
  { id: 'mdu', name: 'Madurai', lat: 9.9252, lng: 78.1198, supply: 5000, demand: 2200, crop: 'Tomato', level: 'normal' },
  { id: 'cbe', name: 'Coimbatore', lat: 11.0168, lng: 76.9558, supply: 2800, demand: 4100, crop: 'Potato', level: 'medium' },
  { id: 'trichy', name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, supply: 2000, demand: 3300, crop: 'Onion', level: 'medium' },
  { id: 'salem', name: 'Salem', lat: 11.6643, lng: 78.1460, supply: 1500, demand: 2100, crop: 'Green Beans', level: 'low' },
  { id: 'erode', name: 'Erode', lat: 11.3410, lng: 77.7172, supply: 900, demand: 1200, crop: 'Turmeric', level: 'normal' },
  { id: 'theni', name: 'Theni', lat: 10.0104, lng: 77.4768, supply: 4200, demand: 2500, crop: 'Chili', level: 'normal' },
  { id: 'ooty', name: 'Ooty (Nilgiris)', lat: 11.4102, lng: 76.6950, supply: 3200, demand: 1500, crop: 'Potato', level: 'low' },
  { id: 'vellore', name: 'Vellore', lat: 12.9165, lng: 79.1325, supply: 1800, demand: 2700, crop: 'Tomato', level: 'medium' },
  { id: 'tuticorin', name: 'Thoothukudi', lat: 8.7642, lng: 78.1348, supply: 1300, demand: 1900, crop: 'Onion', level: 'low' },
];
