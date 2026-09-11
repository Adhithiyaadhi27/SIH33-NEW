import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';
import useTranslation from '../../services/useTranslation';

const HERO_BG = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80';

const scrollToDashboard = () => {
  const el = document.getElementById('dashboard');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-24 pb-6 lg:pt-28 lg:pb-8">
      {/* Full-viewport agricultural background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Layered overlays: dark green + warm gold + radial glow + vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-soil-deep/70 via-soil-forest/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-soil-base via-transparent to-soil-deep/80" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(900px 500px at 70% 20%, rgba(246,189,96,0.22), transparent 60%)' }} />
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left hero content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-soil-pale text-xs font-bold"
          >
            <span className="flex h-2 w-2 rounded-full bg-soil-gold animate-ping" />
            {t('hero.introducing')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-text-primary"
          >
            <span dangerouslySetInnerHTML={{
              __html: t('hero.tagline').replace(/SMART SOIL/i, '<span class="text-gold-gradient">SMART SOIL</span>'),
            }} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button
              onClick={scrollToDashboard}
              className="group inline-flex items-center gap-2 bg-soil-gold hover:brightness-110 text-soil-base px-6 py-3 rounded-2xl font-bold text-sm shadow-glow-gold transition cursor-pointer"
            >
              {t('hero.learn_more')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </motion.div>
        </div>

        {/* Right side floating preview telemetry panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 lg:mt-0 block"
        >
          <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl bg-soil-deep/60 space-y-5 max-w-lg ml-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-soil-emerald/30 border border-soil-emerald/40 flex items-center justify-center text-soil-mint">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-sm text-text-primary">AgriDirect Live Telemetry</div>
                  <div className="text-[10px] text-text-muted">Direct FPO &bull; Smart Soil Network</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Node
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel-sm p-3 rounded-xl">
                <div className="text-[10px] text-text-muted font-medium">Active Member Farmers</div>
                <div className="text-base font-display font-extrabold text-soil-gold mt-0.5">340+ FPO Members</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">&uarr; 100% Geo-Tagged</div>
              </div>
              <div className="glass-panel-sm p-3 rounded-xl">
                <div className="text-[10px] text-text-muted font-medium">Batch Aggregation</div>
                <div className="text-base font-display font-extrabold text-text-primary mt-0.5">5,000 kg Fresh</div>
                <div className="text-[9px] text-soil-mint font-semibold mt-0.5">Grade A Certified</div>
              </div>
              <div className="glass-panel-sm p-3 rounded-xl">
                <div className="text-[10px] text-text-muted font-medium">Computer Vision QA</div>
                <div className="text-base font-display font-extrabold text-soil-mint mt-0.5">94.8% Ripeness</div>
                <div className="text-[9px] text-text-muted mt-0.5">Skin purity &bull; Blemish scan</div>
              </div>
              <div className="glass-panel-sm p-3 rounded-xl">
                <div className="text-[10px] text-text-muted font-medium">Cold Chain Logistics</div>
                <div className="text-base font-display font-extrabold text-soil-goldSoft mt-0.5">4 Active Fleets</div>
                <div className="text-[9px] text-soil-gold font-semibold mt-0.5">TN Highways Telemetry</div>
              </div>
            </div>

            {/* Quick interactive anchors */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10 text-xs">
              <button
                onClick={scrollToDashboard}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary font-semibold text-center transition cursor-pointer text-[11px]"
              >
                &rarr; Aggregator
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('ai-grading');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary font-semibold text-center transition cursor-pointer text-[11px]"
              >
                &rarr; AI Inspection
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('passport');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary font-semibold text-center transition cursor-pointer text-[11px]"
              >
                &rarr; QR Passport
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}