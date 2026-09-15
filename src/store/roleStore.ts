import { create } from 'zustand';

export type RoleName = 'ADMIN' | 'FARMER' | 'CONSUMER';

interface RoleState {
  activeRole: RoleName;
  setActiveRole: (role: RoleName) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  activeRole: 'CONSUMER',
  setActiveRole: (activeRole) => set({ activeRole }),
}));
