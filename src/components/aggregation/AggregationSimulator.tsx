import { GlassCard, MetricTile } from '../ui/primitives';
import { Flame, Package, Truck, Home } from 'lucide-react';
import AggregationMap from './AggregationMap';

export default function AggregationSimulator() {
  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display font-extrabold text-lg text-text-primary">
            SIH 5,000 kg Smart Aggregation Simulator
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Dynamic map visualizes tomato aggregation flow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-panel-sm px-3 py-1.5 text-xs">
            <span className="text-text-muted">Stage:</span>{' '}
            <span className="font-bold text-soil-gold">5,000 kg fulfillment</span>
          </div>
          <div className="glass-panel-sm px-3 py-1.5 text-xs">
            <span className="text-text-muted">Ripeness:</span>{' '}
            <span className="font-bold text-soil-mint">85%</span>
          </div>
        </div>
      </div>

      <AggregationMap />

      {/* Progress visualization */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-text-muted">Fulfillment Progress</span>
          <span className="text-soil-gold">100% · 5,000 / 5,000 kg</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <ProgressBars />
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <MetricTile label="Harvest" value="5,000 kg" icon={<Home className="w-4 h-4" />} accent="text-soil-mint" />
        <MetricTile label="Aggregation" value="5,000 kg" icon={<Package className="w-4 h-4" />} accent="text-soil-gold" />
        <MetricTile label="Transit" value="1,793" icon={<Truck className="w-4 h-4" />} accent="text-soil-goldSoft" />
        <MetricTile label="Delivery" value="1,753" icon={<Flame className="w-4 h-4" />} accent="text-soil-pale" />
      </div>
    </GlassCard>
  );
}

function ProgressBars() {
  const w = 100;
  return (
    <div className="flex h-full gap-0.5 p-0.5">
      <div style={{ width: `${w * 0.2}%` }} className="bg-soil-mint h-full rounded-full" />
      <div style={{ width: `${w * 0.3}%` }} className="bg-soil-emerald h-full rounded-full" />
      <div style={{ width: `${w * 0.5}%` }} className="bg-soil-gold h-full rounded-full" />
    </div>
  );
}
