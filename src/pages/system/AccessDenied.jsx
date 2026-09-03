import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccessDenied() {
  const { role } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-rose-200 p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Access Denied
          </h1>
          <p className="text-sm font-semibold text-rose-600">
            You don't have permission to access this page.
          </p>
          <p className="text-xs text-gray-500">
            Your current logged-in role is <strong className="text-gray-800">{role}</strong>. This section is restricted by server-side Role-Based Access Control (RBAC).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto bg-agri-deep hover:bg-agri-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
