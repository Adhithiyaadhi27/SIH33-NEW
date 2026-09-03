import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const { currentUser, emailVerified, setEmailVerified } = useAuth();
  const navigate = useNavigate();
  const [resendStatus, setResendStatus] = useState(false);
  const [simulatedState, setSimulatedState] = useState('pending'); // 'pending', 'success', 'failed'

  const handleResend = () => {
    setResendStatus(true);
    setTimeout(() => setResendStatus(false), 3000);
  };

  const simulateSuccess = () => {
    setSimulatedState('success');
    setEmailVerified(true);
  };

  const simulateFailure = () => {
    setSimulatedState('failed');
    setEmailVerified(false);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-agri-bright/30 p-8 shadow-2xl text-center space-y-6">
        {simulatedState === 'pending' && (
          <>
            <div className="w-16 h-16 bg-agri-pale rounded-2xl text-agri-deep flex items-center justify-center mx-auto shadow-inner">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display font-bold text-2xl text-agri-dark">
                Verify Your Email Address
              </h2>
              <p className="text-xs text-gray-500">
                We've sent a verification link to <strong className="text-gray-800">{currentUser?.email || 'your email'}</strong> via Firebase Authentication.
              </p>
            </div>

            <div className="p-3.5 bg-agri-soft/70 border border-agri-bright/20 rounded-2xl text-xs text-gray-600 text-left space-y-1">
              <p>&bull; Check your inbox and spam folders.</p>
              <p>&bull; Click the link to activate your role permissions.</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleResend}
                className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-2.5 rounded-xl text-xs shadow transition cursor-pointer"
              >
                {resendStatus ? 'Verification Email Resent!' : 'Resend Verification Email'}
              </button>

              {/* Demo Simulation Controls */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-3 text-xs">
                <button
                  onClick={simulateSuccess}
                  className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  Simulate Success &rarr;
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={simulateFailure}
                  className="text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Simulate Expired Link &rarr;
                </button>
              </div>
            </div>
          </>
        )}

        {simulatedState === 'success' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-agri-dark">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-gray-600">
              Your {currentUser?.role || 'User'} account is activated. You now have full access to the agricultural marketplace and logistics intelligence.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-3 rounded-xl text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to {currentUser?.role} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {simulatedState === 'failed' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-rose-900">
              Verification Link Expired
            </h2>
            <p className="text-xs text-gray-600">
              The verification token has expired or is invalid. Please request a new verification email to proceed.
            </p>
            <button
              onClick={() => setSimulatedState('pending')}
              className="w-full bg-agri-deep hover:bg-agri-dark text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Request New Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
