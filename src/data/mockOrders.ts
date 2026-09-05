export interface MockOrder {
  id: string;
  product: string;
  quantityKg: number;
  from: string;
  to: string;
  status: 'PENDING' | 'AGGREGATING' | 'IN_TRANSIT' | 'DELIVERED';
  eta: string;
}

export const mockOrders: MockOrder[] = [
  { id: 'ORD-2026-8811', product: 'Tomato', quantityKg: 500, from: 'Madurai FPO', to: 'Chennai Cold Hub', status: 'IN_TRANSIT', eta: 'Today 4:30 PM' },
  { id: 'ORD-2026-8812', product: 'Potato', quantityKg: 1200, from: 'Nilgiris FPO', to: 'Koyambedu Wholesale', status: 'AGGREGATING', eta: 'Tomorrow 9:00 AM' },
  { id: 'ORD-2026-8813', product: 'Onion', quantityKg: 2500, from: 'Sahyadri Co-op', to: 'Chennai Warehouse', status: 'PENDING', eta: 'Day after' },
  { id: 'ORD-2026-8814', product: 'Mango', quantityKg: 450, from: 'Ratnagiri FPO', to: 'Bulk Buyer - Evergreen', status: 'DELIVERED', eta: 'Delivered' },
];
