import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoyaltyState {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  history: Array<{ action: string; points: number; date: string }>;
  addPoints: (action: string, amount: number) => void;
  redeemPoints: (amount: number) => boolean;
  getTierDiscount: () => number;
}

const TIER_THRESHOLDS = { Bronze: 0, Silver: 500, Gold: 2000, Platinum: 5000 };
const TIER_DISCOUNTS = { Bronze: 0, Silver: 2, Gold: 5, Platinum: 10 };

function calculateTier(points: number): LoyaltyState['tier'] {
  if (points >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (points >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (points >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: 120,
      tier: 'Silver',
      history: [
        { action: 'Welcome Bonus', points: 50, date: '01 Sep 2026' },
        { action: 'First Purchase', points: 30, date: '03 Sep 2026' },
        { action: 'Review Posted', points: 10, date: '05 Sep 2026' },
        { action: 'Referred a Friend', points: 25, date: '07 Sep 2026' },
        { action: 'Bulk Order Bonus', points: 5, date: '08 Sep 2026' },
      ],
      addPoints: (action, amount) =>
        set((state) => {
          const newPoints = state.points + amount;
          return {
            points: newPoints,
            tier: calculateTier(newPoints),
            history: [{ action, points: amount, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }, ...state.history],
          };
        }),
      redeemPoints: (amount) => {
        const { points } = get();
        if (points < amount) return false;
        set((state) => {
          const newPoints = state.points - amount;
          return {
            points: newPoints,
            tier: calculateTier(newPoints),
            history: [{ action: 'Redeemed', points: -amount, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }, ...state.history],
          };
        });
        return true;
      },
      getTierDiscount: () => TIER_DISCOUNTS[get().tier],
    }),
    { name: 'mv_loyalty' },
  ),
);
