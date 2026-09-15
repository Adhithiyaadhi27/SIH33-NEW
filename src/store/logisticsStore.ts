import { create } from 'zustand';
import { useOrderTrackingStore, type TrackedOrder, type TrackingEvent } from './orderTrackingStore';
import { useNotificationStore } from './notificationStore';
import { useFlashDealStore } from './flashDealStore';
import api from '../services/api';
import { mockProducts } from '../data/mockProducts';

export interface CorridorCapacity {
  id: string;
  from: string;
  to: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  vehicle: string;
  partner: string;
  transitHours: number;
  capacityKg: number;
  reservedKg: number;
  availableKg: number;
  utilizationPct: number;
  status: 'available' | 'low' | 'critical';
}

export interface RerouteProposal {
  id: string;
  depotId: string;
  depotName: string;
  city: string;
  productId: string;
  product: string;
  batchId: string;
  quantityKg: number;
  shelfLifeRemainingDays: number;
  wasteRisk: string;
  projectedLossInr: number;
  flashDiscountPct: number;
  originalPrice: number;
  discountedPrice: number;
  suggestedCorridorId: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  suggestedCorridor?: CorridorCapacity | null;
}

export interface RerouteAssignment {
  assignmentId: string;
  proposalId: string;
  orderId: string;
  product: string;
  productId: string;
  depot: string;
  quantityKg: number;
  from: string;
  to: string;
  vehicle: string;
  driverName: string;
  driverPhone: string;
  transitHours: number;
  status: string;
  acceptedAt: string;
  earnings: number;
}

const SEED_CORRIDORS: CorridorCapacity[] = [
  {
    id: 'cor_salem_chn', from: 'Salem', to: 'Chennai Cold Hub',
    fromLat: 11.6643, fromLng: 78.146, toLat: 13.0827, toLng: 80.2707,
    vehicle: '6-Ton Reefer Tata Ace', partner: 'Veloce Cold Chain',
    transitHours: 7, capacityKg: 4500, reservedKg: 0,
    availableKg: 4500, utilizationPct: 0, status: 'available',
  },
  {
    id: 'cor_cbe_chn', from: 'Coimbatore', to: 'Chennai Cold Hub',
    fromLat: 11.0168, fromLng: 76.9558, toLat: 13.0827, toLng: 80.2707,
    vehicle: '3-Ton Reefer Mahindra Supro', partner: 'SwiftKargo Refrigerated Express',
    transitHours: 9, capacityKg: 2600, reservedKg: 0,
    availableKg: 2600, utilizationPct: 0, status: 'available',
  },
  {
    id: 'cor_salem_mdu', from: 'Salem', to: 'Madurai Redistribution Hub',
    fromLat: 11.6643, fromLng: 78.146, toLat: 9.9252, toLng: 78.1198,
    vehicle: '5-Ton Reefer Eicher Pro 3005', partner: 'Tamil Nadu Agro Logistics Corp',
    transitHours: 4, capacityKg: 3800, reservedKg: 0,
    availableKg: 3800, utilizationPct: 0, status: 'available',
  },
  {
    id: 'cor_cbe_blr', from: 'Coimbatore', to: 'Bengaluru Fruit Terminal',
    fromLat: 11.0168, fromLng: 76.9558, toLat: 12.9716, toLng: 77.5946,
    vehicle: '12-Ton Reefer Ashok Leyland', partner: 'Sahyadri Logistics Digital Bus',
    transitHours: 6, capacityKg: 7200, reservedKg: 0,
    availableKg: 7200, utilizationPct: 0, status: 'available',
  },
];

const SEED_PROPOSALS: RerouteProposal[] = [
  {
    id: 'RRP-2026-001', depotId: 'DEP-SLM-01',
    depotName: 'Salem Secondary Depot', city: 'Salem',
    productId: 'prod_tomato', product: 'Tomato', batchId: 'AGR-2026-0980',
    quantityKg: 2000, shelfLifeRemainingDays: 2, wasteRisk: 'HIGH',
    projectedLossInr: 48000, flashDiscountPct: 25,
    originalPrice: 30, discountedPrice: 22.5,
    suggestedCorridorId: 'cor_salem_chn', status: 'PENDING', createdAt: '2026-09-10 08:00 AM',
    suggestedCorridor: null,
  },
  {
    id: 'RRP-2026-002', depotId: 'DEP-CBE-02',
    depotName: 'Coimbatore Packhouse', city: 'Coimbatore',
    productId: 'prod_beans', product: 'Green Beans', batchId: 'AGR-2026-1055',
    quantityKg: 450, shelfLifeRemainingDays: 1, wasteRisk: 'HIGH',
    projectedLossInr: 13500, flashDiscountPct: 30,
    originalPrice: 23.5, discountedPrice: 16.45,
    suggestedCorridorId: 'cor_cbe_chn', status: 'PENDING', createdAt: '2026-09-10 07:30 AM',
    suggestedCorridor: null,
  },
];

function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((i) => i.id === id);
}

