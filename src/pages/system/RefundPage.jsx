import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-agri-dark to-agri-deep text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="font-display font-bold text-2xl sm:text-3xl">
          Order Cancellation & Refund Settlement
        </h1>
        <p className="text-xs sm:text-sm text-agri-pale/90 mt-1">
          Escrow reversals and retail digital wallet refund tracking
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-mono text-gray-500">Order ID: ORD-2026-7104</span>
            <h3 className="font-bold text-lg text-gray-900 mt-0.5">Heritage Country Tomato (5 kg)</h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
            REFUND_INITIATED
          </span>
        </div>

        {/* Refund Status Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Refund Amount</span>
            <strong className="text-xl text-agri-deep font-bold">₹160.00</strong>
            <span className="text-[10px] text-gray-500 block mt-0.5">Credited to UPI Account</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Cancellation Timestamp</span>
            <strong className="text-sm text-gray-800 font-bold">Today, 09:15 AM</strong>
            <span className="text-[10px] text-gray-500 block mt-0.5">Processed within 5 mins</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[11px]">Estimated Bank Settlement</span>
            <strong className="text-sm text-emerald-700 font-bold">Within 24 Hours</strong>
            <span className="text-[10px] text-gray-500 block mt-0.5">ARN: 9812401829</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Refund Lifecycle
          </h4>
          <div className="space-y-3 border-l-2 border-agri-bright/40 ml-3 pl-4 text-xs">
            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-agri-deep" />
              <div className="font-bold text-gray-900">Cancellation Confirmed</div>
              <p className="text-gray-500">Produce batch re-routed back to local packhouse inventory.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-agri-deep" />
              <div className="font-bold text-gray-900">Escrow / UPI Reversal Transmitted</div>
              <p className="text-gray-500">NPCI gateway acknowledged reversal request.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="font-bold text-emerald-800">Final Credit to Source Account</div>
              <p className="text-gray-500">Expected to reflect in your bank statement by tomorrow.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link to="/support" className="text-agri-deep hover:underline font-semibold">
            Need help with this refund? Contact Grievance Desk &rarr;
          </Link>
          <Link to="/marketplace" className="bg-agri-pale hover:bg-agri-bright/30 text-agri-dark font-bold px-4 py-2 rounded-xl">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
