import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Warehouse, Gauge, AlertTriangle, Zap, ArrowRight, Loader2, MapPin, Clock, IndianRupee, ExternalLink } from 'lucide-react';
import { GlassCard, MetricTile, GlassBadge, FadeIn } from '../ui/primitives';
import { useLogisticsStore, rerouteStatusColor, corridorHeatColor } from '../../store/logisticsStore';
import { useRealtime } from '../../services/realtime';

export default function LogisticsDashboard() {
  const { proposals, corridors, assignments, loading, load, acceptProposal } = useLogisticsStore();

  useEffect(() => {
    load();
  }, [load]);

  useRealtime('logistics:reroute', () => {
    useLogisticsStore.getState().load();
  });

  const pending = proposals.filter((p) => p.status === 'PENDING');
  const inFlight = assignments.filter((a) => a.status === 'IN_TRANSIT').length;
  const fleetAvailable = Math.max(0, 18 - inFlight * 2);

  const handleAccept = async (proposalId: string) => {
    await acceptProposal(proposalId);
  };

  return (
    <div className="space-y-5">
      <div>
        <GlassBadge gold>Logistics Partner</GlassBadge>
        <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">Cold-Chain Command Center</h1>
        <p className="text-xs text-text-muted">Perishable-produce re-routing, corridor capacity &amp; live fleet operations</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricTile label="Active Deliveries" value={String(inFlight + 6)} accent="text-soil-gold" />
        <MetricTile label="Fleet Available" value={`${fleetAvailable} of 18`} accent="text-soil-mint" />
        <MetricTile label="Corridors" value={String(corridors.length)} />
        <MetricTile label="Reroutes in Flight" value={String(inFlight)} accent="text-red-300" />
      </div>

      {/* Corridor capacity heatmap */}
      <FadeIn>
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-soil-gold" />
              <h2 className="font-display font-bold text-base text-text-primary">Corridor Capacity Heatmap</h2>
            </div>
            <span className="text-[9px] text-text-muted uppercase tracking-wider">Live utilization</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {corridors.map((c) => (
              <div key={c.id} className="glass-panel-sm p-3 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="font-bold text-text-primary">{c.from} <span className="text-text-muted">→</span> {c.to}</div>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${rerouteStatusColor(c.status)}`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[9px] text-text-muted">{c.partner} · {c.vehicle}</div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${corridorHeatColor(c.utilizationPct)}`} style={{ width: `${Math.min(100, c.utilizationPct)}%` }} />
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-text-muted">{c.availableKg.toLocaleString()} kg available / {c.capacityKg.toLocaleString()} kg</span>
                  <span className={c.utilizationPct >= 70 ? 'text-red-300 font-bold' : 'text-soil-gold font-bold'}>{c.utilizationPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Reroute proposals */}
      <FadeIn delay={0.05}>
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="font-display font-bold text-base text-text-primary">At-Risk Produce → Redirection Proposals</h2>
          </div>

          {loading && pending.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-text-muted py-6">
              <Loader2 className="w-4 h-4 animate-spin text-soil-gold" /> Analyzing food depots…
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-bold text-text-primary text-sm">No pending redirections</div>
              <p className="text-[11px] text-text-muted mt-1">All at-risk produce is bound to a dispatch plan.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pending.map((p) => {
                const corr = corridors.find((c) => c.id === p.suggestedCorridorId);
                return (
                  <div key={p.id} className="glass-panel-sm p-3.5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-400/30 flex items-center justify-center shrink-0">
                          <Warehouse className="w-4 h-4 text-red-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-text-primary">{p.product} <span className="text-red-300 text-[9px] font-bold align-middle ml-1">● {p.wasteRisk} RISK</span></div>
                          <div className="text-[10px] text-text-muted">{p.depotName}, {p.city}</div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px]">
                            <span className="flex items-center gap-1 text-text-muted"><Zap className="w-3 h-3 text-red-400" /> {p.quantityKg.toLocaleString()} kg</span>
                            <span className="flex items-center gap-1 text-text-muted"><Clock className="w-3 h-3 text-amber-300" /> {p.shelfLifeRemainingDays} day(s) shelf life</span>
                            <span className="flex items-center gap-1 text-text-muted"><IndianRupee className="w-3 h-3" /> loss risk ₹{p.projectedLossInr.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 justify-end text-xs">
                          <span className="line-through text-text-muted">₹{p.originalPrice.toFixed(2)}</span>
                          <span className="font-extrabold text-red-300">₹{p.discountedPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-[9px] font-bold text-red-300">Flash deal {p.flashDiscountPct}% off</span>
                      </div>
                    </div>

                    {corr && (
                      <div className="bg-soil-deep/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <MapPin className="w-3 h-3 text-soil-gold" />
                          <span className="font-bold text-text-primary">{p.depotName}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-bold text-soil-gold">{corr.to}</span>
                          <span className="text-text-muted">· {corr.vehicle} · {corr.transitHours} hrs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rerouteStatusColor(corr.status)}`}>
                            {corr.availableKg.toLocaleString()} kg free
                          </span>
                          <button
                            onClick={() => handleAccept(p.id)}
                            disabled={corr.availableKg < p.quantityKg}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold bg-gradient-to-r from-red-500 to-orange-400 text-white hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Truck className="w-3.5 h-3.5" /> Accept Redirection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </FadeIn>

      {/* Bound reroute orders */}
      <FadeIn delay={0.1}>
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-soil-gold" />
            <h2 className="font-display font-bold text-base text-text-primary">Bound Re-route Dispatches</h2>
          </div>
          {assignments.length === 0 ? (
            <p className="text-[11px] text-text-muted py-4 text-center">Accept a redirection to bind a truck and open live tracking.</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((a) => (
                <div key={a.assignmentId} className="glass-panel-sm px-3.5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">{a.product} · {a.quantityKg.toLocaleString()} kg</div>
                      <div className="text-[10px] text-text-muted">{a.depot} → {a.to} · {a.driverName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">{a.status.replace('_', ' ')}</span>
                    <Link to="/tracking" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
                      {a.orderId} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </FadeIn>
    </div>
  );
}