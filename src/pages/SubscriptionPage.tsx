import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Pause, Play, X, Package, Calendar } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { GlassCard, FadeIn } from '../components/ui/primitives';

export default function SubscriptionPage() {
  const { plans, activeSubscription, subscribe, pauseSubscription, resumeSubscription, cancelSubscription } = useSubscriptionStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">Produce Subscriptions</h1>
          <p className="text-xs text-text-muted mt-1">Fresh produce delivered to your doorstep — weekly, biweekly, or monthly</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to Marketplace
        </Link>
      </div>

      {/* Active Subscription */}
      {activeSubscription && (
        <FadeIn>
          <GlassCard className="p-5 border-soil-gold/30">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-soil-gold" />
              <h3 className="font-display font-bold text-sm text-text-primary">Your Active Subscription</h3>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                activeSubscription.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                activeSubscription.status === 'paused' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {activeSubscription.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="glass-panel-sm p-2">
                <div className="text-[9px] text-text-muted">Plan</div>
                <div className="text-[11px] font-bold text-text-primary">{plans.find((p) => p.id === activeSubscription.planId)?.name ?? '—'}</div>
              </div>
              <div className="glass-panel-sm p-2">
                <div className="text-[9px] text-text-muted">Started</div>
                <div className="text-[11px] font-bold text-text-primary">{activeSubscription.startDate}</div>
              </div>
              <div className="glass-panel-sm p-2">
                <div className="text-[9px] text-text-muted">Next Delivery</div>
                <div className="text-[11px] font-bold text-soil-gold">{activeSubscription.nextDelivery}</div>
              </div>
              <div className="glass-panel-sm p-2">
                <div className="text-[9px] text-text-muted">Deliveries</div>
                <div className="text-[11px] font-bold text-text-primary">{activeSubscription.deliveriesCompleted}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {activeSubscription.status === 'active' ? (
                <button onClick={pauseSubscription} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-bold cursor-pointer hover:bg-amber-500/30 transition">
                  <Pause className="w-3 h-3" /> Pause
                </button>
              ) : (
                <button onClick={resumeSubscription} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/30 transition">
                  <Play className="w-3 h-3" /> Resume
                </button>
              )}
              <button onClick={cancelSubscription} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-[10px] font-bold cursor-pointer hover:bg-red-500/30 transition">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <FadeIn key={plan.id} delay={i * 0.05}>
            <GlassCard className={`p-5 space-y-3 ${plan.popular ? 'border-soil-gold/40 ring-1 ring-soil-gold/20' : ''}`}>
              {plan.popular && (
                <span className="inline-block text-[8px] font-bold bg-soil-gold/20 text-soil-gold px-2 py-0.5 rounded-full uppercase">Most Popular</span>
              )}
              <h3 className="font-display font-bold text-base text-text-primary">{plan.name}</h3>
              <p className="text-[10px] text-text-muted">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-2xl text-soil-gold">₹{plan.price}</span>
                <span className="text-[10px] text-text-muted">/{plan.frequency}</span>
              </div>
              <div className="space-y-1.5">
                {plan.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-6 h-6 rounded-md object-cover" />
                    <span className="text-[10px] text-text-primary">{item.name}</span>
                    <span className="text-[9px] text-text-muted ml-auto">{item.qty}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => subscribe(plan.id)}
                disabled={activeSubscription?.planId === plan.id}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-white text-xs font-bold cursor-pointer hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {activeSubscription?.planId === plan.id ? 'Current Plan' : <><Check className="w-3.5 h-3.5" /> Subscribe Now</>}
              </button>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
