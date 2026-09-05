import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  grade: string;
}

interface MarketplaceState {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalValue: () => number;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  updateQuantity: (id, qty) =>
    set((state) => ({
      cart: qty <= 0 ? state.cart.filter((i) => i.id !== id) : state.cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ cart: [] }),
  totalItems: () => get().cart.reduce((acc, i) => acc + i.quantity, 0),
  totalValue: () => get().cart.reduce((acc, i) => acc + i.quantity * i.price, 0),
}));
