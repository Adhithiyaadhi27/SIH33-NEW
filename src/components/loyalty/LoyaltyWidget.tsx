import { useLoyaltyStore } from '../../store/loyaltyStore';
import { Star, Gift, TrendingUp, Award } from 'lucide-react';

interface LoyaltyWidgetProps {
  showHistory?: boolean;
}

const TIER_COLORS = {
  Bronze: 'text-amber-600',
  Silver: 'text-gray-300',
  Gold: 'text-soil-gold',
  Platinum: 'text-purple-400',
};

const TIER_NEXT = {
  Bronze: { next: 'Silver', needed: 500 },
  Silver: { next: 'Gold', needed: 2000 },
  Gold: { next: 'Platinum', needed: 5000 },
  Platinum: { next: null, needed: 0 },
};

export default function LoyaltyWidget({ showHistory }: LoyaltyWidgetProps) {
  const { points, tier, history, addPoints, getTierDiscount } = useLoyaltyStore();
  const discount = getTierDiscount();
  const tierInfo = TIER_NEXT[tier];

  return (
    <div className="space-y-3">
      {/* Tier & Points Card */}
      <div className="glass-panel-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${TIER_COLORS[tier]}`} />
            <div>
              <div className="text-xs font-bold text-text-primary">{tier} Member</div>
              <div className="text-[9px] text-text-muted">{discount > 0 ? `${discount}% tier discount on all orders` : 'Earn points to unlock discounts'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-lg text-soil-gold">{points}</div>
            <div className="text-[9px] text-text-muted">points</div>
          </div>
        </div>

        {/* Progress bar */}
        {tierInfo.next && (
          <div>
            <div className="flex justify-between text-[9px] text-text-muted mb-1">
              <span>{tier}</span>
              <span>{tierInfo.next} ({tierInfo.needed - points} pts to go)</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-soil-gold to-soil-goldSoft transition-all duration-500"
                style={{ width: `${Math.min(100, (points / tierInfo.needed) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => addPoints('Daily Check-in', 5)}
          className="glass-panel-sm p-3 flex items-center gap-2 hover:bg-white/8 transition cursor-pointer"
        >
          <Star className="w-4 h-4 text-soil-gold" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-text-primary">Daily +5</div>
            <div className="text-[8px] text-text-muted">Check-in</div>
          </div>
        </button>
        <button
          onClick={() => addPoints('Share Product', 10)}
          className="glass-panel-sm p-3 flex items-center gap-2 hover:bg-white/8 transition cursor-pointer"
        >
          <Gift className="w-4 h-4 text-soil-gold" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-text-primary">Share +10</div>
            <div className="text-[8px] text-text-muted">Earn points</div>
          </div>
        </button>
      </div>

      {/* History */}
      {showHistory && (
        <div className="glass-panel-sm p-3 space-y-2">
          <div className="text-[10px] font-bold text-soil-gold uppercase tracking-wide">Recent Activity</div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-text-primary">{h.action}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-bold ${h.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.points > 0 ? '+' : ''}{h.points}
                  </span>
                  <span className="text-text-muted">{h.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
