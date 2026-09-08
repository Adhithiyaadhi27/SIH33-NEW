import { GlassCard, MetricTile, GlassBadge } from '../ui/primitives';
import { mockOrders } from '../../data/mockOrders';
import useTranslation from '../../services/useTranslation';

interface RoleCockpitProps {
  role: string;
  tagline: string;
}

const roleContent: Record<
  string,
  { titleKey: string; navbarKey: string; taglineKey: string; metrics: Array<{ labelKey: string; value: string; accent?: string }>; moduleKeys: string[] }
> = {
  FPO: {
    titleKey: 'role.fpo_title',
    navbarKey: 'navbar.fpo',
    taglineKey: 'role.fpo_tagline',
    metrics: [
      { labelKey: 'role.member_farmers', value: '340' },
      { labelKey: 'role.aggregated', value: '5,000 kg', accent: 'text-soil-gold' },
      { labelKey: 'role.active_demand', value: '₹1.2L', accent: 'text-soil-mint' },
      { labelKey: 'role.bulk_orders', value: '4' },
    ],
    moduleKeys: ['role.farmer_aggregation', 'role.batch_pooling', 'role.inventory_demand'],
  },
  Consumer: {
    titleKey: 'role.consumer_title',
    navbarKey: 'navbar.consumer',
    taglineKey: 'role.consumer_tagline',
    metrics: [
      { labelKey: 'role.cart_items', value: '3' },
      { labelKey: 'role.cart_value', value: '₹160', accent: 'text-soil-gold' },
      { labelKey: 'role.orders', value: '1 active' },
      { labelKey: 'role.delivery_eta', value: '45 min', accent: 'text-soil-mint' },
    ],
    moduleKeys: ['role.marketplace_discovery', 'role.cart_checkout', 'role.delivery_tracking'],
  },
  'Bulk Buyer': {
    titleKey: 'role.bulk_title',
    navbarKey: 'navbar.bulk_buyer',
    taglineKey: 'role.bulk_tagline',
    metrics: [
      { labelKey: 'role.open_rfps', value: '3' },
      { labelKey: 'role.bids_received', value: '12', accent: 'text-soil-gold' },
      { labelKey: 'role.committed_kg', value: '12,000', accent: 'text-soil-mint' },
      { labelKey: 'role.avg_price', value: '₹26.50' },
    ],
    moduleKeys: ['role.reverse_bidding', 'role.supplier_comparison', 'role.contract_orders'],
  },
  Logistics: {
    titleKey: 'role.logistics_title',
    navbarKey: 'navbar.logistics',
    taglineKey: 'role.logistics_tagline',
    metrics: [
      { labelKey: 'role.active_deliveries', value: '6' },
      { labelKey: 'role.fleet_available', value: '12 of 18', accent: 'text-soil-gold' },
      { labelKey: 'role.avg_route', value: '240 km' },
      { labelKey: 'role.on_time', value: '96%', accent: 'text-soil-mint' },
    ],
    moduleKeys: ['role.route_optimization', 'role.vehicle_telemetry', 'role.aggregation_points'],
  },
  Admin: {
    titleKey: 'role.admin_title',
    navbarKey: 'navbar.admin',
    taglineKey: 'role.admin_tagline',
    metrics: [
      { labelKey: 'role.users', value: '1,240' },
      { labelKey: 'role.fpo_pending', value: '3', accent: 'text-soil-gold' },
      { labelKey: 'role.orders_today', value: '188' },
      { labelKey: 'role.system_health', value: '99.2%', accent: 'text-soil-mint' },
    ],
    moduleKeys: ['role.user_fpo_verification', 'role.marketplace_monitoring', 'role.analytics_settings'],
  },
};

export default function RoleCockpit({ role, tagline }: RoleCockpitProps) {
  const { t } = useTranslation();
  const content = roleContent[role];

  return (
    <div className="space-y-5">
      <div>
        <GlassBadge gold>{t('role.cockpit_badge', { role: t(content.navbarKey) })}</GlassBadge>
        <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">{t(content.titleKey)}</h1>
        <p className="text-xs text-text-muted">{content.taglineKey ? t(content.taglineKey) : tagline}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {content.metrics.map((m) => (
          <MetricTile key={m.labelKey} label={t(m.labelKey)} value={m.value} accent={m.accent} />
        ))}
      </div>

      <GlassCard className="p-5 space-y-3">
        <h2 className="font-display font-bold text-base text-text-primary">{t('role.modules')}</h2>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {content.moduleKeys.map((b) => (
            <div key={b} className="glass-panel-sm p-3 text-sm font-semibold text-text-primary hover:border-soil-gold/40 transition cursor-pointer">
              {t(b)}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent orders */}
      <GlassCard className="p-5 space-y-3">
        <h2 className="font-display font-bold text-base text-text-primary">{t('role.recent_orders')}</h2>
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