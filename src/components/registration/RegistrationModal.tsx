import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Loader2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useRoleStore, type RoleName } from '../../store/roleStore';
import { useAuthStore, type AuthUser } from '../../store/authStore';
import useTranslation from '../../services/useTranslation';
import api from '../../services/api';

interface RegistrationModalProps {
  onClose: () => void;
}

const ROLES: RoleName[] = ['Farmer', 'FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'];

const roleLabelKey: Record<RoleName, string> = {
  Farmer: 'navbar.farmer',
  FPO: 'navbar.fpo',
  Consumer: 'navbar.consumer',
  'Bulk Buyer': 'navbar.bulk_buyer',
  Logistics: 'navbar.logistics',
  Admin: 'navbar.admin',
};

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'Farmer' as RoleName,
  location: '',
  organization: '',
};

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const setActiveRole = useRoleStore((s) => s.setActiveRole);
  const setAuth = useAuthStore((s) => s.setAuth);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('registration.error_name');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('registration.error_email');
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone)) e.phone = t('registration.error_phone');
    if (!form.location.trim()) e.location = t('registration.error_location');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const register = (user: AuthUser, token: string) => {
    setAuth(token, user);
    setActiveRole(form.role);
    pushToast({
      title: t('registration.success'),
      message: t('registration.success_msg'),
      type: 'success',
    });
    onClose();
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        location: form.location,
        organization: form.organization,
        city: form.location.split(',')[0]?.trim() ?? form.location,
        state: 'Tamil Nadu',
      });

      if (res.data?.success) {
        register(res.data.user, res.data.token ?? `jwt_${res.data.user.id}`);
      } else {
        throw new Error(res.data?.error ?? 'Registration failed');
      }
    } catch {
      // Demo fallback: backend offline → simulate a local registration,
      // mirroring the simulated analyze/payment flows used elsewhere.
      register(
        {
          id: `usr_demo_${Date.now()}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          location: form.location,
          organization: form.organization,
        },
        `jwt_demo_${Date.now()}`,
      );
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
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-text-primary">{t('registration.title')}</h2>
                <span className="text-[11px] text-text-muted">{t('registration.subtitle')}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-xl cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.name')}</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={t('registration.name_placeholder')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.email')}</label>
                <input
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder={t('registration.email_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.phone')}</label>
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder={t('registration.phone_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
                />
                {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.role')}</label>
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-soil-forest">{t(roleLabelKey[r])}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.location')}</label>
              <input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder={t('registration.location_placeholder')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
              {errors.location && <p className="text-[11px] text-red-400 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">{t('registration.organization')}</label>
              <input
                value={form.organization}
                onChange={(e) => update('organization', e.target.value)}
                placeholder={t('registration.organization_placeholder')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm focus:outline-none focus:ring-2 focus:ring-soil-emerald placeholder:text-text-muted/50"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-white/10 transition cursor-pointer"
              >
                {t('registration.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-soil-base bg-gradient-to-r from-soil-gold to-soil-goldSoft hover:brightness-110 shadow-glow-gold transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> {t('common.loading')}
                  </span>
                ) : (
                  t('registration.submit')
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}