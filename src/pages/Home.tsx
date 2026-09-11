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
      <main id="dashboard" className="relative mt-2 lg:mt-4 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-5">
        {/* Row 1: Aggregation Simulator (2 cols) + AI Quality Grading (1 col) */}
        <FadeIn>
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            <div className="lg:col-span-2 h-full">
              <AggregationSimulator />
            </div>
            <div id="ai-grading" className="lg:col-span-1 h-full">
              <CropQualitySandbox />
            </div>
          </div>
        </FadeIn>

        {/* Row 2: Supply/Demand Heatmap (2 cols) + Digital Produce Passport (1 col) */}
        <FadeIn>
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            <div className="lg:col-span-2 h-full">
              <SupplyDemandHeatmap />
            </div>
            <div id="passport" className="lg:col-span-1 h-full">
              <ProducePassport />
            </div>
          </div>
        </FadeIn>

        {/* Row 3: Live Feeds (1 col) + Active Order Tracking (1 col) + Weather & Roles (1 col) */}
        <FadeIn>
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            <div className="h-full">
              <LiveActivityFeed />
            </div>
            <div className="h-full">
              <OrderTrackingWidget compact />
            </div>
            <div className="space-y-3.5 flex flex-col">
              <WeatherWidget region="Madurai, TN" />
              <RoleSwitcher />
            </div>
          </div>
        </FadeIn>

        {/* Row 4: Full-Width Instant Marketplace Showcase */}
        <FadeIn>
          <div id="marketplace" className="w-full">
            <Marketplace />
          </div>
        </FadeIn>
      </main>
    </div>
  );
}