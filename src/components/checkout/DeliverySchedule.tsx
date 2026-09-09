import { Clock, CalendarDays, Check } from 'lucide-react';

export interface DeliverySlot {
  id: string;
  label: string;
  timeRange: string;
  available: boolean;
  surcharge: number;
}

const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'morning', label: 'Morning', timeRange: '7:00 AM – 10:00 AM', available: true, surcharge: 0 },
  { id: 'midday', label: 'Mid-Day', timeRange: '11:00 AM – 2:00 PM', available: true, surcharge: 0 },
  { id: 'afternoon', label: 'Afternoon', timeRange: '3:00 PM – 6:00 PM', available: true, surcharge: 10 },
  { id: 'evening', label: 'Evening', timeRange: '7:00 PM – 9:00 PM', available: false, surcharge: 15 },
];

const DELIVERY_DATES = [
  { id: 'today', label: 'Today', date: '09 Sep', available: true },
  { id: 'tomorrow', label: 'Tomorrow', date: '10 Sep', available: true },
  { id: 'day3', label: 'Day After', date: '11 Sep', available: true },
  { id: 'day4', label: 'Thursday', date: '12 Sep', available: false },
];

interface DeliveryScheduleProps {
  selectedSlot: string | null;
  selectedDate: string | null;
  onSelectSlot: (slotId: string) => void;
  onSelectDate: (dateId: string) => void;
}

export default function DeliverySchedule({ selectedSlot, selectedDate, onSelectSlot, onSelectDate }: DeliveryScheduleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <CalendarDays className="w-3.5 h-3.5 text-soil-gold" />
        <span className="text-[10px] font-bold text-soil-gold uppercase tracking-wide">Delivery Date</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {DELIVERY_DATES.map((d) => (
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
