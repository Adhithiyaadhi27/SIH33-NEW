import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, CreditCard, ArrowLeft } from 'lucide-react';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-rose-200 p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Payment Failed
          </h1>
          <p className="text-sm font-semibold text-rose-600">
            Payment could not be completed.
          </p>
          <p className="text-xs text-gray-500">
            Your bank or UPI provider could not authenticate the transaction. No amounts were debited for your produce order.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigate('/marketplace')}
            className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </button>

          <button
            onClick={() => navigate('/marketplace')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Change Payment Method</span>
          </button>

          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs text-agri-deep font-bold hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
