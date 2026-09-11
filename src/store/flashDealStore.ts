import { create } from 'zustand';

export interface FlashDeal {
  productId: string;
  originalPrice: number;
  price: number;
  discountPct: number;
  reason: string;
  depot: string;
  expiresIn: string;
}

interface FlashDealState {
  deals: Record<string, FlashDeal>;
  setDeal: (deal: FlashDeal) => void;
  clearDeal: (productId: string) => void;
}

function initialDeals(): Record<string, FlashDeal> {
  try {
    const raw = localStorage.getItem('mv_flash_deals');
    const parsed = raw ? (JSON.parse(raw) as Record<string, FlashDeal>) : null;
    if (parsed && Object.keys(parsed).length > 0) return parsed;
  } catch {
    /* noop */
  }
  // Offline/demo seed: Salem tomato near shelf-life → flash redirect deal
  return {
    prod_tomato: {
      productId: 'prod_tomato',
      originalPrice: 30,
      price: 22.5,
      discountPct: 25,
      reason: 'Salem Secondary Depot: 2,000 kg Tomato near shelf-life — flash redirect deal',
      depot: 'Salem Secondary Depot',
      expiresIn: '48h',
    },
  };
}

export const useFlashDealStore = create<FlashDealState>((set) => ({
  deals: initialDeals(),

  setDeal: (deal) =>
    set((state) => {
      const deals = { ...state.deals, [deal.productId]: deal };
      try {
        localStorage.setItem('mv_flash_deals', JSON.stringify(deals));
      } catch {
        /* noop */
      }
      return { deals };
    }),

  clearDeal: (productId) =>
    set((state) => {
      const deals = { ...state.deals };
      delete deals[productId];
      try {
        localStorage.setItem('mv_flash_deals', JSON.stringify(deals));
      } catch {
        /* noop */
      }
      return { deals };
    }),
}));

export function applyFlashUpdate(payload: {
  productId: string;
  flash: boolean;
  originalPrice?: number;
  price?: number;
  discountPct?: number;
  reason?: string;
  depot?: string;
  expiresIn?: string;
}) {
  const store = useFlashDealStore.getState();
  if (payload.flash && payload.price !== undefined && payload.originalPrice !== undefined) {
    store.setDeal({
      productId: payload.productId,
      originalPrice: payload.originalPrice,
      price: payload.price,
      discountPct: payload.discountPct ?? 0,
      reason: payload.reason ?? '',
      depot: payload.depot ?? '',
      expiresIn: payload.expiresIn ?? '',
    });
  } else {
    store.clearDeal(payload.productId);
  }
}