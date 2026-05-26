import { getTodayDateString } from '@/lib/date';
import { getWeekStartString } from '@/lib/weekStart';
import type { DailyLogEntry } from '@/lib/logsInRange';
import type { TodayLog } from '@/store/useTrackStore';

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export type WeekDayCell = {
  dateKey: string;
  letter: string;
  dayNum: number;
  isToday: boolean;
  hasLog: boolean;
  mood: number | null;
  temperature: number | null;
};

export function getWeekEndString(weekStart: string): string {
  const d = new Date(`${weekStart}T12:00:00`);
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
}

export function buildWeekDayCells(
  logs: DailyLogEntry[],
  todayLog: TodayLog | null,
  hasLoggedToday: boolean,
): WeekDayCell[] {
  const weekStart = getWeekStartString();
  const todayKey = getTodayDateString();
  const byDate = new Map(logs.map((l) => [l.date, l]));

  if (hasLoggedToday && todayLog && todayKey === todayLog.date) {
    byDate.set(todayKey, {
      date: todayKey,
      periodStatus: todayLog.periodStatus,
      temperature: todayLog.temperature,
      temperatureNotMeasured: todayLog.temperatureNotMeasured,
      tempUnit: todayLog.tempUnit,
      mood: todayLog.mood,
      moodNote: todayLog.moodNote,
      symptoms: todayLog.symptoms,
      notes: todayLog.notes ?? '',
    });
  }

  const start = new Date(`${weekStart}T12:00:00`);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateKey = d.toISOString().slice(0, 10);
    const entry = byDate.get(dateKey);
    const isToday = dateKey === todayKey;

    return {
      dateKey,
      letter: LETTERS[i],
      dayNum: d.getDate(),
      isToday,
      hasLog: Boolean(
        entry &&
          (entry.mood != null ||
            entry.periodStatus != null ||
            entry.temperature != null ||
            (entry.symptoms?.length ?? 0) > 0),
      ),
      mood: entry?.mood ?? null,
      temperature:
        entry?.temperatureNotMeasured || entry?.temperature == null
          ? null
          : entry.temperature,
    };
  });
}

const PLACEHOLDER_TEMPS = [97.2, 97.4, 97.1, 97.5, 97.3, 97.6, 97.8];

export function buildBbtSparklinePath(
  days: WeekDayCell[],
  width: number,
): string {
  const values = days.map((d, i) =>
    d.temperature != null ? d.temperature : PLACEHOLDER_TEMPS[i],
  );
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const range = max - min || 1;
  const h = 20;
  const pad = 2;

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (width - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return { x, y };
  });

  if (points.length === 0) return '';

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

export const MOOD_MINI_HEIGHTS = [4, 6, 8, 10, 12] as const;
export const MOOD_STAIRCASE_HEIGHTS = [8, 12, 16, 20, 24] as const;

export function formatTodayHeader(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
