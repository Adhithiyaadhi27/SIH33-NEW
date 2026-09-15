import { create } from 'zustand';
import { mockProducts } from '../data/mockProducts';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
}

type Status = InventoryItem['status'];

function deriveStatus(quantity: number): Status {
  return quantity <= 0 ? 'out_of_stock' : quantity < 50 ? 'low_stock' : 'in_stock';
}

function productToInventoryItem(product: (typeof mockProducts)[number]): InventoryItem {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    quantity: product.availableQty,
    unit: product.unit,
    pricePerUnit: product.price,
    grade: product.grade,
    status: deriveStatus(product.availableQty),
    image: product.image,
  };
}

const MOCK_INVENTORY: InventoryItem[] = mockProducts.map(productToInventoryItem);

interface InventoryState {
  items: InventoryItem[];
  updateQuantity: (id: string, qty: number) => void;
  reduceStock: (id: string, qty: number) => void;
  addItem: (item: Omit<InventoryItem, 'status'>) => void;
  removeItem: (id: string) => void;
  getStats: () => { totalItems: number; totalValue: number; lowStockCount: number; outOfStockCount: number };
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: MOCK_INVENTORY,
  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items
        .filter((item) => item.id !== id || qty > 0)
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: qty,
                status: deriveStatus(qty),
              }
            : item,
        ),
    })),
  reduceStock: (id, qty) => {
    const existing = get().items.find((i) => i.id === id);
    if (!existing) return;
    const remaining = Math.max(0, existing.quantity - qty);
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: remaining,
              status: deriveStatus(remaining),
            }
          : item,
      ),
    }));
  },
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: item.id,
          status: deriveStatus(item.quantity),
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