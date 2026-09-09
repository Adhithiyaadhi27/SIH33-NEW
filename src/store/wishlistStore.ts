import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  grade: string;
  category: string;
  supplier: string;
  location: string;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          }
          return { items: [...state.items, { ...item, addedAt: Date.now() }] };
        }),
      removeWishlist: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'mv_wishlist' },
  ),
);
