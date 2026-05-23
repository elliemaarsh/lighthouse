import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  clearUserStorage,
  getUserStorage,
  isClient,
  USER_STORAGE_KEY,
} from '@/lib/storage';

export type UserRole = 'carrying' | 'non-carrying' | 'both';

/** @deprecated Legacy tab checks — synced from journeyType */
export type JourneyType =
  | 'trying-to-conceive'
  | 'ivf'
  | 'pregnancy-loss'
  | 'getting-started';

export type BiologicalSex = 'female' | 'male' | 'intersex' | 'prefer not to say';

export type PartnerBiologicalSex = BiologicalSex | 'no partner';

/** Default journey label — keeps Connect Treatment visible during testing */
export const DEFAULT_IVF_JOURNEY_LABEL = 'Going through IVF or IUI';

function legacyJourneyTypes(journeyType: string[]): JourneyType[] {
  const out: JourneyType[] = [];
  if (journeyType.some((j) => /ivf|iui/i.test(j))) out.push('ivf');
  if (journeyType.some((j) => /trying to conceive naturally/i.test(j))) {
    out.push('trying-to-conceive');
  }
  if (journeyType.some((j) => /pregnancy loss|miscarriage/i.test(j))) {
    out.push('pregnancy-loss');
  }
  if (journeyType.some((j) => /just starting/i.test(j))) out.push('getting-started');
  return out;
}

