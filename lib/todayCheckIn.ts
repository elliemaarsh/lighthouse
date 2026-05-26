import { todayLogToSummary, useTrackStore } from '@/store/useTrackStore';
import type { TodayLogSummary } from '@/types/checkIn';

/** Bridge for callers not yet on useTrackStore */
export const todayCheckInSession = {
  getHasLoggedToday: () => useTrackStore.getState().hasLoggedToday,
  getTodayLog: () => {
    const log = useTrackStore.getState().todayLog;
    return log ? todayLogToSummary(log) : null;
  },
  setLogged: (summary: TodayLogSummary) => {
    const { date: _date, ...data } = summary;
    useTrackStore.getState().setTodayCheckIn({
      ...data,
      moodNote: data.moodNote ?? '',
      temperatureNotMeasured: data.temperatureNotMeasured ?? false,
      notes: data.notes ?? '',
    });
  },
  clear: () => useTrackStore.getState().clearTodayCheckIn(),
  async hydrate(userId: string | null): Promise<void> {
    await useTrackStore.getState().hydrateFromRemote(userId);
  },
};
