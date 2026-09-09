import { create } from 'zustand';

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: number;
  price?: number;
}

export interface Negotiation {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  requestedQty: number;
  messages: NegotiationMessage[];
  status: 'open' | 'accepted' | 'declined' | 'countered';
  currentOffer: number | null;
  createdAt: number;
}

interface NegotiationState {
  negotiations: Negotiation[];
  createNegotiation: (productId: string, productName: string, productImage: string, originalPrice: number, requestedQty: number) => string;
  sendBuyerMessage: (negotiationId: string, text: string, offerPrice?: number) => void;
  sendSellerCounter: (negotiationId: string, text: string, counterPrice: number) => void;
  acceptOffer: (negotiationId: string) => void;
  declineOffer: (negotiationId: string) => void;
  getNegotiation: (id: string) => Negotiation | undefined;
}

function generateSellerResponse(buyerOffer: number, originalPrice: number): { text: string; counterPrice: number } {
  const discount = ((originalPrice - buyerOffer) / originalPrice) * 100;
  if (discount > 20) {
    const counter = Math.round(originalPrice * 0.85);
    return {
      text: `That's quite a stretch! I can offer ₹${counter}/kg for this bulk quantity. This includes free delivery within 50km.`,
      counterPrice: counter,
    };
  }
  if (discount > 10) {
    const counter = Math.round(originalPrice * 0.92);
    return {
      text: `Good offer! I can meet you at ₹${counter}/kg. This includes priority dispatch within 24 hours.`,
      counterPrice: counter,
    };
  }
  const counter = Math.round(originalPrice * 0.95);
  return {
    text: `I appreciate the offer! The best I can do is ₹${counter}/kg with same-day dispatch.`,
    counterPrice: counter,
  };
}

export const useNegotiationStore = create<NegotiationState>((set, get) => ({
  negotiations: [],
  createNegotiation: (productId, productName, productImage, originalPrice, requestedQty) => {
    const id = `neg_${Date.now()}`;
    const negotiation: Negotiation = {
      id,
      productId,
      productName,
      productImage,
      originalPrice,
      requestedQty,
      messages: [],
      status: 'open',
      currentOffer: null,
      createdAt: Date.now(),
    };
    set((state) => ({ negotiations: [...state.negotiations, negotiation] }));
    return id;
  },
  sendBuyerMessage: (negotiationId, text, offerPrice) => {
    const buyerMsg: NegotiationMessage = {
      id: `msg_${Date.now()}`,
      sender: 'buyer',
      text,
      timestamp: Date.now(),
      price: offerPrice,
    };
    set((state) => ({
      negotiations: state.negotiations.map((n) => {
        if (n.id !== negotiationId) return n;
        const updated = { ...n, messages: [...n.messages, buyerMsg], currentOffer: offerPrice ?? n.currentOffer };

        // Auto-respond after buyer message
        setTimeout(() => {
          const current = get().negotiations.find((neg) => neg.id === negotiationId);
          if (!current || current.status !== 'open') return;
          const offer = offerPrice ?? current.currentOffer ?? current.originalPrice;
          const response = generateSellerResponse(offer, current.originalPrice);
          get().sendSellerCounter(negotiationId, response.text, response.counterPrice);
        }, 1500);

        return updated;
      }),
    }));
  },
  sendSellerCounter: (negotiationId, text, counterPrice) => {
    const sellerMsg: NegotiationMessage = {
      id: `msg_${Date.now()}`,
      sender: 'seller',
      text,
      timestamp: Date.now(),
      price: counterPrice,
    };
    set((state) => ({
      negotiations: state.negotiations.map((n) =>
        n.id === negotiationId
          ? { ...n, messages: [...n.messages, sellerMsg], currentOffer: counterPrice, status: 'countered' }
          : n,
      ),
    }));
  },
  acceptOffer: (negotiationId) =>
    set((state) => ({
      negotiations: state.negotiations.map((n) =>
        n.id === negotiationId ? { ...n, status: 'accepted' } : n,
      ),
    })),
  declineOffer: (negotiationId) =>
    set((state) => ({
      negotiations: state.negotiations.map((n) =>
        n.id === negotiationId ? { ...n, status: 'declined' } : n,
      ),
    })),
  getNegotiation: (id) => get().negotiations.find((n) => n.id === id),
}));
