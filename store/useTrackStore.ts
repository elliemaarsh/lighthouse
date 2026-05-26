import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { fetchDailyLogForToday } from '@/lib/dailyLogs';
import { getTodayDateString } from '@/lib/date';
import { getUserStorage, isClient } from '@/lib/storage';
import type { CheckInData, TodayLogSummary } from '@/types/checkIn';

export const TRACK_STORAGE_KEY = 'lighthouse-track';

export type TodayLog = {
  periodStatus: CheckInData['periodStatus'];
  temperature: number | null;
  tempUnit: CheckInData['tempUnit'];
  mood: number | null;
  symptoms: string[];
  notes: string | null;
  moodNote: string;
  temperatureNotMeasured: boolean;
  date: string;
  loggedAt: string | null;
};

export type WeeklyLogEntry = {
  date: string;
  mood: number | null;
  temperature: number | null;
  symptoms: string[];
  periodStatus: CheckInData['periodStatus'] | string | null;
};

type TrackState = {
  hasLoggedToday: boolean;
  todayLog: TodayLog | null;
  weeklyLogs: WeeklyLogEntry[];
  setTodayCheckIn: (data: CheckInData) => void;
  clearTodayCheckIn: () => void;
  setWeeklyLogs: (logs: WeeklyLogEntry[]) => void;
  resetIfNewDay: () => void;
  hydrateFromRemote: (userId: string | null) => Promise<void>;
};

function toTodayLog(data: CheckInData, loggedAt: string): TodayLog {
  return {
    periodStatus: data.periodStatus,
    temperature: data.temperature,
    tempUnit: data.tempUnit,
    mood: data.mood,
    symptoms: data.symptoms,
    notes: data.notes.trim() ? data.notes : null,
    moodNote: data.moodNote,
    temperatureNotMeasured: data.temperatureNotMeasured,
    date: getTodayDateString(),
    loggedAt,
  };
}

export function todayLogToCheckInData(log: TodayLog): CheckInData {
  return {
    periodStatus: log.periodStatus,
    temperature: log.temperature,
    temperatureNotMeasured: log.temperatureNotMeasured,
    tempUnit: log.tempUnit,
    mood: log.mood,
    moodNote: log.moodNote ?? '',
    symptoms: log.symptoms ?? [],
    notes: log.notes ?? '',
  };
}

export function todayLogToSummary(log: TodayLog): TodayLogSummary {
  return {
    ...todayLogToCheckInData(log),
    date: log.date,
  };
}

export const useTrackStore = create<TrackState>()(
  persist(
    (set, get) => ({
      hasLoggedToday: false,
      todayLog: null,
      weeklyLogs: [],

      setTodayCheckIn: (data) => {
        const loggedAt = new Date().toISOString();
        const todayLog = toTodayLog(data, loggedAt);
        set({ hasLoggedToday: true, todayLog });
      },

      clearTodayCheckIn: () => {
        set({ hasLoggedToday: false, todayLog: null });
      },

      setWeeklyLogs: (weeklyLogs) => set({ weeklyLogs }),

      resetIfNewDay: () => {
        const { todayLog, hasLoggedToday } = get();
        if (!hasLoggedToday || !todayLog?.loggedAt) return;

        const loggedDate = todayLog.loggedAt.slice(0, 10);
        const today = getTodayDateString();
        if (loggedDate !== today) {
          set({ hasLoggedToday: false, todayLog: null });
        }
      },

      hydrateFromRemote: async (userId) => {
        get().resetIfNewDay();
        const { data } = await fetchDailyLogForToday(userId);
        if (data) {
          const loggedAt = new Date().toISOString();
          set({
            hasLoggedToday: true,
            todayLog: {
              ...toTodayLog(data, loggedAt),
              date: data.date,
            },
          });
        } else {
          const { todayLog } = get();
          if (todayLog?.date === getTodayDateString()) {
            return;
          }
          set({ hasLoggedToday: false, todayLog: null });
        }
      },
    }),
    {
      name: TRACK_STORAGE_KEY,
      storage: createJSONStorage(getUserStorage),
      skipHydration: !isClient,
      partialize: (state) => ({
        hasLoggedToday: state.hasLoggedToday,
        todayLog: state.todayLog,
        weeklyLogs: state.weeklyLogs,
      }),
      onRehydrateStorage: () => () => {
        useTrackStore.getState().resetIfNewDay();
      },
    },
  ),
);