function toTrackedOrder(assignment: RerouteAssignment, corridor: CorridorCapacity, proposal: RerouteProposal): TrackedOrder {
  const image = byId(mockProducts, proposal.productId)?.image ?? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
  const now = new Date();
  const fmt = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const today = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const events: TrackingEvent[] = [
    { time: `${today}, ${fmt(new Date(now.getTime() - 2 * 3600 * 1000))}`, location: `${proposal.depotName}, ${proposal.city}`, status: 'Re-route Confirmed', lat: corridor.fromLat, lng: corridor.fromLng },
    { time: `${today}, ${fmt(now)}`, location: `${proposal.depotName} → ${corridor.to} (${corridor.vehicle})`, status: 'Re-routed via Cold Chain', lat: corridor.fromLat, lng: corridor.fromLng },
    { time: `${today}, ETA ${fmt(new Date(now.getTime() + corridor.transitHours * 3600 * 1000))}`, location: corridor.to, status: 'Delivery Planned', lat: corridor.toLat, lng: corridor.toLng },
  ];
  return {
    id: assignment.orderId,
    productName: `${proposal.product} (${assignment.quantityKg} kg reroute)`,
    productImage: image,
    status: 'in_transit',
    currentLat: corridor.fromLat,
    currentLng: corridor.fromLng,
    destinationLat: corridor.toLat,
    destinationLng: corridor.toLng,
    driverName: assignment.driverName,
    driverPhone: assignment.driverPhone,
    vehicleNo: corridor.vehicle,
    eta: `~${corridor.transitHours} hrs`,
    total: assignment.earnings,
    orderDate: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    deliveryAddress: `${corridor.to}, via ${corridor.vehicle} cold chain`,
    paymentStatus: 'SYSTEM_REROUTE',
    userId: 'admin',
    items: [
      { productId: proposal.productId, name: proposal.product, quantity: proposal.quantityKg, unit: 'kg', price: proposal.discountedPrice, lineTotal: proposal.quantityKg * proposal.discountedPrice },
    ],
    events,
  };
}

interface LogisticsState {
  proposals: RerouteProposal[];
  corridors: CorridorCapacity[];
  assignments: RerouteAssignment[];
  loading: boolean;
  load: () => Promise<void>;
  acceptProposal: (proposalId: string) => Promise<boolean>;
}

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  proposals: SEED_PROPOSALS,
  corridors: SEED_CORRIDORS,
  assignments: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const [rr, cap] = await Promise.all([
        api.get('/logistics/reroutes'),
        api.get('/logistics/capacity'),
      ]);
      if (rr.data?.success && Array.isArray(rr.data.proposals)) {
        set({ proposals: rr.data.proposals });
      }
      if (cap.data?.success && Array.isArray(cap.data.corridors)) {
        set({ corridors: cap.data.corridors });
      }
    } catch {
      // keep seed data when the backend is offline
    } finally {
      set({ loading: false });
    }
  },

  acceptProposal: async (proposalId) => {
    const proposal = byId(get().proposals, proposalId);
    if (!proposal) return false;
    set({ loading: true });

    const corridor = byId(get().corridors, proposal.suggestedCorridorId);
    if (!corridor) return false;

    const finish = (assignment: RerouteAssignment) => {
      const updatedProposals = get().proposals.filter((p) => p.id !== proposalId);
      const updatedCorridors = get().corridors.map((c) =>
        c.id === corridor.id
          ? { ...c, reservedKg: c.reservedKg + proposal.quantityKg }
          : c
      );
      set({
        proposals: updatedProposals,
        corridors: updatedCorridors,
        assignments: [assignment, ...get().assignments],
        loading: false,
      });
      useFlashDealStore.getState().clearDeal(proposal.productId);
      useOrderTrackingStore.getState().addOrder(toTrackedOrder(assignment, corridor, proposal));
      useNotificationStore.getState().pushToast({
        title: '🚚 Re-route Dispatch Bound',
        message: `${assignment.quantityKg} kg ${proposal.product} from ${proposal.depotName} is in transit to ${corridor.to}.`,
        type: 'success',
      });
    };

    try {
      const res = await api.post(`/logistics/reroutes/${proposalId}/accept`);
      if (res.data?.success) {
        finish(res.data.assignment as RerouteAssignment);
        return true;
      }
      throw new Error(res.data?.error ?? 'Accept failed');
    } catch {
      // Offline demo fallback: bind a local dispatch mirroring the backend
      const id = `ORD-2026-RR${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const assignment: RerouteAssignment = {
        assignmentId: `LOG-ASG-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        proposalId: proposal.id,
        orderId: id,
        product: proposal.product,
        productId: proposal.productId,
        depot: proposal.depotName,
        quantityKg: proposal.quantityKg,
        from: corridor.from,
        to: corridor.to,
        vehicle: corridor.vehicle,
        driverName: 'G. Vinoth',
        driverPhone: '+91 90031 22114',
        transitHours: corridor.transitHours,
        status: 'IN_TRANSIT',
        acceptedAt: new Date().toLocaleString('en-IN'),
        earnings: Math.round(Math.max(500, proposal.quantityKg * 1.2)),
      };
      finish(assignment);
      return true;
    } finally {
      set({ loading: false });
    }
  },
}));

export function rerouteStatusColor(status: string): string {
  return status === 'available' ? 'bg-emerald-500/15 text-emerald-300' : status === 'low' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300';
}

export function corridorHeatColor(utilizationPct: number): string {
  if (utilizationPct >= 70) return 'bg-gradient-to-r from-red-500 to-orange-500';
  if (utilizationPct >= 40) return 'bg-gradient-to-r from-amber-400 to-soil-gold';
  return 'bg-gradient-to-r from-emerald-500 to-soil-leaf';
}