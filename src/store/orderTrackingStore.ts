import { create } from 'zustand';

export interface TrackingEvent {
  time: string;
  location: string;
  status: string;
  lat: number;
  lng: number;
}

export interface TrackedOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  lineTotal: number;
}

export interface TrackedOrder {
  id: string;
  productName: string;
  productImage: string;
  status: 'confirmed' | 'processing' | 'dispatched' | 'in_transit' | 'delivered';
  currentLat: number;
  currentLng: number;
  destinationLat: number;
  destinationLng: number;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  eta: string;
  total: number;
  orderDate: string;
  deliveryAddress: string;
  paymentStatus: string;
  paymentMethod?: string;
  userId?: string;
  items?: TrackedOrderItem[];
  events: TrackingEvent[];
}

const MOCK_ORDERS: TrackedOrder[] = [
  {
    id: 'ORD-2026-A1B2',
    productName: 'Tomato (10kg)',
    productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    status: 'in_transit',
    currentLat: 13.05,
    currentLng: 80.22,
    destinationLat: 13.0827,
    destinationLng: 80.2707,
    driverName: 'Ravi Kumar',
    driverPhone: '+91 98765 43210',
    vehicleNo: 'TN-01-AB-1234',
    eta: '45 min',
    total: 325.0,
    orderDate: '09 Sep 2026',
    deliveryAddress: '42, Velachery Main Road, Chennai — 600042',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    items: [
      { productId: 'prod_tomato', name: 'Tomato', quantity: 10, unit: 'kg', price: 30, lineTotal: 300 },
    ],
    events: [
      { time: '09 Sep, 06:00 AM', location: 'GreenValley FPO, Madurai', status: 'Order Confirmed', lat: 9.9252, lng: 78.1198 },
      { time: '09 Sep, 08:30 AM', location: 'Cold Storage Hub, Madurai', status: 'Picked & Packed', lat: 9.93, lng: 78.12 },
      { time: '09 Sep, 10:15 AM', location: 'Chennai Highway Route 45', status: 'In Transit', lat: 13.05, lng: 80.22 },
    ],
  },
  {
    id: 'ORD-2026-C3D4',
    productName: 'Apple (5kg)',
    productImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    status: 'dispatched',
    currentLat: 31.1,
    currentLng: 77.17,
    destinationLat: 13.0827,
    destinationLng: 80.2707,
    driverName: 'Manoj Singh',
    driverPhone: '+91 87654 32109',
    vehicleNo: 'HP-07-CD-5678',
    eta: '2 days',
    total: 750.0,
    orderDate: '08 Sep 2026',
    deliveryAddress: '18, Anna Nagar, Chennai — 600040',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    items: [
      { productId: 'prod_apple', name: 'Apple', quantity: 5, unit: 'kg', price: 145, lineTotal: 725 },
    ],
    events: [
      { time: '08 Sep, 04:00 PM', location: 'Himachal Collective, Kinnaur', status: 'Order Confirmed', lat: 31.58, lng: 78.47 },
      { time: '09 Sep, 06:00 AM', location: 'Regional Cold Hub, Shimla', status: 'Dispatched', lat: 31.1, lng: 77.17 },
    ],
  },
];

interface OrderTrackingState {
  orders: TrackedOrder[];
  getOrder: (id: string) => TrackedOrder | undefined;
  addOrder: (order: TrackedOrder) => void;
  updateStatus: (id: string, status: TrackedOrder['status']) => void;
}

export const useOrderTrackingStore = create<OrderTrackingState>((set, get) => ({
  orders: MOCK_ORDERS,
  getOrder: (id) => get().orders.find((o) => o.id === id),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));

/**
 * Minimal shape of MockOrder / farmer order record sufficient for bridging
 * into a TrackedOrder. Keeps the tracking store decoupled from the data layer.
 */
export interface MockOrderLike {
  id: string;
  product: string;
  quantityKg: number;
  from: string;
  to: string;
  status: string;
  eta: string;
}

const STATUS_MAP: Record<string, TrackedOrder['status']> = {
  PENDING: 'confirmed',
  AGGREGATING: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';

export function mockToTrackedOrder(m: MockOrderLike): TrackedOrder {
  const now = new Date();
  return {
    id: m.id,
    productName: `${m.product} (${m.quantityKg} kg)`,
    productImage: DEFAULT_IMAGE,
    status: STATUS_MAP[m.status] ?? 'confirmed',
    currentLat: 13.0,
    currentLng: 80.0,
    destinationLat: 13.0827,
    destinationLng: 80.2707,
    driverName: '—',
    driverPhone: '—',
    vehicleNo: '—',
    eta: m.eta,
    total: 0,
    orderDate: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    deliveryAddress: m.to,
    paymentStatus: m.status === 'DELIVERED' ? 'PAID' : 'PENDING',
    items: [
      { productId: '', name: m.product, quantity: m.quantityKg, unit: 'kg', price: 0, lineTotal: 0 },
    ],
    events: [
      { time: m.eta, location: `${m.from} → ${m.to}`, status: m.status, lat: 13.0, lng: 80.0 },
    ],
  };
}
