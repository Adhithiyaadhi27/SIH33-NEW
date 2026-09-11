import { create } from 'zustand';

export type RoleName = 'FPO' | 'Consumer' | 'Bulk Buyer' | 'Logistics' | 'Admin';

interface RoleState {
  activeRole: RoleName;
  setActiveRole: (role: RoleName) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  activeRole: 'Consumer',
  setActiveRole: (activeRole) => set({ activeRole }),
}));
