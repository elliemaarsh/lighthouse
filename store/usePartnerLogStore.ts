import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getTodayDateString } from '@/lib/date';
import {
  isCorePartnerLogComplete,
  partnerDataToTodayLog,
  todayLogToPartnerData,
} from '@/lib/partnerLogMappers';
import { getUserStorage, isClient } from '@/lib/storage';
import type { PartnerLogData } from '@/types/partnerLog';
import type { PartnerWeekDayLog, TodayLog } from '@/types/partnerLogStore';

export type { PartnerWeekDayLog, TodayLog } from '@/types/partnerLogStore';

export const PARTNER_LOG_STORAGE_KEY = 'lighthouse-partner-log-store';

const defaultLog: TodayLog = {
  sleep: null,
  exercise: null,
  heat: null,
  substances: [],
  alcoholDrinks: 0,
  stress: null,
  notes: null,
  loggedAt: null,
};

type PartnerLogStore = {
  hasLoggedToday: boolean;
  todayLog: TodayLog | null;
  weeklyLogs: PartnerWeekDayLog[];
  setHasLoggedToday: (val: boolean) => void;
  setTodayLog: (log: TodayLog) => void;
  setWeeklyLogs: (logs: PartnerWeekDayLog[]) => void;
  updateField: (field: keyof TodayLog, value: TodayLog[keyof TodayLog]) => void;
  syncFromPartnerData: (data: PartnerLogData, options?: { keepLoggedAt?: boolean }) => void;
  resetToday: () => void;
  resetIfNewDay: () => void;
};

export const usePartnerLogStore = create<PartnerLogStore>()(
  persist(
    (set, get) => ({
      hasLoggedToday: false,
      todayLog: null,
      weeklyLogs: [],
      setHasLoggedToday: (val) => set({ hasLoggedToday: val }),
      setTodayLog: (log) => set({ todayLog: log }),
      setWeeklyLogs: (logs) => set({ weeklyLogs: logs }),
      updateField: (field, value) =>
        set((state) => {
          const base = state.todayLog ?? { ...defaultLog };
          const next: TodayLog = {
            ...base,
            [field]: value,
            loggedAt: new Date().toISOString(),
          };
          return {
            todayLog: next,
            hasLoggedToday: isCorePartnerLogComplete(next) || state.hasLoggedToday,
          };
        }),
      syncFromPartnerData: (data, options) => {
        const prev = get().todayLog;
        const loggedAt =
          options?.keepLoggedAt && prev?.loggedAt
            ? prev.loggedAt
            : new Date().toISOString();
        const todayLog = partnerDataToTodayLog(data, loggedAt);
        set({
          todayLog,
          hasLoggedToday: isCorePartnerLogComplete(todayLog),
        });
      },
      resetToday: () => set({ hasLoggedToday: false, todayLog: null }),
      resetIfNewDay: () => {
        const { todayLog } = get();
        if (!todayLog?.loggedAt) return;
        const loggedDate = todayLog.loggedAt.slice(0, 10);
        if (loggedDate !== getTodayDateString()) {
          set({ hasLoggedToday: false, todayLog: null });
        }
      },
    }),
    {
      name: PARTNER_LOG_STORAGE_KEY,
      storage: createJSONStorage(getUserStorage),
      skipHydration: !isClient,
      partialize: (state) => ({
        hasLoggedToday: state.hasLoggedToday,
        todayLog: state.todayLog,
        weeklyLogs: state.weeklyLogs,
      }),
    },
  ),
);

export function getPartnerDataFromStore(): PartnerLogData {
  const log = usePartnerLogStore.getState().todayLog;
  if (!log) {
    return todayLogToPartnerData(defaultLog);
  }
  return todayLogToPartnerData(log);
}
