import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80';

const scrollToDashboard = () => {
  const el = document.getElementById('dashboard');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 w-full pt-32 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left hero content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-soil-pale text-xs font-bold"
          >
            <span className="flex h-2 w-2 rounded-full bg-soil-gold animate-ping" />
            Introducing a new era
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-text-primary"
          >
            THE <span className="text-gold-gradient">SMART SOIL</span>
            <br />
            MARKETPLACE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
          >
            Celebrating the Fragrance of the Soil
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
              Learn More
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
