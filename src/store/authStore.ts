import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  city?: string;
  state?: string;
  organization?: string;
  avatar?: string;
}

export const DEMO_USERS = [
  { id: 'demo_admin', name: 'Admin User', email: 'admin@maanvasam.com', password: 'Admin@123', role: 'ADMIN', location: 'Chennai', avatar: '' },
  { id: 'demo_farmer', name: 'Farmer Raman', email: 'farmer@maanvasam.com', password: 'Farmer@123', role: 'FARMER', location: 'Madurai', organization: 'GreenValley FPO' },
  { id: 'demo_consumer', name: 'Consumer Priya', email: 'consumer@maanvasam.com', password: 'Consumer@123', role: 'CONSUMER', location: 'Chennai' },
];

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const STORAGE_TOKEN = 'mv_token';
const STORAGE_USER = 'mv_user';

function initialToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_TOKEN);
  } catch {
    return null;
  }
}

function initialUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken(),
  user: initialUser(),

  setAuth: (token, user) => {
    try {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    } catch {
      /* noop */
    }
    set({ token, user });
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    } catch {
      /* noop */
    }
    set({ token: null, user: null });
  },
}));