import React from 'react';
import { Sprout, Camera, Layers, Truck, QrCode, ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Crop Harvest & Field Ingestion",
      desc: "Farmers harvest crops at peak maturity. Individual plot coordinates, soil type, and harvest timestamps are logged into the FPO co-operative registry.",
      icon: "🌱"
    },
    {
      num: "02",
      title: "AI Computer-Vision Quality Grading",
      desc: "High-resolution camera feeds scan skin surface, color saturation, and blemishes, classifying produce into Grade A, B, or C with 95%+ confidence.",
      icon: "📸"
    },
    {
      num: "03",
      title: "Multi-Supplier Smart Aggregation",
      desc: "Our aggregation engine groups yields from multiple smallholder farmers (e.g. 1,000kg + 1,500kg + 2,500kg) into uniform commercial batches for bulk buyers.",
      icon: "🤝"
    },
    {
      num: "04",
      title: "Digital Produce Passport Minting",
      desc: "A tamper-evident batch identity (e.g. AGR-2026-1024) is generated with dynamic QR code, embedding full traceability from plot to packhouse.",
      icon: "🏷️"
    },
    {
      num: "05",
      title: "Temperature-Monitored Cold Transit",
      desc: "Assigned refrigerated logistics carriers transport produce with live IoT temperature tracking and route optimization along major national corridors.",
      icon: "🚚"
    },
    {
      num: "06",
      title: "Instant Consumer & Bulk Fulfillment",
      desc: "Consumers receive fresh produce via Blinkit-style instant delivery while bulk buyers verify digital Proof of Delivery and unlock escrow funds.",
      icon: "🥦"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-agri-leaf bg-agri-pale px-3 py-1 rounded-full">
          Transparent Operations
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-agri-dark">
          How AgriDirect AI Powers Farm-to-Fork Fulfillment
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          A seamless digital pathway connecting rural Indian harvests to urban households and commercial enterprises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-agri-bright/40 transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{step.icon}</span>
                <span className="font-display font-extrabold text-2xl text-agri-mint">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-agri-dark">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-agri-deep font-semibold">
              <CheckCircle2 className="w-4 h-4 text-agri-leaf" /> Fully Verified Step
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-agri-dark to-agri-deep text-white rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-xl">
        <h3 className="font-display font-bold text-2xl">Ready to Experience Transparent Agritech?</h3>
        <p className="text-xs sm:text-sm text-agri-pale">
          Whether you are an FPO co-operative, an everyday consumer, or a commercial buyer, join India's fastest growing farm supply network.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/marketplace"
            className="bg-white text-agri-dark hover:bg-agri-pale font-bold px-6 py-2.5 rounded-xl text-xs transition shadow"
          >
            Explore Catalog
          </Link>
          <Link
            to="/register"
            className="bg-agri-harvest hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow"
          >
            Register Your FPO / Business
          </Link>
        </div>
      </div>
    </div>
  );
}
