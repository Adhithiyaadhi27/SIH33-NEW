import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  MapPin,
  QrCode,
  Truck,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Users,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AIQualityModal from '../components/AIQualityModal';
import PassportModal from '../components/PassportModal';
import { INITIAL_PASSPORT } from '../services/mockData';
import { LeafVeinDivider, OrganicBlob, HarvestBasketIcon } from '../components/NatureIllustrations';

export default function Home() {
  const navigate = useNavigate();
  const { switchRolePersona } = useAuth();
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  // 8 Major Capabilities list matching PRD Section 10 & 15
  const capabilities = [
    {
      icon: "⚡",
      title: "Blinkit-Style Instant Stock Showcase",
      tagline: "Live catalog displaying instant fruit and vegetable inventories with real-time kg counters.",
      cta: "Explore Catalog",
      link: "/marketplace",
      chip: "Ready Harvest",
      color: "border-nature-leaf/40 bg-nature-card hover:border-nature-leaf"
    },
    {
      icon: "📸",
      title: "AI Quality Grading",
      tagline: "Computer Vision analyzes skin purity, color saturation, and blemishes into Grade A/B/C with confidence scores.",
      cta: "Test AI Scanner",
      action: () => setShowAIModal(true),
      chip: "AI Vision v2.4",
      color: "border-nature-ai/30 bg-nature-card hover:border-nature-ai"
    },
    {
      icon: "🏷️",
      title: "Digital Produce Passport",
      tagline: "End-to-end QR traceability: Farmer Plot GPS &rarr; Harvest &rarr; FPO &rarr; Cold Warehouse &rarr; Logistics &rarr; Buyer.",
      cta: "Inspect Batch Passport",
      action: () => setShowPassportModal(true),
      chip: "QR Traceable",
      color: "border-nature-earth/30 bg-nature-card hover:border-nature-earth"
    },
    {
      icon: "🗺️",
      title: "Live Supply Heat Map",
      tagline: "Interactive map identifying regional surpluses (e.g. Madurai) and routing into high-demand hubs (e.g. Chennai).",
      cta: "Open Live Map",
      link: "/supply-map",
      chip: "Corridors Active",
      color: "border-nature-leaf/40 bg-nature-card hover:border-nature-leaf"
    },
    {
      icon: "📈",
      title: "Demand & Supply Predictor",
      tagline: "AI forecasts regional agricultural shortages 14–30 days ahead based on seasonality, weather, and order velocity.",
      cta: "View Forecasts",
      link: "/ai-insights",
      chip: "14-30d Horizon",
      color: "border-nature-ai/30 bg-nature-card hover:border-nature-ai"
    },
    {
      icon: "🏪",
      title: "Buyers Marketplace",
      tagline: "Reverse-bidding platform where commercial buyers publish specifications and FPOs bid competitively.",
      cta: "Post Requirement",
      link: "/buyer-requirements",
      chip: "Reverse Bids",
      color: "border-nature-orange/40 bg-nature-card hover:border-nature-orange"
    },
    {
      icon: "⚠️",
      title: "Waste & Anomaly Engine",
      tagline: "Tracks shelf-life decay, identifies spoilage risk early, and triggers automated discounts and urban relocation.",
      cta: "Check Risk Radar",
      link: "/ai-insights",
      chip: "Decay Radar",
      color: "border-nature-tomato/30 bg-nature-card hover:border-nature-tomato"
    },
    {
      icon: "⭐",
      title: "Supplier Reliability Score",
      tagline: "Objective 0–100 trust matrix evaluating on-time delivery %, quality consistency %, and dispute resolution.",
      cta: "Inspect Scoring",
      link: "/ai-insights",
      chip: "Trust Matrix",
      color: "border-nature-harvest/40 bg-nature-card hover:border-nature-harvest"
    }
  ];

  return (
    <div className="space-y-16 pb-20 bg-nature-pattern">
      {/* Hero Section (Deep agricultural green gradient #1B4332 -> #2D6A4F with soft texture) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hero-nature-gradient text-white">
        {/* Subtle Organic Field Texture at 5-10% Opacity */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`
          }}
        />

        {/* Soft Organic Blobs */}
        <OrganicBlob className="top-10 left-10 w-96 h-96 opacity-20" color="bg-nature-soft" />
        <OrganicBlob className="bottom-10 right-10 w-[450px] h-[450px] opacity-15" color="bg-nature-harvest" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Nature Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-nature-pale text-xs font-bold shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-nature-soft animate-ping" />
              <span>Next-Generation Agricultural Technology Ecosystem</span>
            </div>

            {/* Main Headline (PRD Section 10) */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.15] text-white drop-shadow-sm">
              From Farm to Buyer, <br />
              <span className="bg-gradient-to-r from-nature-pale via-nature-cream to-nature-harvest bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </h1>

            {/* Subtitle (PRD Section 10) */}
            <p className="text-base sm:text-lg lg:text-xl text-nature-pale/90 max-w-2xl mx-auto leading-relaxed">
              Connect directly with agricultural supply, predict demand, aggregate supply, reduce wastage, verify quality and build a smarter agricultural supply chain.
            </p>

            {/* CTA Buttons (PRD Section 10) */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
              <Link
                to="/marketplace"
                className="bg-white hover:bg-nature-cream text-nature-primary px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition shadow-nature-lg hover:scale-105 flex items-center gap-2 group"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-nature-primary" />
              </Link>

              <button
                onClick={() => {
                  switchRolePersona('Bulk Buyer');
                  navigate('/marketplace');
                }}
                className="bg-nature-primary/80 hover:bg-nature-primary text-white border border-white/30 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-nature-harvest" />
                <span>Buy in Bulk</span>
              </button>

              <Link
                to="/buyer-requirements"
                className="bg-nature-orange hover:bg-amber-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition shadow-md hover:scale-105 flex items-center gap-2"
              >
                <span>Post Buyer Requirement</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Flow: Farm -> AI -> Marketplace -> Logistics -> Buyer */}
          <div className="mt-14 max-w-5xl mx-auto bg-nature-card/95 backdrop-blur-md rounded-basket-lg p-6 sm:p-8 border border-nature-soft/50 shadow-nature-lg text-nature-text">
            <div className="text-center mb-6">
              <span className="label-earth block">
                Synchronized Agricultural Ecosystem
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-nature-primary">
                Farm &rarr; AI &rarr; Marketplace &rarr; Logistics &rarr; Buyer
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {[
                { step: "1. Farm Yield", label: "Multi-Farmer Harvest", desc: "Red soil plots in Madurai & Ooty", icon: "🌱" },
                { step: "2. AI Quality", label: "Computer Vision", desc: "Grade A verification & 96% confidence", icon: "📸" },
                { step: "3. Aggregation", label: "FPO Co-op Pooling", desc: "1,000 + 1,500 + 2,500 = 5,000 kg", icon: "🤝" },
                { step: "4. Smart Logistics", label: "Cold Telemetry", desc: "Highway corridor IoT tracking", icon: "🚚" },
                { step: "5. Direct Buyer", label: "Instant & Bulk Fulfillment", desc: "Consumers & enterprise supermarkets", icon: "🥦" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-nature-bgSoft/80 border border-nature-soft/50 p-3.5 rounded-2xl text-center space-y-1 hover:border-nature-leaf transition-all hover:-translate-y-1"
                >
                  <span className="text-2xl block">{item.icon}</span>
                  <div className="text-[10px] font-bold text-nature-leaf uppercase">{item.step}</div>
                  <div className="font-bold text-xs text-nature-primary">{item.label}</div>
                  <div className="text-[10px] text-nature-text/70 leading-tight">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curved Leaf-Vein Divider */}
      <LeafVeinDivider />

      {/* 8 Major Capabilities Section (PRD Section 10 & 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-pale text-nature-primary text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-nature-leaf" /> Core Platform Capabilities
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-nature-primary">
            8 AI-Driven Capabilities Powering AgriDirect
          </h2>
          <p className="text-sm sm:text-base text-nature-text/80">
            From field computer vision to predictive cold chain logistics, discover how nature meets intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className={`rounded-basket border ${cap.color} p-6 shadow-nature hover:shadow-nature-lg transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-nature-bgSoft flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {cap.icon}
                  </div>
                  <span className="chip-nature text-[10px]">{cap.chip}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-nature-primary leading-snug">
                  {cap.title}
                </h3>
                <p className="text-xs text-nature-text/75 leading-relaxed">
                  {cap.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-nature-soft/30">
                {cap.link ? (
                  <Link
                    to={cap.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-nature-primary hover:text-nature-hover transition"
                  >
                    <span>{cap.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-nature-leaf" />
                  </Link>
                ) : (
                  <button
                    onClick={cap.action}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-nature-primary hover:text-nature-hover transition cursor-pointer"
                  >
                    <span>{cap.cta}</span>
                    <Sparkles className="w-3.5 h-3.5 text-nature-ai" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-nature-card border border-nature-soft/60 rounded-basket-lg p-8 shadow-nature">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="font-display font-extrabold text-3xl sm:text-5xl text-nature-leaf">
                +38%
              </div>
              <div className="label-earth">
                Farmer Realization Boost
              </div>
              <div className="text-[11px] text-nature-text/70">Eliminated 4 layers of middlemen</div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-3xl sm:text-5xl text-nature-orange">
                &lt; 4%
              </div>
              <div className="label-earth">
                Supply Chain Spoilage
              </div>
              <div className="text-[11px] text-nature-text/70">Down from 28% national average</div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-3xl sm:text-5xl text-nature-primary">
                14-30d
              </div>
              <div className="label-earth">
                Pre-Shortage Forecast
              </div>
              <div className="text-[11px] text-nature-text/70">Regional predictive intelligence</div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-3xl sm:text-5xl text-nature-leaf">
                100%
              </div>
              <div className="label-earth">
                GPS QR Traceability
              </div>
              <div className="text-[11px] text-nature-text/70">Every batch certified via Passport</div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Modals for Capabilities Demo */}
      {showAIModal && (
        <AIQualityModal
          product={{ name: "Country Vine Tomato", grade: "Grade A" }}
          onClose={() => setShowAIModal(false)}
        />
      )}

      {showPassportModal && (
        <PassportModal
          passport={INITIAL_PASSPORT}
          onClose={() => setShowPassportModal(false)}
        />
      )}
    </div>
  );
}
