import { create } from 'zustand';

import { todayLogToCheckInData, type TodayLog } from '@/store/useTrackStore';
import type { CheckInData, PeriodStatus, TempUnit } from '@/types/checkIn';

export type CheckInDraft = {
  periodStatus: PeriodStatus | null;
  temperature: number | null;
  temperatureNotMeasured: boolean;
  tempUnit: TempUnit;
  mood: number | null;
  moodNote: string;
  symptoms: string[];
  notes: string;
};

const initialDraft: CheckInDraft = {
  periodStatus: null,
  temperature: null,
  temperatureNotMeasured: false,
  tempUnit: 'F',
  mood: null,
  moodNote: '',
  symptoms: [],
  notes: '',
};

type CheckInStoreState = CheckInDraft & {
  setField: <K extends keyof CheckInDraft>(field: K, value: CheckInDraft[K]) => void;
  setFields: (partial: Partial<CheckInDraft>) => void;
  reset: () => void;
};

export const useCheckInStore = create<CheckInStoreState>()((set) => ({
  ...initialDraft,
  setField: (field, value) => set({ [field]: value }),
  setFields: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(initialDraft),
}));

export function checkInDraftToData(draft: CheckInDraft): CheckInData {
  return {
    periodStatus: draft.periodStatus,
    temperature: draft.temperature,
    temperatureNotMeasured: draft.temperatureNotMeasured,
    tempUnit: draft.tempUnit,
    mood: draft.mood,
    moodNote: draft.moodNote ?? '',
    symptoms: draft.symptoms ?? [],
    notes: draft.notes ?? '',
  };
}

export function hydrateCheckInStoreFromTodayLog(log: TodayLog): void {
  const data = todayLogToCheckInData(log);
  useCheckInStore.getState().setFields({
    periodStatus: data.periodStatus,
    temperature: data.temperature,
    temperatureNotMeasured: data.temperatureNotMeasured,
    tempUnit: data.tempUnit,
    mood: data.mood,
    moodNote: data.moodNote,
    symptoms: data.symptoms,
    notes: data.notes,
  });
}
