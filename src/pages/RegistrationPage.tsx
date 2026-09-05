import { useState } from 'react';
import RegistrationModal from '../components/registration/RegistrationModal';
import { GlassCard, FadeIn } from '../components/ui/primitives';
import { UserPlus } from 'lucide-react';

export default function RegistrationPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-agri-forest min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-5">
        <FadeIn>
          <GlobalRegistration
            onClick={() => setShowModal(true)}
          />
        </FadeIn>
      </div>
      {showModal && <RegistrationModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function GlobalRegistration({ onClick }: { onClick: () => void }) {
  return (
    <GlassCard className="p-8 sm:p-12 text-center space-y-4">
      <div className="flex justify-center text-soil-gold">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-soil-emerald to-soil-leaf flex items-center justify-center text-white shadow-glow-emerald">
          <UserPlus className="w-7 h-7" />
        </div>
      </div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
        Dynamic Role Registration
      </h1>
      <p className="text-sm text-text-muted max-w-md mx-auto">
        Register as a Farmer, FPO, Consumer, Bulk Buyer, Logistics Partner or Admin. Your request
        will be routed to the relevant verification flow.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {['Farmer', 'FPO', 'Consumer', 'Bulk Buyer', 'Logistics', 'Admin'].map((r) => (
          <span key={r} className="bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] font-bold text-text-secondary">
            {r}
          </span>
        ))}
      </div>
      <div className="pt-3">
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-soil-emerald to-soil-leaf text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-glow-emerald hover:brightness-110 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Open Registration Form
        </button>
      </div>
    </GlassCard>
  );
}