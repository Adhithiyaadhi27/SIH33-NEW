import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/primitives';
import { useRealtime } from '../../services/realtime';
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
  const [items, setItems] = useState<Activity[]>([]);

  const prepend = (a: Omit<Activity, 'id' | 'time'>) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => [{ id: ++idCounter, time, ...a }, ...prev].slice(0, 9));
  };

  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    setItems(
      mockOrders.map((o, i) => ({
        id: i,
        icon: 'order' as const,
        text: `${o.quantityKg.toLocaleString()} kg ${o.product} · ${o.from} → ${o.to}`,
        time: `${9 + (i % 8)}:${String((20 + i * 17) % 60).padStart(2, '0')} AM`,
      })),
    );
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
    <GlassCard className="p-5 sm:p-6 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-lg text-text-primary">Live Activity Feed</h2>
          <p className="text-xs text-text-muted mt-0.5">Realtime market, logistics &amp; inventory events</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto scrollbar-none pr-1">
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
    </GlassCard>
  );
}