type UserState = {
  userId: string | null;
  name: string;
  /** @deprecated Use name — kept for existing screens */
  displayName: string;
  role: UserRole | null;
  biologicalSex: BiologicalSex | null;
  partnerBiologicalSex: PartnerBiologicalSex | null;
  relationshipStructure: string | null;
  age: number | null;
  /** ISO date YYYY-MM-DD */
  birthDate: string | null;
  partnerAge: number | null;
  goals: string[];
  journeyType: string[];
  /** @deprecated Synced from journeyType for Connect / treatment */
  journeyTypes: JourneyType[];
  ivfStatus: string | null;
  naturalCycleTracking: boolean;
  birthControl: string | null;
  fertilityHistory: string[];
  partnerEmail: string;
  partnerLinked: boolean;
  /** Carrying partner's user id when accounts are linked */
  partnerUserId: string | null;
  /** ISO date YYYY-MM-DD of last couples pulse check-in */
  lastPulseCheckDate: string | null;
  /** Display name for partner — placeholder until linking ships */
  partnerName: string | null;
  hasCompletedOnboarding: boolean;
  communityUsername: string | null;
  hasSetUpCommunity: boolean;
  setUserId: (userId: string | null) => void;
  setName: (name: string) => void;
  /** @deprecated Use setName */
  setDisplayName: (displayName: string) => void;
  setRole: (role: UserRole | null) => void;
  setBiologicalSex: (biologicalSex: BiologicalSex | null) => void;
  setPartnerBiologicalSex: (partnerBiologicalSex: PartnerBiologicalSex | null) => void;
  setRelationshipStructure: (relationshipStructure: string | null) => void;
  setAge: (age: number | null) => void;
  setBirthDate: (birthDate: string | null) => void;
  setPartnerAge: (partnerAge: number | null) => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  setJourneyType: (journeyType: string[]) => void;
  toggleJourneyType: (item: string | JourneyType) => void;
  setIvfStatus: (ivfStatus: string | null) => void;
  setNaturalCycleTracking: (naturalCycleTracking: boolean) => void;
  setBirthControl: (birthControl: string | null) => void;
  setFertilityHistory: (fertilityHistory: string[]) => void;
  toggleFertilityHistory: (item: string) => void;
  setPartnerEmail: (partnerEmail: string) => void;
  setPartnerLinked: (partnerLinked: boolean) => void;
  setPartnerUserId: (partnerUserId: string | null) => void;
  setLastPulseCheckDate: (lastPulseCheckDate: string | null) => void;
  setPartnerName: (partnerName: string | null) => void;
  setCommunityUsername: (communityUsername: string | null) => void;
  setHasSetUpCommunity: (hasSetUpCommunity: boolean) => void;
  completeCommunitySetup: (username: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const initialState = {
  userId: null,
  name: '',
  displayName: '',
  role: null as UserRole | null,
  biologicalSex: null as BiologicalSex | null,
  partnerBiologicalSex: null as PartnerBiologicalSex | null,
  relationshipStructure: null as string | null,
  age: null as number | null,
  birthDate: null as string | null,
  partnerAge: null as number | null,
  goals: [] as string[],
  journeyType: [DEFAULT_IVF_JOURNEY_LABEL] as string[],
  journeyTypes: ['ivf'] as JourneyType[],
  ivfStatus: null as string | null,
  naturalCycleTracking: false,
  birthControl: null as string | null,
  fertilityHistory: [] as string[],
  partnerEmail: '',
  partnerLinked: false,
  partnerUserId: null as string | null,
  lastPulseCheckDate: null as string | null,
  partnerName: null as string | null,
  hasCompletedOnboarding: false,
  communityUsername: null as string | null,
  hasSetUpCommunity: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUserId: (userId) => set({ userId }),
      setName: (name) => set({ name, displayName: name }),
      setDisplayName: (displayName) => set({ name: displayName, displayName }),
      setRole: (role) => set({ role }),
      setBiologicalSex: (biologicalSex) => set({ biologicalSex }),
      setPartnerBiologicalSex: (partnerBiologicalSex) => set({ partnerBiologicalSex }),
      setRelationshipStructure: (relationshipStructure) => set({ relationshipStructure }),
      setAge: (age) => set({ age }),
      setBirthDate: (birthDate) => set({ birthDate }),
      setPartnerAge: (partnerAge) => set({ partnerAge }),
      setGoals: (goals) => set({ goals }),
      toggleGoal: (goal) => {
        const current = get().goals;
        set({
          goals: current.includes(goal)
            ? current.filter((g) => g !== goal)
            : [...current, goal],
        });
      },
      setJourneyType: (journeyType) =>
        set({ journeyType, journeyTypes: legacyJourneyTypes(journeyType) }),
      toggleJourneyType: (item) => {
        const legacyIds: readonly string[] = [
          'trying-to-conceive',
          'ivf',
          'pregnancy-loss',
          'getting-started',
        ];
        if (legacyIds.includes(item)) {
          const journeyType = item as JourneyType;
          const current = get().journeyTypes;
          const next = current.includes(journeyType)
            ? current.filter((t) => t !== journeyType)
            : [...current, journeyType];
          set({ journeyTypes: next });
          return;
        }
        const current = get().journeyType;
        const next = current.includes(item)
          ? current.filter((j) => j !== item)
          : [...current, item];
        set({ journeyType: next, journeyTypes: legacyJourneyTypes(next) });
      },
      setIvfStatus: (ivfStatus) => set({ ivfStatus }),
      setNaturalCycleTracking: (naturalCycleTracking) => set({ naturalCycleTracking }),
      setBirthControl: (birthControl) => set({ birthControl }),
      setFertilityHistory: (fertilityHistory) => set({ fertilityHistory }),
      toggleFertilityHistory: (item) => {
        const exclusive = ['None of the above', 'Prefer not to say'];
        if (exclusive.includes(item)) {
          set({ fertilityHistory: [item] });
          return;
        }
        const withoutExclusive = get().fertilityHistory.filter(
          (h) => !exclusive.includes(h),
        );
        const current = withoutExclusive;
        set({
          fertilityHistory: current.includes(item)
            ? current.filter((h) => h !== item)
            : [...current, item],
        });
      },
      setPartnerEmail: (partnerEmail) => set({ partnerEmail }),
      setPartnerLinked: (partnerLinked) => set({ partnerLinked }),
      setPartnerUserId: (partnerUserId) => set({ partnerUserId }),
      setLastPulseCheckDate: (lastPulseCheckDate) => set({ lastPulseCheckDate }),
      setPartnerName: (partnerName) => set({ partnerName }),
      setCommunityUsername: (communityUsername) => set({ communityUsername }),
      setHasSetUpCommunity: (hasSetUpCommunity) => set({ hasSetUpCommunity }),
      completeCommunitySetup: (username) =>
        set({
          communityUsername: username,
          hasSetUpCommunity: true,
        }),
      completeOnboarding: () => {
        const state = get();
        const journeyType =
          state.journeyType.length > 0
            ? state.journeyType
            : [DEFAULT_IVF_JOURNEY_LABEL];
        let journeyTypes = legacyJourneyTypes(journeyType);
        if (!journeyTypes.includes('ivf')) {
          journeyTypes = [...journeyTypes, 'ivf'];
        }
        set({
          hasCompletedOnboarding: true,
          journeyType,
          journeyTypes,
        });
      },
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
