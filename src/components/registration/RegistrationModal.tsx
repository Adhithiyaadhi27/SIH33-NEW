import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useRoleStore, type RoleName } from '../../store/roleStore';

interface RegistrationModalProps {
  onClose: () => void;
}

const ROLES: RoleName[] = ['Farmer', 'FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'Farmer' as RoleName,
  location: '',
  organization: '',
};

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pushToast = useNotificationStore((s) => s.pushToast);
  const setActiveRole = useRoleStore((s) => s.setActiveRole);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone)) e.phone = 'Valid phone required';
    if (!form.location.trim()) e.location = 'Location required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setActiveRole(form.role);
    pushToast({
      title: 'Registration Request Received',
      message: 'Registration request submitted successfully.',
      type: 'success',
    });
    onClose();
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
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-text-primary">Role Registration</h2>
                <span className="text-[11px] text-text-muted">Custom modal handler</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-xl cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. R. Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 98... "
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                />
                {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-soil-forest">{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Location</label>
              <input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Madurai, Tamil Nadu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
              {errors.location && <p className="text-[11px] text-red-400 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Organization / Farm Name</label>
              <input
                value={form.organization}
                onChange={(e) => update('organization', e.target.value)}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
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
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-soil-base bg-gradient-to-r from-soil-gold to-soil-goldSoft hover:brightness-110 shadow-glow-gold transition cursor-pointer"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
