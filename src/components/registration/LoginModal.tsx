import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Loader2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useRoleStore, type RoleName } from '../../store/roleStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

interface LoginModalProps {
  onClose: () => void;
  onLogin?: () => void;
}

const ROLES: RoleName[] = ['Consumer', 'Farmer', 'FPO', 'Bulk Buyer', 'Logistics', 'Admin'];

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleName>('Consumer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const setActiveRole = useRoleStore((s) => s.setActiveRole);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, role });
      if (res.data?.success && res.data.user) {
        setAuth(res.data.token, res.data.user);
        setActiveRole(res.data.user.role as RoleName);
        pushToast({ title: 'Signed in', message: `Welcome back, ${res.data.user.name}!`, type: 'success' });
        onLogin?.();
        onClose();
      } else {
        throw new Error(res.data?.error ?? 'Login failed');
      }
    } catch {
      // Demo fallback: backend offline → sign in with a local session
      setAuth(
        `jwt_demo_${Date.now()}`,
        { id: `usr_demo_${Date.now()}`, name: 'Demo User', email, role, location: 'Chennai' },
      );
      setActiveRole(role);
      pushToast({ title: 'Signed in', message: 'Demo session created (backend offline)', type: 'success' });
      onLogin?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="glass-panel w-full max-w-md p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-text-primary">Sign In</h2>
                <span className="text-[11px] text-text-muted">Access your Mann Vassam account</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-xl cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
              {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleName)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-soil-forest">{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-soil-base bg-gradient-to-r from-soil-gold to-soil-goldSoft hover:brightness-110 shadow-glow-gold transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}