import { GlassCard, MetricTile, GlassBadge } from '../ui/primitives';
import { mockFarmers } from '../../data/mockFarmers';
import { useRealtime } from '../../services/realtime';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanSearch, IdCard } from 'lucide-react';

export default function FarmerDashboard() {
  const [earnings, setEarnings] = useState(84250);
  const navigate = useNavigate();

  useRealtime('metric:update', () => {
    // subtle live earnings tick
    setEarnings((e) => e + Math.floor(Math.random() * 20));
  });

  const openModule = (id: string) => {
    navigate('/');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 250);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <GlassBadge gold><span className="flex h-1.5 w-1.5 rounded-full bg-soil-gold animate-pulse" /> Registration status: VERIFIED</GlassBadge>
          <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">Farmer Cockpit</h1>
          <p className="text-xs text-text-muted">Produce inventory, prices, AI grading, passport &amp; earnings</p>
        </div>
      </div>

      {/* Smart module shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard small className="p-4 hover:border-soil-gold/40">
          <button
            onClick={() => openModule('ai-grading')}
            className="w-full flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white">
              <ScanSearch className="w-4 h-4 text-soil-gold" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary">AI Quality Grading</div>
              <div className="text-[10px] text-text-muted">Run a live CV scan on your lot</div>
            </div>
          </button>
        </GlassCard>
        <GlassCard small className="p-4 hover:border-soil-gold/40">
          <button
            onClick={() => openModule('passport')}
            className="w-full flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-soil-gold to-soil-goldSoft flex items-center justify-center text-soil-base">
              <IdCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary">Digital Produce Passport</div>
              <div className="text-[10px] text-text-muted">Verifiable batch identity</div>
            </div>
          </button>
        </GlassCard>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile label="Total Yield" value="5,000 kg" />
        <MetricTile label="Avg Price" value="₹24.50/kg" accent="text-soil-gold" />
        <MetricTile label="Live Earnings" value={`₹${earnings.toLocaleString()}`} accent="text-soil-mint" />
        <MetricTile label="Grade" value="Grade A" />
      </div>

      {/* Inventory */}
      <GlassCard className="p-5 space-y-3">
        <h2 className="font-display font-bold text-base text-text-primary">Harvest Batches &amp; Produce Inventory</h2>
        <div className="space-y-2.5">
          {mockFarmers.map((f) => (
            <div key={f.id} className="glass-panel-sm p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm text-text-primary">{f.name} · <span className="text-soil-gold">{f.plot}</span></div>
                <div className="text-[11px] text-text-muted">{f.crop} · {f.location}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-soil-gold">{f.yieldKg.toLocaleString()} kg</div>
                <div className="text-[10px] text-text-muted">@{f.pricePerKg} ₹/kg</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Orders & crop prices */}
      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-text-primary">Current Crop Prices</h2>
          <div className="space-y-2">
            {[
              { crop: 'Tomato', price: '₹30/kg', change: '+2.1%' },
              { crop: 'Green Beans', price: '₹23.50/kg', change: '-0.8%' },
              { crop: 'Potato', price: '₹28/kg', change: '+1.2%' },
            ].map((c) => (
              <div key={c.crop} className="flex items-center justify-between glass-panel-sm px-3 py-2.5 text-xs">
                <span className="font-semibold text-text-primary">{c.crop}</span>
                <span className="flex items-center gap-2">
                  <span className="text-soil-gold font-bold">{c.price}</span>
                  <span className={c.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>{c.change}</span>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-text-primary">Pending Orders</h2>
          <div className="space-y-2">
            {[
              { id: 'ORD-8811', product: 'Tomato', qty: '500 kg', eta: 'Today' },
              { id: 'ORD-8812', product: 'Green Beans', qty: '180 kg', eta: 'Tomorrow' },
            ].map((o) => (
              <div key={o.id} className="flex items-center justify-between glass-panel-sm px-3 py-2.5 text-xs">
                <div>
                  <div className="font-bold text-text-primary">{o.product}</div>
                  <div className="text-[10px] text-text-muted">{o.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-soil-gold">{o.qty}</div>
                  <div className="text-[10px] text-text-muted">{o.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}