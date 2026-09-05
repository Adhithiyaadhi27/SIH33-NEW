import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { GlassCard, GlassBadge } from '../ui/primitives';
import { ShieldCheck, Calendar, MapPin, Truck } from 'lucide-react';

const passport = {
  traceId: 'TRB2023001',
  lot: 'Tomato Lot',
  verified: true,
  harvest: 'Tomato',
  date: '23-Jul → 09-Sep 2023',
  timeline: [
    { step: 'Harvest lot', active: true },
    { step: 'Transit', active: true },
    { step: 'Delivery', active: false },
  ],
  chainOfCustody: ['Farmer', 'FPO', 'Logistics', 'Buyer'],
};

export default function ProducePassport() {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(`https://mannvassam.example/passport/${passport.traceId}`, { width: 160, margin: 1, color: { dark: '#EAF6EE', light: '#0B2B1E' } })
      .then(setQr)
      .catch(() => setQr(null));
  }, []);

  return (
    <GlassCard className="p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-display font-extrabold text-lg text-text-primary">
          Digital Farm Produce Passport
        </h2>
        <p className="text-xs text-text-muted mt-0.5">Verifiable batch identity for a tomato lot</p>
      </div>

      {/* Identity row */}
      <div className="flex items-center gap-4 glass-panel-sm p-3.5">
        <img
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80"
          alt="Tomato lot"
          className="w-16 h-16 rounded-xl object-cover border border-white/20"
        />
        <div className="flex-1 min-w-0">
          <GlassBadge gold={passport.verified}>
            <ShieldCheck className="w-3 h-3" />
            {passport.verified ? 'Verified' : 'Verifiable'}
          </GlassBadge>
          <div className="font-mono text-xs font-bold text-soil-gold mt-2">
            TRACE ID: {passport.traceId}
          </div>
          <div className="text-[11px] text-text-muted">{passport.lot}</div>
        </div>
        {qr && <img src={qr} alt="QR code" className="w-16 h-16 rounded-lg border border-white/20 bg-soil-deep" />}
      </div>

      {/* Harvest meta */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="glass-panel-sm p-2.5 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-soil-gold" />
          <div>
            <div className="text-[10px] text-text-muted">Harvest</div>
            <div className="font-bold text-text-primary">{passport.harvest}</div>
          </div>
        </div>
        <div className="glass-panel-sm p-2.5 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-soil-mint" />
          <div>
            <div className="text-[10px] text-text-muted">Date</div>
            <div className="font-bold text-text-primary">{passport.date}</div>
          </div>
        </div>
      </div>

      {/* Harvest Details timeline */}
      <div>
        <div className="text-xs font-bold text-text-primary mb-2">Harvest Details</div>
        <div className="flex items-center">
          {passport.timeline.map((t, i) => (
            <div key={t.step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${t.active ? 'bg-soil-gold glow' : 'bg-white/20'}`} />
                <span className="text-[9px] mt-1 text-text-muted">{t.active ? '●' : '○'}</span>
              </div>
              <div className={`h-0.5 flex-1 ${t.active ? 'bg-soil-gold/50' : 'bg-white/10'}`} />
              {i === passport.timeline.length - 1 && (
                <div className={`w-3 h-3 rounded-full ${t.active ? 'bg-soil-gold' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-semibold text-text-muted mt-1">
          {passport.timeline.map((t) => (
            <span key={t.step}>{t.step}</span>
          ))}
        </div>
      </div>

      {/* Chain-of-Custody */}
      <div className="glass-panel-sm p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
          <Truck className="w-3.5 h-3.5 text-soil-mint" /> Chain-of-Custody
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {passport.chainOfCustody.map((c, i) => (
            <div key={c} className="flex items-center gap-1.5">
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-text-secondary border border-white/10">
                {c}
              </span>
              {i < passport.chainOfCustody.length - 1 && <span className="text-soil-gold text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}