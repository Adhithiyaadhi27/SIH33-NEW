export interface MockFPO {
  id: string;
  name: string;
  location: string;
  members: number;
  aggregatedKg: number;
  inventory: string[];
  status: 'VERIFIED' | 'PENDING' | 'BLACKLISTED';
}

export const mockFPOs: MockFPO[] = [
  { id: 'fpo1', name: 'Madurai GreenValley FPO', location: 'Madurai', members: 340, aggregatedKg: 5000, inventory: ['Tomato', 'Chili'], status: 'VERIFIED' },
  { id: 'fpo2', name: 'Nilgiris High-Altitude FPO', location: 'Ooty', members: 220, aggregatedKg: 3200, inventory: ['Potato', 'Carrot', 'Green Beans'], status: 'VERIFIED' },
  { id: 'fpo3', name: 'Sahyadri Agro Co-op', location: 'Nashik', members: 410, aggregatedKg: 6800, inventory: ['Onion', 'Mango'], status: 'VERIFIED' },
  { id: 'fpo4', name: 'Kongu Spices Co-op', location: 'Erode', members: 150, aggregatedKg: 900, inventory: ['Turmeric', 'Chili'], status: 'PENDING' },
];
