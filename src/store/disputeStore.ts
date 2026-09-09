import { create } from 'zustand';

export interface Dispute {
  id: string;
  orderId: string;
  productName: string;
  issueType: 'quality' | 'missing' | 'damaged' | 'wrong_item' | 'late_delivery';
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  refundAmount: number | null;
  createdAt: string;
  messages: Array<{ sender: 'buyer' | 'admin'; text: string; time: string }>;
}

interface DisputeState {
  disputes: Dispute[];
  createDispute: (dispute: Omit<Dispute, 'id' | 'status' | 'refundAmount' | 'createdAt' | 'messages'>) => string;
  addMessage: (id: string, sender: 'buyer' | 'admin', text: string) => void;
  resolveDispute: (id: string, refund: number) => void;
}

export const useDisputeStore = create<DisputeState>((set, get) => ({
  disputes: [
    {
      id: 'disp_1',
      orderId: 'ORD-2026-X1Y2',
      productName: 'Tomato (5kg)',
      issueType: 'quality',
      description: 'Received overripe tomatoes — about 40% were mushy and unusable.',
      status: 'resolved',
      refundAmount: 60,
      createdAt: '05 Sep 2026',
      messages: [
        { sender: 'buyer', text: 'I received damaged tomatoes. 40% are unusable.', time: '05 Sep, 10:30 AM' },
        { sender: 'admin', text: 'We apologize. A partial refund of ₹60 has been initiated.', time: '05 Sep, 02:15 PM' },
      ],
    },
  ],
  createDispute: (dispute) => {
    const id = `disp_${Date.now()}`;
    set((state) => ({
      disputes: [
        {
          ...dispute,
          id,
          status: 'open',
          refundAmount: null,
          createdAt: new Date().toLocaleDateString('en-IN'),
          messages: [{ sender: 'buyer', text: dispute.description, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }],
        },
        ...state.disputes,
      ],
    }));
    return id;
  },
  addMessage: (id, sender, text) =>
    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === id
          ? {
              ...d,
              messages: [
                ...d.messages,
                { sender, text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
              ],
            }
          : d,
      ),
    })),
  resolveDispute: (id, refund) =>
    set((state) => ({
      disputes: state.disputes.map((d) => (d.id === id ? { ...d, status: 'resolved', refundAmount: refund } : d)),
    })),
}));
