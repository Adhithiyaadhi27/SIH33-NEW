import { io, type Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

type Handler<T = unknown> = (payload: T) => void;

export interface RealtimeEventMap {
  'price:update': { productId: string; price: number };
  'stock:update': { productId: string; availableQty: number };
  'metric:update': { key: string; value: number };
  'route:update': { routeId: string; longitude: number; latitude: number };
  'heatmap:update': { district: string; level: 'high' | 'medium' | 'low' | 'normal' };
  'grade:update': { sampleId: string; grade: 'GRADE A' | 'GRADE B' | 'GRADE C'; ripeness: number };
}

/**
 * Realtime service — connects to a Socket.IO backend if available,
 * otherwise falls back to a built-in mock realtime provider that emits
 * interval-driven updates. Swap the backend URL below to connect a live
 * server without touching the UI.
 */

const BACKEND_SOCKET_URL: string | null = null; // e.g. 'http://localhost:5000'
const ENABLE_MOCK = true;

let socket: Socket | null = null;
const mockListeners = new Map<string, Set<Handler>>();

function connectSocket(): Socket | null {
  if (!BACKEND_SOCKET_URL) return null;
  if (socket) return socket;
  socket = io(BACKEND_SOCKET_URL, { transports: ['websocket'] });
  return socket;
}

function startMockProvider() {
  if (mockListeners.size > 0) return; // already running
  const queue: Array<[string, unknown]> = [];

  const productIds = ['prod_tomato', 'prod_beans', 'prod_potato', 'prod_apple', 'prod_onion', 'prod_brinjal', 'prod_carrot', 'prod_mango'];
  const basePrices = [30, 23.5, 28, 145, 32, 26, 35, 120];
  let priceState = [...basePrices];

  const interval = setInterval(() => {
    const idx = Math.floor(Math.random() * priceState.length);
    const delta = Math.round((Math.random() * 4 - 2) * 10) / 10;
    priceState = priceState.map((p, i) => (i === idx ? Math.max(5, Number((p + delta).toFixed(1))) : p));

    queue.push(['price:update', { productId: productIds[idx], price: priceState[idx] }]);
    queue.push(['stock:update', { productId: productIds[idx], availableQty: Math.max(1, Math.round(300 + Math.random() * 2200)) }]);
    queue.push(['metric:update', { key: 'harvest', value: 5000 }]);
    queue.push(['metric:update', { key: 'transit', value: 1700 + Math.floor(Math.random() * 200) }]);
    queue.push(['metric:update', { key: 'delivery', value: 1700 + Math.floor(Math.random() * 180) }]);

    while (queue.length) {
      const [event, payload] = queue.shift() as [string, unknown];
      const handlers = mockListeners.get(event);
      handlers?.forEach((h) => h(payload));
    }
  }, 4000);

  // Cleanup not wired globally; kept simple for demo.
  (interval as unknown as { __mock: boolean }).__mock = true;
}

export const realtime = {
  on<T = unknown>(event: string, handler: Handler<T>): () => void {
    const s = connectSocket();
    if (s) {
      s.on(event, handler);
      return () => s.off(event, handler);
    }
    if (ENABLE_MOCK) {
      if (!mockListeners.has(event)) mockListeners.set(event, new Set());
      mockListeners.get(event)!.add(handler as Handler);
      startMockProvider();
      return () => {
        mockListeners.get(event)?.delete(handler as Handler);
      };
    }
    return () => {};
  },
  off(event: string, handler?: Handler) {
    if (socket) {
      if (handler) socket.off(event, handler);
      else socket.off(event);
    }
  },
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};

// React hook to subscribe to realtime events.
// Subscribes once per event; the latest handler is always invoked via a ref,
// so re-renders do not churn the Socket.IO / mock provider subscription.
export function useRealtime<K extends keyof RealtimeEventMap>(event: K, handler: Handler<RealtimeEventMap[K]>) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    return realtime.on(event, ((payload: RealtimeEventMap[K]) => handlerRef.current(payload)) as Handler);
  }, [event]);
}
