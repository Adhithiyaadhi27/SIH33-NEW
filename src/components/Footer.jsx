import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-nature-primary text-white border-t border-nature-soft/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-nature-leaf flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                AgriDirect <span className="text-nature-soft">AI</span>
              </span>
            </div>
            <p className="text-sm text-nature-pale/80 leading-relaxed max-w-sm">
              Next-generation agricultural marketplace and smart supply chain synchronization. Connecting farmers and FPOs directly to everyday consumers and bulk procurement with AI-driven quality grading, demand forecasting, and zero-waste logistics.
            </p>
            <div className="flex items-center gap-4 text-xs text-nature-pale pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-nature-soft" /> 100% Traceable
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-nature-soft" /> FPO Aggregation
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-nature-tomato" /> Direct Fair Price
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-nature-soft mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-nature-cream/80">
              <li>
                <Link to="/marketplace" className="hover:text-white transition">
                  🥦 Instant Stock Showcase
                </Link>
              </li>
              <li>
                <Link to="/buyer-requirements" className="hover:text-white transition">
                  🏪 Bulk Buyer Requirements
                </Link>
              </li>
              <li>
                <Link to="/supply-map" className="hover:text-white transition">
                  🗺️ Live Supply Heat Map
                </Link>
              </li>
              <li>
                <Link to="/produce-passport" className="hover:text-white transition">
                  🏷️ Digital Produce Passport
                </Link>
              </li>
              <li>
                <Link to="/ai-insights" className="hover:text-white transition">
                  📈 AI Demand Forecasting
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-nature-soft mb-4">
              Stakeholders
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-nature-cream/80">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  FPO Aggregation Portal
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Commercial Bulk Buyers
                </Link>
              </li>
              <li>
                <Link to="/logistics" className="hover:text-white transition">
                  Smart Logistics Partners
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  Traceability Flow
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Our Agritech Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & System Pages */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-nature-soft mb-4">
              System & Help
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-nature-cream/80">
              <li>
                <Link to="/support" className="hover:text-white transition">
                  Help Center & Tickets
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/payment-failed" className="hover:text-white transition">
                  Payment Recovery
                </Link>
              </li>
              <li>
                <Link to="/maintenance" className="hover:text-white transition">
                  Maintenance Status
                </Link>
              </li>
              <li>
                <Link to="/404" className="hover:text-white transition">
                  Field Not Found (404)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-nature-pale/60 gap-4">
          <p>
            &copy; {new Date().getFullYear()} AgriDirect AI Platform. All rights reserved. Made for sustainable Indian agriculture.
          </p>
          <div className="flex items-center gap-6">
            <span>Server: Asia-South1 (Mumbai)</span>
            <span>AI Model: AgriVision CV 2.4</span>
            <Link to="/support" className="hover:underline">
              Grievance Officer: grievance@agridirect.ai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
