import { Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Clock, Check, XCircle } from 'lucide-react';
import { useNegotiationStore } from '../store/negotiationStore';
import { GlassCard, FadeIn } from '../components/ui/primitives';

export default function NegotiationsPage() {
  const { negotiations } = useNegotiationStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-text-primary">My Negotiations</h1>
          <p className="text-xs text-text-muted mt-1">{negotiations.length} active negotiations</p>
        </div>
        <Link to="/marketplace" className="flex items-center gap-1 text-[10px] font-bold text-soil-gold hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to Marketplace
        </Link>
      </div>

      {negotiations.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <div className="flex justify-center text-soil-gold"><MessageSquare className="w-10 h-10" /></div>
          <h3 className="font-display font-bold text-lg text-text-primary">No negotiations yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">Start a bulk order negotiation from any product card.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-soil-gold hover:underline">
            Browse Marketplace →
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {negotiations.map((neg) => (
            <FadeIn key={neg.id}>
              <GlassCard className="p-4">
                <div className="flex items-start gap-4">
                  <img src={neg.productImage} alt={neg.productName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-text-primary">{neg.productName}</h4>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        neg.status === 'accepted'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : neg.status === 'declined'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-soil-gold/15 text-soil-gold'
                      }`}>
                        {neg.status === 'accepted' ? <Check className="w-2.5 h-2.5" /> : neg.status === 'declined' ? <XCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                        {neg.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {neg.requestedQty}kg · Listed: ₹{neg.originalPrice}/kg
                      {neg.currentOffer && (
                        <span className="text-soil-gold font-bold"> · Current Offer: ₹{neg.currentOffer}/kg</span>
                      )}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {neg.messages.length} messages · {new Date(neg.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {neg.status === 'accepted' && (
                    <Link
                      to="/cart"
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-[10px] font-bold text-white hover:brightness-110 transition"
                    >
                      Go to Cart
                    </Link>
                  )}
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
