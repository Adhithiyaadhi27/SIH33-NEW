import { GlassCard, FadeIn, GlassButton } from '../components/ui/primitives';
import { useNotificationStore } from '../store/notificationStore';
import { Bell, Shield, Globe, CreditCard, HelpCircle } from 'lucide-react';

const sections = [
  { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
  { id: 'security', label: 'Security & Verification', icon: Shield },
  { id: 'region', label: 'Region & Language', icon: Globe },
  { id: 'payments', label: 'Payments & Settlement', icon: CreditCard },
  { id: 'support', label: 'Support & Help', icon: HelpCircle },
];

export default function SettingsPage() {
  const pushToast = useNotificationStore((s) => s.pushToast);

  return (
    <div className="bg-agri-forest min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-5">
        <FadeIn>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">System Settings</h1>
          <p className="text-sm text-text-muted">Platform preferences for your MANN VASSAM account.</p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <GlassCard className="p-5 sm:p-6 space-y-5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-soil-gold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">{s.label}</div>
                      <div className="text-[11px] text-text-muted">Manage your {s.label.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" id={s.id} defaultChecked />
                    <label
                      htmlFor={s.id}
                      className="w-11 h-6 rounded-full bg-white/15 cursor-pointer peer-checked:bg-soil-emerald transition block after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-3 flex justify-end">
              <GlassButton
                variant="green"
                onClick={() =>
                  pushToast({
                    title: 'Settings Saved',
                    message: 'Your preferences have been updated.',
                    type: 'success',
                  })
                }
              >
                Save Preferences
              </GlassButton>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}