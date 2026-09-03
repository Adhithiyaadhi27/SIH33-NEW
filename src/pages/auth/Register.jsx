import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Building, Truck, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  {
    id: 'Consumer',
    title: 'Consumer',
    desc: 'Purchase fresh harvests directly from verified FPOs for personal use.',
    icon: ShoppingCart
  },
  {
    id: 'Bulk Buyer',
    title: 'Bulk Buyer',
    desc: 'Supermarkets, restaurants, and food processors procuring metric tonnes.',
    icon: Building
  },
  {
    id: 'FPO',
    title: 'FPO Co-op',
    desc: 'Consolidate smallholder farmers, manage warehouse stocks, and bid on contracts.',
    icon: Sprout
  },
  {
    id: 'Logistics Partner',
    title: 'Logistics Partner',
    desc: 'Transport agricultural produce with cold-chain telemetry and digital PoD.',
    icon: Truck
  }
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState('Consumer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register({
        name,
        email,
        phone,
        organization,
        city,
        state,
        role: selectedRole
      });
      navigate('/verify-email');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-agri-bright/30 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-dark to-agri-bright text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-agri-dark">
            Join AgriDirect AI Ecosystem
          </h1>
          <p className="text-xs text-gray-500">
            Step 1: Select your agricultural stakeholder role
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-agri-deep bg-agri-soft/80 ring-2 ring-agri-deep/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-agri-deep text-white' : 'bg-gray-100 text-gray-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-agri-deep" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">{r.title}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{r.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
          Note: Smallholder farmers participate directly through local FPO co-operatives.
        </div>

        {/* Form Details */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name / Representative</label>
              <input
                type="text"
                required
                placeholder="e.g. S. Ramanathan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-deep"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="ramanathan@greenvalley.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-deep"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mobile (WhatsApp for Mandi Alerts)</label>
              <input
                type="tel"
                required
                placeholder="+91 98401 22334"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {selectedRole === 'FPO' ? 'FPO Co-op Name' : selectedRole === 'Bulk Buyer' ? 'Company Name' : 'Town / District'}
              </label>
              <input
                type="text"
                required
                placeholder={selectedRole === 'FPO' ? 'Madurai GreenValley FPO' : 'Organization Name'}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">City / District</label>
              <input
                type="text"
                required
                placeholder="e.g. Madurai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Create {selectedRole} Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-1">
          Already registered?{' '}
          <Link to="/login" className="text-agri-deep font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
