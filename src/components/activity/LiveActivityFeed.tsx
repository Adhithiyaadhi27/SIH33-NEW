import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/primitives';
import { useRealtime, useRealtimeStatus } from '../../services/realtime';
import useTranslation from '../../services/useTranslation';
import { mockOrders } from '../../data/mockOrders';
import { Truck, ShieldCheck, TrendingUp, Package } from 'lucide-react';

interface Activity {
  id: number;
  icon: 'truck' | 'verify' | 'price' | 'order';
  text: string;
  time: string;
}

let idCounter = 100;

export default function LiveActivityFeed() {
  const { t } = useTranslation();
  const feedStatus = useRealtimeStatus();
  const [items, setItems] = useState<Activity[]>([]);

  const prepend = (a: Omit<Activity, 'id' | 'time'>) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => [{ id: ++idCounter, time, ...a }, ...prev].slice(0, 18));
  };

  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const initialEvents: Activity[] = [
      { id: 1, icon: 'price', text: 'Tomato market rate updated to ₹30.0/kg', time: '03:25 pm' },
      { id: 2, icon: 'verify', text: 'Inventory refreshed · tomato (500 kg)', time: '03:24 pm' },
      { id: 3, icon: 'truck', text: 'Logistics fleet ETA update · 1,793 kg in transit', time: '03:22 pm' },
      { id: 4, icon: 'order', text: '500 kg Tomato · Madurai → Chennai', time: '03:20 pm' },
      { id: 5, icon: 'price', text: 'Green Beans market rate updated to ₹23.5/kg', time: '03:18 pm' },
      { id: 6, icon: 'verify', text: 'Inventory refreshed · green beans (300 kg)', time: '03:15 pm' },
      { id: 7, icon: 'order', text: '300 kg Green Beans · Nilgiris → Coimbatore', time: '03:12 pm' },
      { id: 8, icon: 'verify', text: 'AI Quality Certified · Lot #AGR-2026-1024 Grade A', time: '03:08 pm' },
      { id: 9, icon: 'price', text: 'Potato market rate updated to ₹28.0/kg', time: '03:05 pm' },
      { id: 10, icon: 'truck', text: 'Cold chain vehicle TN-01-AB-1234 departed Madurai Hub', time: '03:00 pm' },
      { id: 11, icon: 'verify', text: 'Produce Passport generated for Batch TRB2023001', time: '02:55 pm' },
      { id: 12, icon: 'order', text: '1,200 kg Potato · Ooty → Bangalore', time: '02:50 pm' },
    ];
    setItems(initialEvents);
  }, []);

  useRealtime('price:update', ({ price }) => {
    prepend({ icon: 'price', text: `Tomato market rate updated to ₹${price.toFixed(1)}/kg` });
  });

  useRealtime('metric:update', ({ key, value }) => {
    if (key === 'transit') {
      prepend({ icon: 'truck', text: `Logistics fleet ETA update · ${value.toLocaleString()} kg in transit` });
    }
  });

  useRealtime('stock:update', ({ productId, availableQty }) => {
    prepend({ icon: 'verify', text: `Inventory refreshed · ${productId.replace('prod_', '').replace(/_/g, ' ')} (${availableQty.toLocaleString()} kg)` });
  });

  const iconMap = {
    truck: <Truck className="w-3.5 h-3.5" />,
    verify: <ShieldCheck className="w-3.5 h-3.5" />,
    price: <TrendingUp className="w-3.5 h-3.5" />,
    order: <Package className="w-3.5 h-3.5" />,
  };

  const colorMap: Record<Activity['icon'], string> = {
    truck: 'text-soil-mint',
    verify: 'text-soil-goldSoft',
    price: 'text-soil-gold',
    order: 'text-text-primary',
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-3 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-lg text-text-primary">Live Activity Feed</h2>
          <p className="text-xs text-text-muted mt-0.5">Realtime market, logistics &amp; inventory events</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
          <span className={`flex h-1.5 w-1.5 rounded-full animate-pulse ${feedStatus === 'live' ? 'bg-emerald-400' : 'bg-soil-gold'}`} />
          <span className={feedStatus === 'live' ? 'text-emerald-400' : 'text-soil-gold'}>
            {feedStatus === 'live' ? t('marketplace.live_feed') : feedStatus === 'simulated' ? t('marketplace.simulated_feed') : t('marketplace.connecting')}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-none pr-1 max-h-[380px]">
        <AnimatePresence initial={false}>
          {items.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel-sm px-3.5 py-2.5 flex items-center gap-3"
            >
              <span className={`shrink-0 ${colorMap[a.icon]}`}>{iconMap[a.icon]}</span>
              <span className="flex-1 min-w-0 text-xs font-semibold text-text-primary truncate">{a.text}</span>
              <span className="shrink-0 text-[10px] text-text-muted">{a.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5 text-soil-mint font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-soil-mint animate-pulse" />
          Socket.IO Synced
        </span>
        <span className="text-soil-gold font-bold">18 Mandis Active</span>
      </div>
    </GlassCard>
  );
}