import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  clearUserStorage,
  getUserStorage,
  isClient,
  USER_STORAGE_KEY,
} from '@/lib/storage';

export type UserRole = 'carrying' | 'non-carrying';

export type JourneyType =
  | 'trying-to-conceive'
  | 'ivf'
  | 'pregnancy-loss'
  | 'getting-started';

type UserState = {
  userId: string | null;
  displayName: string;
  role: UserRole | null;
  journeyTypes: JourneyType[];
  partnerEmail: string;
  partnerLinked: boolean;
  hasCompletedOnboarding: boolean;
  setUserId: (userId: string | null) => void;
  setDisplayName: (displayName: string) => void;
  setRole: (role: UserRole | null) => void;
  setJourneyTypes: (journeyTypes: JourneyType[]) => void;
  toggleJourneyType: (journeyType: JourneyType) => void;
  setPartnerEmail: (partnerEmail: string) => void;
  setPartnerLinked: (partnerLinked: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const initialState = {
  userId: null,
  displayName: '',
  role: null as UserRole | null,
  journeyTypes: [] as JourneyType[],
  partnerEmail: '',
  partnerLinked: false,
  hasCompletedOnboarding: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUserId: (userId) => set({ userId }),
      setDisplayName: (displayName) => set({ displayName }),
      setRole: (role) => set({ role }),
      setJourneyTypes: (journeyTypes) => set({ journeyTypes }),
      toggleJourneyType: (journeyType) => {
        const current = get().journeyTypes;
        if (current.includes(journeyType)) {
          set({ journeyTypes: current.filter((t) => t !== journeyType) });
        } else {
          set({ journeyTypes: [...current, journeyType] });
        }
      },
      setPartnerEmail: (partnerEmail) => set({ partnerEmail }),
      setPartnerLinked: (partnerLinked) => set({ partnerLinked }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set(initialState),
    }),
    {
      name: USER_STORAGE_KEY,
      storage: createJSONStorage(getUserStorage),
      skipHydration: !isClient,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[Lighthouse] Failed to restore saved user data:', error);
          if (isClient) {
            void clearUserStorage();
          }
        }
      },
    },
  ),
);
