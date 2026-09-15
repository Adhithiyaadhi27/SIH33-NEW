import { create } from 'zustand';

const STORAGE_KEY = 'notification_read_state';

function load(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as unknown;
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function persist(read: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(read));
  } catch {
    /* storage unavailable — keep in-memory fallback */
  }
}

interface NotificationReadState {
  read: Record<string, boolean>;
  isRead: (id: string) => boolean;
  unreadCount: (ids: string[]) => number;
  markRead: (id: string) => void;
  markManyRead: (ids: string[]) => void;
  markAllRead: (ids: string[]) => void;
  reset: () => void;
}

export const useNotificationReadStore = create<NotificationReadState>((set, get) => ({
  read: load(),
  isRead: (id) => Boolean(get().read[id]),
  unreadCount: (ids) => ids.filter((id) => !get().read[id]).length,
  markRead: (id) => {
    if (get().read[id]) return;
    const next = { ...get().read, [id]: true };
    set({ read: next });
    persist(next);
  },
  markManyRead: (ids) => {
    const next = { ...get().read };
    ids.forEach((id) => { next[id] = true; });
    set({ read: next });
    persist(next);
  },
  markAllRead: (ids) => {
    const next = { ...get().read };
    ids.forEach((id) => { next[id] = true; });
    set({ read: next });
    persist(next);
  },
  reset: () => {
    set({ read: {} });
    persist({});
  },
}));