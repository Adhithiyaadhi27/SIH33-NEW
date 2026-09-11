import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { GlassCard, FadeIn, MetricTile } from '../components/ui/primitives';
import useTranslation from '../services/useTranslation';
import api from '../services/api';

interface ForecastPoint {
  day: string;
  demand: number;
  supply: number;
}

interface DistrictPoint {
  name: string;
  demand: number;
  supply: number;
}

const FALLBACK_FORECAST: ForecastPoint[] = [
  { day: 'D-10', demand: 3100, supply: 3300 },
  { day: 'D-7', demand: 3250, supply: 3300 },
  { day: 'D-4', demand: 3400, supply: 3250 },
  { day: 'Today', demand: 3500, supply: 3200 },
  { day: 'D+5', demand: 4100, supply: 3100 },
  { day: 'D+10', demand: 4700, supply: 3000 },
  { day: 'D+14', demand: 5000, supply: 3200 },
];

const FALLBACK_DISTRICT: DistrictPoint[] = [
  { name: 'Chennai', demand: 5000, supply: 3200 },
  { name: 'Madurai', demand: 2200, supply: 5000 },
  { name: 'Coimbatore', demand: 4100, supply: 2800 },
  { name: 'Trichy', demand: 3300, supply: 2000 },
  { name: 'Salem', demand: 2100, supply: 1500 },
  { name: 'Erode', demand: 1200, supply: 900 },
];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [forecastData, setForecastData] = useState<ForecastPoint[]>(FALLBACK_FORECAST);
  const [districtData, setDistrictData] = useState<DistrictPoint[]>(FALLBACK_DISTRICT);
  const [metrics, setMetrics] = useState({ currentDemand: 3500, availableSupply: 3200, shortage: 300, confidence: 92.4 });

  useEffect(() => {
    let cancelled = false;
    api
      .get('/analytics/forecast')
      .then((res) => {
        if (cancelled || !res.data?.success) return;
        const trend: Array<{ date: string; demand: number; supply: number }> = res.data.forecastData ?? [];
        if (trend.length) {
          setForecastData(trend.map((p) => ({ day: p.date, demand: p.demand, supply: p.supply })));
        }
        const m = res.data.metrics ?? {};
        if (res.data.districtData?.length) setDistrictData(res.data.districtData);
        if (typeof m.currentDemand === 'number' || typeof m.availableSupply === 'number' || typeof m.shortage === 'number' || typeof m.confidence === 'number') {
          const demand = typeof m.currentDemand === 'number' ? m.currentDemand : 3500;
          const supply = typeof m.availableSupply === 'number' ? m.availableSupply : 3200;
          const shortage = typeof m.shortage === 'number' ? m.shortage : Math.max(0, demand - supply);
          setMetrics({
            currentDemand: demand,
            availableSupply: supply,
            shortage,
            confidence: typeof m.confidence === 'number' ? m.confidence : 92.4,
          });
        }
      })
      .catch(() => {
        // keep fallback data if the backend is unreachable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-agri-forest min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-5">
        <FadeIn>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-soil-gold">
              <span className="h-px w-6 bg-soil-gold/60" /> {t('analytics.title')}
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary">
              {t('analytics.heading')}
            </h1>
            <p className="text-sm text-text-muted">
              {t('analytics.subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricTile label={t('analytics.current_demand')} value={`${metrics.currentDemand.toLocaleString()} kg`} accent="text-soil-gold" />
          <MetricTile label={t('analytics.available_supply')} value={`${metrics.availableSupply.toLocaleString()} kg`} accent="text-soil-mint" />
          <MetricTile label={t('analytics.predicted_shortage')} value={`${metrics.shortage.toLocaleString()} kg`} accent="text-soil-goldSoft" />
          <MetricTile label={t('analytics.confidence')} value={`${metrics.confidence.toFixed(1)}%`} accent="text-soil-pale" />
        </div>

        {/* Demand vs supply area chart */}
        <FadeIn delay={0.05}>
          <GlassCard className="p-5 sm:p-6">
            <h2 className="font-display font-bold text-base text-text-primary mb-4">
              {t('analytics.region')}
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F6BD60" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#F6BD60" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E8B57" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#2E8B57" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#8FB3A0" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8FB3A0" fontSize={12} tickLine={false} width={48} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(11,43,30,0.92)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      color: '#EAF6EE',
                    }}
                    labelStyle={{ color: '#F6BD60' }}
                  />
                  <Legend wrapperStyle={{ color: '#EAF6EE', fontSize: 12 }} />
                  <Area type="monotone" dataKey="demand" name={t('analytics.demand_kg')} stroke="#F6BD60" strokeWidth={2} fill="url(#demandGrad)" />
                  <Area type="monotone" dataKey="supply" name={t('analytics.supply_kg')} stroke="#2E8B57" strokeWidth={2} fill="url(#supplyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </FadeIn>

        {/* District supply/demand bar chart */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-5 sm:p-6">
            <h2 className="font-display font-bold text-base text-text-primary mb-4">
              {t('analytics.district_subtitle')}
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#8FB3A0" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8FB3A0" fontSize={12} tickLine={false} width={48} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(11,43,30,0.92)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      color: '#EAF6EE',
                    }}
                    labelStyle={{ color: '#F6BD60' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend wrapperStyle={{ color: '#EAF6EE', fontSize: 12 }} />
                  <Bar dataKey="demand" name={t('analytics.demand_kg')} fill="#F6BD60" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="supply" name={t('analytics.supply_kg')} fill="#2E8B57" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}