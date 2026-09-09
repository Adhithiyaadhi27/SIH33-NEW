import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  items: Array<{ name: string; qty: string; image: string }>;
  price: number;
  description: string;
  popular?: boolean;
}

export interface ActiveSubscription {
  planId: string;
  startDate: string;
  nextDelivery: string;
  deliveriesCompleted: number;
  status: 'active' | 'paused' | 'cancelled';
}

const PLAN_CATALOG: SubscriptionPlan[] = [
  {
    id: 'plan_weekly_fresh',
    name: 'Weekly Fresh Box',
    frequency: 'weekly',
    description: 'Seasonal vegetables handpicked from local FPOs every week',
    price: 599,
    popular: true,
    items: [
      { name: 'Tomato', qty: '2 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=60' },
      { name: 'Onion', qty: '1 kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=100&q=60' },
      { name: 'Green Beans', qty: '1 kg', image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=100&q=60' },
      { name: 'Carrot', qty: '500g', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=100&q=60' },
    ],
  },
  {
    id: 'plan_biweekly_family',
    name: 'Family Essentials',
    frequency: 'biweekly',
    description: 'Curated selection for families — veggies + fruits every 2 weeks',
    price: 1199,
    items: [
      { name: 'Potato', qty: '2 kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=100&q=60' },
      { name: 'Brinjal', qty: '1 kg', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=100&q=60' },
      { name: 'Apple', qty: '1 kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=100&q=60' },
      { name: 'Mango', qty: '1 kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=60' },
    ],
  },
  {
    id: 'plan_monthly_premium',
    name: 'Premium Harvest',
    frequency: 'monthly',
    description: 'Premium organic produce box with exotic items — monthly delivery',
    price: 2499,
    items: [
      { name: 'Alphonso Mango', qty: '2 kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=60' },
      { name: 'Kinnaur Apple', qty: '2 kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=100&q=60' },
      { name: 'Organic Carrot', qty: '1 kg', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=100&q=60' },
      { name: 'Green Beans', qty: '1 kg', image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=100&q=60' },
    ],
  },
];

interface SubscriptionState {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
  subscribe: (planId: string) => void;
  pauseSubscription: () => void;
  resumeSubscription: () => void;
  cancelSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: PLAN_CATALOG,
      activeSubscription: null,
      subscribe: (planId) =>
        set({
          activeSubscription: {
            planId,
            startDate: new Date().toLocaleDateString('en-IN'),
            nextDelivery: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN'),
            deliveriesCompleted: 0,
            status: 'active',
          },
        }),
      pauseSubscription: () =>
        set((state) => ({
          activeSubscription: state.activeSubscription ? { ...state.activeSubscription, status: 'paused' } : null,
        })),
      resumeSubscription: () =>
        set((state) => ({
          activeSubscription: state.activeSubscription ? { ...state.activeSubscription, status: 'active' } : null,
        })),
      cancelSubscription: () => set({ activeSubscription: null }),
    }),
    { name: 'mv_subscriptions' },
  ),
);
