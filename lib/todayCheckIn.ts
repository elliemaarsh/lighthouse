import type { TodayLogSummary } from '@/types/checkIn';

/** Ephemeral session state for today's check-in (not persisted in Zustand). */
let hasLoggedToday = false;
let todayLog: TodayLogSummary | null = null;

export const todayCheckInSession = {
  getHasLoggedToday: () => hasLoggedToday,
  getTodayLog: () => todayLog,
  setLogged: (log: TodayLogSummary) => {
    hasLoggedToday = true;
    todayLog = log;
  },
  clear: () => {
    hasLoggedToday = false;
    todayLog = null;
  },
};
