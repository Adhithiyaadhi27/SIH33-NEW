import { GlassCard, MetricTile, GlassBadge } from '../ui/primitives';
import { mockOrders } from '../../data/mockOrders';

interface RoleCockpitProps {
  role: string;
  tagline: string;
}

const roleContent: Record<string, { metrics: Array<{ label: string; value: string; accent?: string }>; title: string; body: string[] }> = {
  FPO: {
    metrics: [
      { label: 'Member Farmers', value: '340' },
      { label: 'Aggregated', value: '5,000 kg', accent: 'text-soil-gold' },
      { label: 'Active Demand', value: '₹1.2L', accent: 'text-soil-mint' },
      { label: 'Bulk Orders', value: '4' },
    ],
    title: 'FPO Co-op Cockpit',
    body: ['Farmer aggregation', 'Batch pooling', 'Inventory & demand'],
  },
  Consumer: {
    metrics: [
      { label: 'Cart Items', value: '3' },
      { label: 'Cart Value', value: '₹160', accent: 'text-soil-gold' },
      { label: 'Orders', value: '1 active' },
      { label: 'Delivery ETA', value: '45 min', accent: 'text-soil-mint' },
    ],
    title: 'Consumer Cockpit',
    body: ['Marketplace discovery', 'Cart & checkout', 'Delivery tracking'],
  },
  'Bulk Buyer': {
    metrics: [
      { label: 'Open RFPs', value: '3' },
      { label: 'Bids Received', value: '12', accent: 'text-soil-gold' },
      { label: 'Committed Kg', value: '12,000', accent: 'text-soil-mint' },
      { label: 'Avg Price', value: '₹26.50' },
    ],
    title: 'Bulk Buyer Cockpit',
    body: ['Reverse bidding marketplace', 'Supplier comparison', 'Contract orders'],
  },
  Logistics: {
    metrics: [
      { label: 'Active Deliveries', value: '6' },
      { label: 'Fleet Available', value: '12 of 18', accent: 'text-soil-gold' },
      { label: 'Avg Route', value: '240 km' },
      { label: 'On-time', value: '96%', accent: 'text-soil-mint' },
    ],
    title: 'Logistics Cockpit',
    body: ['Route optimization', 'Vehicle telemetry', 'Aggregation points'],
  },
  Admin: {
    metrics: [
      { label: 'Users', value: '1,240' },
      { label: 'FPO Pending', value: '3', accent: 'text-soil-gold' },
      { label: 'Orders Today', value: '188' },
      { label: 'System Health', value: '99.2%', accent: 'text-soil-mint' },
    ],
    title: 'Admin Cockpit',
    body: ['User & FPO verification', 'Marketplace monitoring', 'Analytics & settings'],
  },
};

export default function RoleCockpit({ role, tagline }: RoleCockpitProps) {
  const content = roleContent[role];

  return (
    <div className="space-y-5">
      <div>
        <GlassBadge gold>Role Cockpit · {role}</GlassBadge>
        <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">{content.title}</h1>
        <p className="text-xs text-text-muted">{tagline}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {content.metrics.map((m) => (
          <MetricTile key={m.label} label={m.label} value={m.value} accent={m.accent} />
        ))}
      </div>

      <GlassCard className="p-5 space-y-3">
        <h2 className="font-display font-bold text-base text-text-primary">Module Shortcuts</h2>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {content.body.map((b) => (
            <div key={b} className="glass-panel-sm p-3 text-sm font-semibold text-text-primary hover:border-soil-gold/40 transition cursor-pointer">
              {b}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent orders */}
      <GlassCard className="p-5 space-y-3">
        <h2 className="font-display font-bold text-base text-text-primary">Recent Live Orders</h2>
        <div className="space-y-2">
          {mockOrders.map((o) => (
            <div key={o.id} className="glass-panel-sm px-3.5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-text-primary">{o.product}</span>
                <span className="text-text-muted ml-2">{o.from} → {o.to}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-soil-gold font-bold">{o.quantityKg.toLocaleString()} kg</span>
                <span className={`font-bold ${o.status === 'DELIVERED' ? 'text-emerald-400' : 'text-soil-goldSoft'}`}>{o.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}