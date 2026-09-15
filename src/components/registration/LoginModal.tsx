import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Loader2, Shield, Tractor, ShoppingCart } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useRoleStore, type RoleName } from '../../store/roleStore';
import { useAuthStore, DEMO_USERS } from '../../store/authStore';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
  onLogin?: () => void;
}

const DEMO_CONFIG = [
  { role: 'ADMIN' as RoleName, label: 'Admin', icon: Shield, email: 'admin@maanvasam.com', password: 'Admin@123', color: 'from-red-500 to-orange-400' },
  { role: 'FARMER' as RoleName, label: 'Farmer', icon: Tractor, email: 'farmer@maanvasam.com', password: 'Farmer@123', color: 'from-soil-emerald to-soil-leaf' },
  { role: 'CONSUMER' as RoleName, label: 'Consumer', icon: ShoppingCart, email: 'consumer@maanvasam.com', password: 'Consumer@123', color: 'from-blue-500 to-cyan-400' },
];

const ROLE_ROUTES: Record<RoleName, string> = {
  ADMIN: '/admin',
  FARMER: '/farmer',
  CONSUMER: '/consumer',
};

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const setActiveRole = useRoleStore((s) => s.setActiveRole);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const doLogin = async (demoUser: typeof DEMO_USERS[0]) => {
    const now = new Date().getTime();
    let token = `jwt_demo_${now}`;
    const user = { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role, location: demoUser.location };
    try {
      const res = await api.post('/auth/login', { email: demoUser.email, password: demoUser.password });
      if (res.data?.success && res.data.token) {
        token = res.data.token;
      }
    } catch {
      /* offline — keep demo token */
    }
    setAuth(token, user);
    setActiveRole(demoUser.role as RoleName);
    pushToast({ title: 'Signed in', message: `Welcome, ${demoUser.name}!`, type: 'success' });
    onLogin?.();
    onClose();
    navigate(ROLE_ROUTES[demoUser.role as RoleName] || '/');
  };

  const handleDemoLogin = (role: RoleName) => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) doLogin(demo);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email || !password) {
      setError('Enter email and password');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data.user) {
        setAuth(res.data.token, res.data.user);
        setActiveRole(res.data.user.role as RoleName);
        pushToast({ title: 'Signed in', message: `Welcome back, ${res.data.user.name}!`, type: 'success' });
        onLogin?.();
        onClose();
        navigate(ROLE_ROUTES[res.data.user.role as RoleName] || '/');
      } else {
        throw new Error(res.data?.error ?? 'Login failed');
      }
    } catch {
      const demo = DEMO_USERS.find((u) => u.email === email && u.password === password);
      if (demo) {
        await doLogin(demo);
      } else {
        setError('Invalid credentials. Try a demo account below.');
      }
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
                <span className="text-[11px] text-text-muted">Access your Maanvasam account</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-xl cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* One-Click Demo Login */}
          <div className="space-y-2 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-soil-gold mb-2">Quick Demo Login</div>
            {DEMO_CONFIG.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.role}
                  onClick={() => handleDemoLogin(d.role)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/15 hover:border-soil-gold/40 hover:bg-white/10 transition cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${d.color} flex items-center justify-center text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-xs font-bold text-text-primary">Sign In as {d.label}</div>
                    <div className="text-[10px] text-text-muted">{d.email}</div>
                  </div>
                  <span className="text-[10px] font-bold text-soil-gold opacity-0 group-hover:opacity-100 transition">→</span>
                </button>
              );
            })}
          </div>

          <div className="glass-divider my-4" />

          {/* Manual Login */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Or sign in manually</div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
            </div>
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <div className="flex items-center justify-end gap-3 pt-1">
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
