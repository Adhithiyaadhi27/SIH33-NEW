import HeroSection from '../components/hero/HeroSection';
import AggregationSimulator from '../components/aggregation/AggregationSimulator';
import CropQualitySandbox from '../components/ai/CropQualitySandbox';
import ProducePassport from '../components/passport/ProducePassport';
import SupplyDemandHeatmap from '../components/heatmap/SupplyDemandHeatmap';
import Marketplace from '../components/marketplace/Marketplace';
import RoleSwitcher from '../components/roles/RoleSwitcher';
import LiveActivityFeed from '../components/activity/LiveActivityFeed';
import OrderTrackingWidget from '../components/tracking/OrderTrackingWidget';
import WeatherWidget from '../components/weather/WeatherWidget';
import { FadeIn } from '../components/ui/primitives';

const FIELD_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#081F16]">

      {/* LAYER 0 — Agricultural farmland photo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${FIELD_IMG})`,
          backgroundPosition: 'center 75%',
        }}
      />

      {/* LAYER 1 — Dark green atmospheric veil */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg,
            rgba(8,31,22,0.94) 0%,
            rgba(11,43,30,0.80) 20%,
            rgba(15,58,38,0.55) 45%,
            rgba(11,43,30,0.65) 70%,
            rgba(6,22,16,0.88) 100%)`,
        }}
      />

      {/* LAYER 2 — Emerald glow center-left */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `
            radial-gradient(900px 700px at 18% 42%, rgba(46,139,87,0.35), transparent 65%),
            radial-gradient(650px 450px at 32% 55%, rgba(30,120,70,0.22), transparent 60%),
            radial-gradient(500px 350px at 8% 65%, rgba(124,207,162,0.10), transparent 55%)`,
        }}
      />

      {/* LAYER 3 — Golden sunlight glow right */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: `
            radial-gradient(750px 550px at 82% 22%, rgba(246,189,96,0.22), transparent 60%),
            radial-gradient(550px 420px at 92% 38%, rgba(250,212,138,0.12), transparent 55%),
            radial-gradient(420px 320px at 78% 12%, rgba(218,165,32,0.10), transparent 50%)`,
        }}
      />

      {/* LAYER 4 — Teal upper atmosphere */}
      <div
        className="absolute inset-0 z-[4]"
        style={{
          background: `
            radial-gradient(1500px 450px at 50% -8%, rgba(20,80,60,0.45), transparent 70%),
            radial-gradient(1000px 350px at 28% 3%, rgba(30,100,70,0.25), transparent 60%)`,
        }}
      />

      {/* LAYER 5 — Deep cinematic vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 300px 80px rgba(0,0,0,0.72),
            inset 0 0 120px 40px rgba(4,15,10,0.55)`,
        }}
      />

      {/* CONTENT — sits above all background layers */}
      <div className="relative z-10">
        <HeroSection />

        {/* Dashboard Grid */}
        <main id="dashboard" className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6 space-y-4 sm:space-y-5">
          <FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="md:col-span-2 lg:col-span-2">
                <AggregationSimulator />
              </div>
              <div id="ai-grading" className="md:col-span-2 lg:col-span-1">
                <CropQualitySandbox />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div id="passport" className="md:col-span-2 lg:col-span-1">
                <ProducePassport />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <SupplyDemandHeatmap />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <Marketplace />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="md:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
                <LiveActivityFeed />
                <OrderTrackingWidget compact />
              </div>
              <div className="md:col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
                <WeatherWidget region="Madurai, TN" />
                <RoleSwitcher />
              </div>
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
