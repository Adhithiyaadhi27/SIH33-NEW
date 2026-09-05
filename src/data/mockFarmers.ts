export interface MockFarmer {
  id: string;
  name: string;
  plot: string;
  location: string;
  crop: string;
  yieldKg: number;
  pricePerKg: number;
  grade: string;
  fifoCoefficient: number;
}

export const mockFarmers: MockFarmer[] = [
  { id: 'fm1', name: 'M. Murugesan', plot: 'Plot 4B, Alanganallur', location: 'Madurai', crop: 'Tomato', yieldKg: 1000, pricePerKg: 24.5, grade: 'Grade A', fifoCoefficient: 0.92 },
  { id: 'fm2', name: 'S. Chelladurai', plot: 'Plot 12C, Vadipatti', location: 'Madurai', crop: 'Tomato', yieldKg: 1500, pricePerKg: 25.0, grade: 'Grade A', fifoCoefficient: 0.9 },
  { id: 'fm3', name: 'P. Kalyani', plot: 'Plot 3A, Usilampatti', location: 'Madurai', crop: 'Tomato', yieldKg: 2500, pricePerKg: 24.0, grade: 'Grade A', fifoCoefficient: 0.95 },
];
