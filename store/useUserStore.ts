import { create } from 'zustand';

export type UserRole = 'carrying' | 'non-carrying';

type UserState = {
  userId: string | null;
  role: UserRole | null;
  partnerLinked: boolean;
  setUserId: (userId: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setPartnerLinked: (partnerLinked: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  role: null,
  partnerLinked: false,
  setUserId: (userId) => set({ userId }),
  setRole: (role) => set({ role }),
  setPartnerLinked: (partnerLinked) => set({ partnerLinked }),
}));
