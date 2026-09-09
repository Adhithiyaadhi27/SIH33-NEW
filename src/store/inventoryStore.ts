import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade: string;
  harvestDate: string;
  storageLocation: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
}

interface InventoryState {
  items: InventoryItem[];
  updateQuantity: (id: string, qty: number) => void;
  addItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  removeItem: (id: string) => void;
  getStats: () => { totalItems: number; totalValue: number; lowStockCount: number; outOfStockCount: number };
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv_1', name: 'Tomato', category: 'Vegetables', quantity: 500, unit: 'kg', pricePerUnit: 30, grade: 'Grade A', harvestDate: '09 Sep 2026', storageLocation: 'Cold Room A', status: 'in_stock', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=60' },
  { id: 'inv_2', name: 'Green Beans', category: 'Vegetables', quantity: 300, unit: 'kg', pricePerUnit: 23.5, grade: 'Grade A', harvestDate: '08 Sep 2026', storageLocation: 'Cold Room B', status: 'in_stock', image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=100&q=60' },
  { id: 'inv_3', name: 'Potato', category: 'Vegetables', quantity: 1200, unit: 'kg', pricePerUnit: 28, grade: 'Grade A', harvestDate: '07 Sep 2026', storageLocation: 'Warehouse 1', status: 'in_stock', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=100&q=60' },
  { id: 'inv_4', name: 'Onion', category: 'Vegetables', quantity: 25, unit: 'kg', pricePerUnit: 32, grade: 'Grade A', harvestDate: '05 Sep 2026', storageLocation: 'Warehouse 2', status: 'low_stock', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=100&q=60' },
  { id: 'inv_5', name: 'Brinjal', category: 'Vegetables', quantity: 0, unit: 'kg', pricePerUnit: 26, grade: 'Grade A', harvestDate: '06 Sep 2026', storageLocation: 'Cold Room A', status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=100&q=60' },
  { id: 'inv_6', name: 'Carrot', category: 'Vegetables', quantity: 600, unit: 'kg', pricePerUnit: 35, grade: 'Grade A', harvestDate: '07 Sep 2026', storageLocation: 'Cold Room B', status: 'in_stock', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=100&q=60' },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: MOCK_INVENTORY,
  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: qty,
              status: qty <= 0 ? 'out_of_stock' : qty < 50 ? 'low_stock' : 'in_stock',
            }
          : item,
      ),
    })),
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: `inv_${Date.now()}`,
          status: item.quantity <= 0 ? 'out_of_stock' : item.quantity < 50 ? 'low_stock' : 'in_stock',
        },
      ],
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  getStats: () => {
    const items = get().items;
    return {
      totalItems: items.length,
      totalValue: items.reduce((sum, i) => sum + i.quantity * i.pricePerUnit, 0),
      lowStockCount: items.filter((i) => i.status === 'low_stock').length,
      outOfStockCount: items.filter((i) => i.status === 'out_of_stock').length,
    };
  },
}));
