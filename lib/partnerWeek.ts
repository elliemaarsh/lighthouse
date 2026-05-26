import { getWeekEndString } from '@/lib/trackWeekView';
import { getWeekStartString } from '@/lib/weekStart';
import { fetchPartnerLogsInRange } from '@/lib/logsInRange';
import {
  emptyWeekDayLog,
  partnerEntryToWeekDayLog,
} from '@/lib/partnerLogMappers';
import type { PartnerWeekDayLog } from '@/types/partnerLogStore';

export const PARTNER_WEEK_DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function getWeekDateStrings(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(`${weekStart}T12:00:00`);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export async function loadPartnerWeeklyLogs(
  userId: string,
): Promise<PartnerWeekDayLog[]> {
  const weekStart = getWeekStartString();
  const weekEnd = getWeekEndString(weekStart);
  const entries = await fetchPartnerLogsInRange(userId, weekStart, weekEnd);
  const dates = getWeekDateStrings(weekStart);

  return dates.map((date) => {
    const entry = entries.find((e) => e.date === date);
    return entry ? partnerEntryToWeekDayLog(entry) : emptyWeekDayLog(date);
  });
}
