import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useTranslation from '../../services/useTranslation';

const HERO_BG = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80';

const scrollToDashboard = () => {
  const el = document.getElementById('dashboard');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* Full-viewport agricultural background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Cinematic overlay stack */}
      <div className="absolute inset-0 bg-gradient-to-br from-soil-deep/80 via-soil-forest/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-soil-base via-transparent to-soil-deep/90" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(1000px 600px at 70% 20%, rgba(246,189,96,0.20), transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(800px 500px at 20% 50%, rgba(46,139,87,0.18), transparent 60%)' }} />
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 w-full pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-14 lg:pb-16 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
        {/* Left hero content */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-soil-pale text-[10px] sm:text-xs font-bold"
          >
            <span className="flex h-2 w-2 rounded-full bg-soil-gold animate-ping" />
            {t('hero.introducing')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.08] text-text-primary"
          >
            <span dangerouslySetInnerHTML={{
              __html: t('hero.tagline').replace(/SMART SOIL/i, '<span class="text-gold-gradient">SMART SOIL</span>'),
            }} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl leading-relaxed"
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
              className="group inline-flex items-center gap-2 bg-soil-gold hover:brightness-110 text-soil-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-glow-gold transition cursor-pointer"
            >
              {t('hero.learn_more')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </motion.div>
        </div>

        {/* Right side could hold a floating preview card; kept minimal for hero */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}