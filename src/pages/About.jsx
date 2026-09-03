import React from 'react';
import { Sprout, ShieldCheck, TrendingUp, Users, Heart, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-agri-leaf bg-agri-pale px-3 py-1 rounded-full">
          Our Vision & Mission
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-agri-dark">
          Building India's Most Synchronized Digital Agricultural Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          AgriDirect AI exists to fundamentally restructure agricultural trade: eliminating predatory intermediaries, empowering FPO collectives, predicting regional food demand, and guaranteeing fresh produce traceability.
        </p>
      </div>

      {/* The Problem Statement (PRD Section 3) */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">The Traditional Breakdown</span>
          <h2 className="font-display font-bold text-2xl text-gray-900 mt-1">
            The Inefficiencies of Multi-Layered Middlemen
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            In standard supply chains, agricultural produce passes through up to 6 disconnected hands:
          </p>
        </div>

        {/* Middlemen flow */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          {['Farmer', 'Village Trader', 'Wholesaler', 'Distributor', 'Retailer', 'Consumer'].map((node, i) => (
            <div key={i} className="p-3 bg-rose-50 rounded-2xl border border-rose-200/60 font-bold text-rose-950">
              {node}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 pt-2">
          <div className="p-3 bg-gray-50 rounded-xl">
            <strong className="text-gray-900 block mb-1">Severe Price Degradation:</strong>
            Farmers frequently realize less than 30% of the final retail price paid by consumers.
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <strong className="text-gray-900 block mb-1">28%+ Harvest Spoilage:</strong>
            Lack of demand visibility and delayed logistics causes massive post-harvest wastage.
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <strong className="text-gray-900 block mb-1">Zero Origin Transparency:</strong>
            Buyers cannot verify crop origin, chemical inputs, or harvest freshness dates.
          </div>
        </div>
      </div>

      {/* The Solution (PRD Section 4 & 5) */}
      <div className="bg-gradient-to-br from-agri-dark via-agri-deep to-agri-leaf text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs uppercase font-bold text-agri-mint tracking-wider">The Synchronized Solution</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Farmers / FPOs &rarr; AgriDirect AI &rarr; Consumers / Bulk Buyers &rarr; Smart Logistics
          </h2>
          <p className="text-xs sm:text-sm text-agri-pale/90 leading-relaxed">
            Our AI engine continuously analyzes orders, buyer requirements, inventory, location, seasonality, weather data, and supplier reliability to match supply with demand instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-agri-pale">
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-white">1. Direct Fair Realization</h4>
            <p>Farmers earn up to 40% higher returns through FPO consolidation and transparent pricing.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-white">2. Pre-Harvest Demand AI</h4>
            <p>Forecast regional shortages 14 to 30 days ahead to eliminate supply gluts and price crashes.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-sm text-white">3. Complete QR Passport</h4>
            <p>Every lot receives a digital certificate with plot GPS, harvest date, and CV quality grade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
