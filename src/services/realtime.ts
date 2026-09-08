import { io, type Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

export type RealtimeStatus = 'connecting' | 'live' | 'simulated';

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
 * Realtime service — connects to the Socket.IO backend via the Vite dev
 * proxy (`/socket.io`), or an explicit VITE_SOCKET_URL.
 *
 * Behaviour:
 *  - When the backend is reachable, live Socket.IO events drive the UI
 *    (realtime product prices + stock).
 *  - When the backend is down, a built-in mock provider keeps the UI alive
 *    with simulated updates. No UI changes needed either way.
 */

const BACKEND_SOCKET_URL: string | null = import.meta.env.VITE_SOCKET_URL || window.location.origin || null;

let socket: Socket | null = null;
let socketConnected = false;
let mockInterval: ReturnType<typeof setInterval> | null = null;
const mockListeners = new Map<string, Set<Handler>>();

let connectionStatus: RealtimeStatus = 'connecting';
const statusListeners = new Set<() => void>();

function setConnectionStatus(status: RealtimeStatus) {
  if (connectionStatus === status) return;
  connectionStatus = status;
  statusListeners.forEach((cb) => cb());
}

export function getRealtimeStatus(): RealtimeStatus {
  return connectionStatus;
}

function stopMockProvider() {
  if (mockInterval) {
    clearInterval(mockInterval);
    mockInterval = null;
  }
}

function startMockProvider() {
  if (socketConnected) return; // live feed is active
  if (mockInterval) return; // already running

  setConnectionStatus('simulated');

  const queue: Array<[string, unknown]> = [];

  const productIds = ['prod_tomato', 'prod_beans', 'prod_potato', 'prod_apple', 'prod_onion', 'prod_brinjal', 'prod_carrot', 'prod_mango'];
  const basePrices = [30, 23.5, 28, 145, 32, 26, 35, 120];
  let priceState = [...basePrices];

  mockInterval = setInterval(() => {
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
}

function connectSocket(): Socket | null {
  if (!BACKEND_SOCKET_URL) {
    startMockProvider();
    return null;
  }
  if (socket) return socket;

  socket = io(BACKEND_SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 3000,
    timeout: 5000,
  });

  socket.on('connect', () => {
    socketConnected = true;
    setConnectionStatus('live');
    stopMockProvider();
  });

  socket.on('disconnect', (reason) => {
    socketConnected = false;
    if (reason === 'io server disconnect') {
      setConnectionStatus('simulated');
      return;
    }
    setConnectionStatus('simulated');
    startMockProvider();
  });

  socket.on('connect_error', () => {
    socketConnected = false;
    setConnectionStatus('simulated');
    startMockProvider();
  });

  return socket;
}

export const realtime = {
  on<T = unknown>(event: string, handler: Handler<T>): () => void {
    connectSocket();
    if (socket) {
      socket.on(event, handler);
    }
    // Always register the mock listener too: if the socket never connects,
    // events continue to flow from the mock provider.
    if (!mockListeners.has(event)) mockListeners.set(event, new Set());
    mockListeners.get(event)!.add(handler as Handler);
    startMockProvider();

    return () => {
      socket?.off(event, handler);
      mockListeners.get(event)?.delete(handler as Handler);
    };
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
      socketConnected = false;
    }
    stopMockProvider();
  },
  isConnected() {
    return socketConnected;
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

// React hook that reflects the live-vs-simulated connection state of the feed.
export function useRealtimeStatus(): RealtimeStatus {
  const [status, setStatus] = useState<RealtimeStatus>(connectionStatus);

  useEffect(() => {
    const cb = () => setStatus(connectionStatus);
    cb();
    statusListeners.add(cb);
    return () => {
      statusListeners.delete(cb);
    };
  }, []);

  return status;
}