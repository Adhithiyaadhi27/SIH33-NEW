export interface DeliverySlot {
  id: string;
  label: string;
  timeRange: string;
  available: boolean;
  surcharge: number;
}

export interface DeliveryDate {
  id: string;
  label: string;
  date: string;
  available: boolean;
}

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'morning', label: 'Morning', timeRange: '7:00 AM – 10:00 AM', available: true, surcharge: 0 },
  { id: 'midday', label: 'Mid-Day', timeRange: '11:00 AM – 2:00 PM', available: true, surcharge: 0 },
  { id: 'afternoon', label: 'Afternoon', timeRange: '3:00 PM – 6:00 PM', available: true, surcharge: 10 },
  { id: 'evening', label: 'Evening', timeRange: '7:00 PM – 9:00 PM', available: false, surcharge: 15 },
];

function formatDay(date: Date): string {
  return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

// Delivery windows roll forward from the current date so the demo never
// shows stale dates.
export function buildDeliveryDates(): DeliveryDate[] {
  const base = new Date();
  const day = (offset: number) => {
    const d = new Date(base);
    d.setDate(base.getDate() + offset);
    return d;
  };
  const fourthLabel = day(3).toLocaleDateString([], { weekday: 'long' });
  return [
    { id: 'today', label: 'Today', date: formatDay(day(0)), available: true },
    { id: 'tomorrow', label: 'Tomorrow', date: formatDay(day(1)), available: true },
    { id: 'day3', label: 'Day After', date: formatDay(day(2)), available: true },
    { id: 'day4', label: fourthLabel, date: formatDay(day(3)), available: false },
  ];
}