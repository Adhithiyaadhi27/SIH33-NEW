import { useState } from 'react';
import { GlassCard, MetricTile } from '../ui/primitives';
import { Flame, Package, Truck, Home } from 'lucide-react';
import useTranslation from '../../services/useTranslation';
import { useRealtime } from '../../services/realtime';
import AggregationMap from './AggregationMap';

export default function AggregationSimulator() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ harvest: 5000, transit: 1793, delivery: 1753 });

  // Live metric ticks from the realtime feed (harvest / transit / delivery)
  useRealtime('metric:update', ({ key, value }) => {
    if (key === 'harvest' || key === 'transit' || key === 'delivery') {
      setMetrics((m) => ({ ...m, [key]: value }));
    }
  });

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display font-extrabold text-lg text-text-primary">
            {t('aggregation.title')}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {t('aggregation.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-panel-sm px-3 py-1.5 text-xs">
            <span className="text-text-muted">{t('aggregation.stage')}:</span>{' '}
            <span className="font-bold text-soil-gold">{t('aggregation.fulfillment')}</span>
          </div>
          <div className="glass-panel-sm px-3 py-1.5 text-xs">
            <span className="text-text-muted">{t('aggregation.ripeness')}:</span>{' '}
            <span className="font-bold text-soil-mint">85%</span>
          </div>
        </div>
      </div>

      <AggregationMap />

      {/* Progress visualization */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-text-muted">{t('aggregation.stage')}</span>
          <span className="text-soil-gold">100% · {metrics.harvest.toLocaleString()} / {metrics.harvest.toLocaleString()} kg</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <ProgressBars />
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <MetricTile label={t('aggregation.harvest')} value={`${metrics.harvest.toLocaleString()} kg`} icon={<Home className="w-4 h-4" />} accent="text-soil-mint" />
        <MetricTile label={t('aggregation.aggregation')} value={`${metrics.harvest.toLocaleString()} kg`} icon={<Package className="w-4 h-4" />} accent="text-soil-gold" />
        <MetricTile label={t('aggregation.transit')} value={metrics.transit.toLocaleString()} icon={<Truck className="w-4 h-4" />} accent="text-soil-goldSoft" />
        <MetricTile label={t('aggregation.delivery')} value={metrics.delivery.toLocaleString()} icon={<Flame className="w-4 h-4" />} accent="text-soil-pale" />
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
