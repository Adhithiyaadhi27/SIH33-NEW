import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/primitives';
import { useRoleStore, type RoleName } from '../../store/roleStore';

const roles: RoleName[] = ['Farmer', 'FPO', 'Consumer', 'Bulk Buyer', 'Admin'];

const roleIcons: Record<string, string> = {
  Farmer: '🚜',
  FPO: '🤝',
  Consumer: '🛒',
  'Bulk Buyer': '📦',
  Admin: '🛡️',
  Logistics: '🚚',
};

const roleRoute: Record<RoleName, string> = {
  Farmer: '/farmer',
  FPO: '/fpo',
  Consumer: '/consumer',
  'Bulk Buyer': '/bulk-buyer',
  Admin: '/admin',
  Logistics: '/logistics',
};

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useRoleStore();
  const navigate = useNavigate();

  const handleSelect = (role: RoleName) => {
    setActiveRole(role);
    navigate(roleRoute[role]);
  };

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-display font-extrabold text-lg text-text-primary">
          Floating Interactive Panels
        </h2>
        <p className="text-xs text-text-muted mt-0.5">Switch between Role Cockpits</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {roles.map((role) => {
          const active = activeRole === role;
          return (
            <motion.button
              key={role}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(role)}
              className={`p-3.5 rounded-2xl text-left transition cursor-pointer flex items-center gap-2.5 border ${
                active
                  ? 'bg-soil-gold/15 border-soil-gold shadow-glow-gold'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{roleIcons[role]}</span>
              <div>
                <div className={`text-sm font-bold ${active ? 'text-soil-gold' : 'text-text-primary'}`}>
                  {role}
                </div>
                <div className="text-[10px] text-text-muted">
                  {active ? '● Active cockpit' : 'Switch view'}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="glass-panel-sm p-3.5 text-xs text-text-muted">
        <span className="text-soil-gold font-bold">Role: {activeRole}</span> — select a role to open
        its dedicated cockpit dashboard.
      </div>
    </GlassCard>
  );
}