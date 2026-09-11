import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/primitives';
import { useRoleStore, type RoleName } from '../../store/roleStore';
import useTranslation from '../../services/useTranslation';

const roles: RoleName[] = ['FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'];

const roleLabelKey: Record<RoleName, string> = {
  FPO: 'navbar.fpo',
  Consumer: 'navbar.consumer',
  'Bulk Buyer': 'navbar.bulk_buyer',
  Logistics: 'navbar.logistics',
  Admin: 'navbar.admin',
};

const roleIcons: Record<string, string> = {
  FPO: '🤝',
  Consumer: '🛒',
  'Bulk Buyer': '📦',
  Logistics: '🚚',
  Admin: '🛡️',
};

const roleRoute: Record<RoleName, string> = {
  FPO: '/fpo',
  Consumer: '/consumer',
  'Bulk Buyer': '/bulk-buyer',
  Logistics: '/logistics',
  Admin: '/admin',
};

export default function RoleSwitcher() {
  const { t } = useTranslation();
  const { activeRole, setActiveRole } = useRoleStore();
  const navigate = useNavigate();

  const handleSelect = (role: RoleName) => {
    setActiveRole(role);
    navigate(roleRoute[role]);
  };

  return (
    <GlassCard className="p-4 sm:p-5 space-y-3">
      <div>
        <h2 className="font-display font-extrabold text-base text-text-primary">
          {t('role.switcher_title')}
        </h2>
        <p className="text-[11px] text-text-muted">{t('role.switcher_subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {roles.map((role, idx) => {
          const active = activeRole === role;
          const isLastOdd = idx === roles.length - 1 && roles.length % 2 !== 0;
          return (
            <motion.button
              key={role}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(role)}
              className={`p-2.5 rounded-xl text-left transition cursor-pointer flex items-center gap-2 border ${
                isLastOdd ? 'col-span-2' : ''
              } ${
                active
                  ? 'bg-soil-gold/15 border-soil-gold shadow-glow-gold'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{roleIcons[role]}</span>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold truncate ${active ? 'text-soil-gold' : 'text-text-primary'}`}>
                  {t(roleLabelKey[role])}
                </div>
                <div className="text-[9px] text-text-muted truncate">
                  {active ? `● ${t('role.active_cockpit')}` : t('role.switch_view')}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="glass-panel-sm p-2.5 text-[11px] text-text-muted text-center">
        <span className="text-soil-gold font-bold">{t('role.select', { role: t(roleLabelKey[activeRole]) })}</span>
      </div>
    </GlassCard>
  );
}