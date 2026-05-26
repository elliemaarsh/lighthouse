import { seedDailyLogsIfEmpty } from '@/data/seedDailyLogs';
import { buildFallbackWeeklyLogs } from '@/lib/carrierWeeklyFallback';
import { ensureLocalUserId } from '@/lib/localUserId';
import { fetchDailyLogsInRange, type DailyLogEntry } from '@/lib/logsInRange';
import { getWeekEndString } from '@/lib/trackWeekView';
import { getWeekStartString } from '@/lib/weekStart';
import { useTrackStore, type WeeklyLogEntry } from '@/store/useTrackStore';

function toWeeklyEntry(log: DailyLogEntry): WeeklyLogEntry {
  return {
    date: log.date,
    mood: log.mood,
    temperature:
      log.temperatureNotMeasured || log.temperature == null ? null : log.temperature,
    symptoms: log.symptoms ?? [],
    periodStatus: log.periodStatus,
  };
}

export function weeklyEntriesToDailyLogs(entries: WeeklyLogEntry[]): DailyLogEntry[] {
  return entries
    .filter((e) => e.mood != null || e.temperature != null || e.symptoms.length > 0)
    .map((e) => ({
      date: e.date,
      periodStatus: e.periodStatus as DailyLogEntry['periodStatus'],
      temperature: e.temperature,
      temperatureNotMeasured: e.temperature == null,
      tempUnit: 'F' as const,
      mood: e.mood,
      moodNote: '',
      symptoms: e.symptoms,
      notes: '',
    }));
}

export async function loadCarryingWeeklyLogs(
  userId: string | null,
): Promise<WeeklyLogEntry[]> {
  const uid = userId || ensureLocalUserId();
  if (!uid) {
    const fallback = buildFallbackWeeklyLogs();
    useTrackStore.getState().setWeeklyLogs(fallback);
    return fallback;
  }

  await seedDailyLogsIfEmpty(uid);

  const weekStart = getWeekStartString();
  const weekEnd = getWeekEndString(weekStart);
  const logs = await fetchDailyLogsInRange(uid, weekStart, weekEnd);

  let weekly: WeeklyLogEntry[];
  if (logs.length > 0) {
    weekly = logs.map(toWeeklyEntry);
  } else {
    weekly = buildFallbackWeeklyLogs();
  }

  useTrackStore.getState().setWeeklyLogs(weekly);
  return weekly;
}
