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

export default function Home() {
  return (
    <div className="bg-agri-forest min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Dashboard Grid Sample — mirrors the reference composition */}
      <main id="dashboard" className="relative mt-8 lg:-mt-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">
        <FadeIn>
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left 2/3: Aggregation Simulator */}
            <div className="lg:col-span-2">
              <FadeIn>
                <AggregationSimulator />
              </FadeIn>
            </div>
            {/* Top-right: AI Crop Quality Grading */}
            <div id="ai-grading">
              <FadeIn delay={0.1}>
                <CropQualitySandbox />
              </FadeIn>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Bottom-left: Digital Produce Passport */}
            <div id="passport">
              <ProducePassport />
            </div>
            {/* Center-bottom: Live Heatmap */}
            <div className="lg:col-span-1">
              <SupplyDemandHeatmap />
            </div>
            {/* Center/right: Marketplace */}
            <div>
              <Marketplace />
            </div>
          </div>
        </FadeIn>

        {/* Floating Interactive Panels — right side */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <LiveActivityFeed />
            <OrderTrackingWidget compact />
          </div>
          <div className="space-y-5">
            <WeatherWidget region="Madurai, TN" />
            <RoleSwitcher />
          </div>
        </div>
      </main>
    </div>
  );
}