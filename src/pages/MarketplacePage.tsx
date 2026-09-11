import Marketplace from '../components/marketplace/Marketplace';
import { FadeIn } from '../components/ui/primitives';

export default function MarketplacePage() {
  return (
    <div className="bg-agri-forest min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-5">
        <FadeIn>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-soil-gold">
              <span className="h-px w-6 bg-soil-gold/60" /> Marketplace <span className="h-px w-6 bg-soil-gold/60" />
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary">
              Fresh Produce, Real-Time Pricing
            </h1>
            <p className="text-sm text-text-muted max-w-2xl mx-auto">
              Fresh vegetables and fruits straight from verified farmer partners.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Marketplace />
        </FadeIn>
      </div>
    </div>
  );
}