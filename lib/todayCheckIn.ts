import { fetchDailyLogForToday } from '@/lib/dailyLogs';
import { ensureLocalUserId } from '@/lib/localUserId';
import type { TodayLogSummary } from '@/types/checkIn';

/** In-memory cache for today's carrying check-in (hydrated from storage on focus). */
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
  async hydrate(userId: string | null): Promise<void> {
    const uid = userId ?? ensureLocalUserId();
    const { data } = await fetchDailyLogForToday(uid);
    if (data) {
      hasLoggedToday = true;
      todayLog = data;
    } else {
      hasLoggedToday = false;
      todayLog = null;
    }
  },
};
