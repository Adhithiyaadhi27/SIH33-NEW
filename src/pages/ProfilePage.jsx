import React from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, Building, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { currentUser, role } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-100">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-agri-bright shadow"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl text-gray-900">
                {currentUser?.name || 'Agricultural Partner'}
              </h1>
              <span className="text-xs font-bold bg-agri-pale text-agri-dark px-3 py-0.5 rounded-full">
                {role}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {currentUser?.organization || currentUser?.company || 'Verified AgriDirect Network Member'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KYC Verified &bull; GST/Aadhaar Linked</span>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                disabled
                value={currentUser?.phone || '+91 98765 43210'}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Primary Mandi / City Hub</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                disabled
                value={currentUser?.city || 'Chennai'}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">State / Territory</label>
            <input
              type="text"
              disabled
              value={currentUser?.state || 'Tamil Nadu'}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
            />
          </div>
        </div>

        {/* Bank & Escrow Payout Information */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="font-display font-bold text-sm text-gray-900">
            Mandi Settlement Bank & Escrow Accounts
          </h3>
          <div className="p-4 bg-agri-soft/70 rounded-2xl border border-agri-bright/30 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-agri-dark">State Bank of India (SBI Mandi Branch)</span>
              <p className="text-gray-500 font-mono mt-0.5">A/C: •••• •••• 9924 &bull; IFSC: SBIN0004128</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Active for Direct Credit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
