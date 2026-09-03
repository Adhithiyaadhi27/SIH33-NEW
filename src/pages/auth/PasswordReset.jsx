import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-agri-bright/30 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-agri-pale text-agri-deep flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-agri-dark">
            Password Recovery
          </h1>
          <p className="text-xs text-gray-500">
            Enter your registered email to receive a secure password reset link
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Reset Link Dispatched</h3>
            <p className="text-xs text-gray-600">
              We have dispatched a reset link to <strong className="text-gray-800">{email}</strong>. It will remain active for 15 minutes.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-xs font-bold text-agri-deep hover:underline"
            >
              &larr; Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-deep"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl shadow transition cursor-pointer"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-gray-500 hover:text-agri-dark">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
