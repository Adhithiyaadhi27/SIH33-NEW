import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, availablePersonas, switchRolePersona } = useAuth();
  const [email, setEmail] = useState('priya@example.com');
  const [password, setPassword] = useState('password123');
  const [roleHint, setRoleHint] = useState('Consumer');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password, roleHint);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleQuickPersona = (persona) => {
    switchRolePersona(persona.role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-agri-bright/30 p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-dark to-agri-bright text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-agri-dark">
            Login to AgriDirect AI
          </h1>
          <p className="text-xs text-gray-500">
            Select your role-based persona or enter credentials
          </p>
        </div>

        {/* Quick Demo Evaluation Persona Selector */}
        <div className="p-3.5 bg-agri-soft/80 rounded-2xl border border-agri-bright/30 space-y-2 text-xs">
          <div className="flex items-center justify-between text-agri-dark font-bold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-agri-harvest" /> One-Click Demo Personas:
            </span>
            <span className="text-[10px] text-gray-400">Click to instantly log in</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availablePersonas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickPersona(p)}
                className="p-2 bg-white hover:bg-agri-pale rounded-xl border border-gray-200 text-left transition cursor-pointer"
              >
                <div className="font-bold text-gray-900 truncate">{p.name.split('(')[0]}</div>
                <div className="text-[10px] text-agri-deep font-semibold">{p.role}</div>
              </button>
            ))}
          </div>
          <div className="text-[10px] text-gray-500 pt-1 text-center">
            Farmer operations are aggregated under FPO.
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-deep"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-deep"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-agri-deep" />
              <span>Remember me</span>
            </label>
            <Link to="/password-reset" className="text-agri-deep font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          New to AgriDirect?{' '}
          <Link to="/register" className="text-agri-deep font-bold hover:underline">
            Register your Role
          </Link>
        </div>
      </div>
    </div>
  );
}
