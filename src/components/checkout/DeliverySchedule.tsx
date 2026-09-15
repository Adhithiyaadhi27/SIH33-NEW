import { Clock, CalendarDays, Check } from 'lucide-react';
import { DELIVERY_SLOTS, buildDeliveryDates } from '../../data/deliverySchedule';

interface DeliveryScheduleProps {
  selectedSlot: string | null;
  selectedDate: string | null;
  onSelectSlot: (slotId: string) => void;
  onSelectDate: (dateId: string) => void;
}

export default function DeliverySchedule({ selectedSlot, selectedDate, onSelectSlot, onSelectDate }: DeliveryScheduleProps) {
  const deliveryDates = buildDeliveryDates();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5 text-soil-gold" />
        <span className="text-[10px] font-bold text-soil-gold uppercase tracking-wide">Delivery Date</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {deliveryDates.map((d) => (
          <button
            key={d.id}
            onClick={() => d.available && onSelectDate(d.id)}
            disabled={!d.available}
            className={`px-3 py-2 rounded-xl text-[10px] font-bold transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              selectedDate === d.id
                ? 'bg-soil-emerald/40 text-emerald-300 border border-emerald-400/40'
                : 'bg-white/5 text-text-muted border border-white/10 hover:bg-white/10'
            }`}
          >
            <div>{d.label}</div>
            <div className="text-[8px] opacity-70">{d.date}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <Clock className="w-3.5 h-3.5 text-soil-gold" />
        <span className="text-[10px] font-bold text-soil-gold uppercase tracking-wide">Time Slot</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DELIVERY_SLOTS.map((s) => (
          <button
            key={s.id}
            onClick={() => s.available && onSelectSlot(s.id)}
            disabled={!s.available}
            className={`text-left p-2.5 rounded-xl transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              selectedSlot === s.id
                ? 'bg-soil-emerald/40 border border-emerald-400/40'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-primary">{s.label}</span>
              {selectedSlot === s.id && <Check className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-[9px] text-text-muted">{s.timeRange}</div>
            {s.surcharge > 0 && (
              <div className="text-[8px] text-soil-gold mt-0.5">+₹{s.surcharge} surcharge</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
