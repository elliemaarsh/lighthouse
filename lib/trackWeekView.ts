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
  symptoms: string[];
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
      symptoms: entry?.symptoms ?? [],
    };
  });
}

const BBT_MIN = 97.0;
const BBT_MAX = 98.5;

export function buildBbtSparklinePath(
  days: WeekDayCell[],
  width: number,
  height = 20,
): string {
  const pad = 2;
  const innerH = height - pad * 2;

  const points: { x: number; y: number }[] = [];
  days.forEach((d, i) => {
    if (d.temperature == null) return;
    const x = pad + (i / Math.max(days.length - 1, 1)) * (width - pad * 2);
    const y =
      pad + innerH - ((d.temperature - BBT_MIN) / (BBT_MAX - BBT_MIN)) * innerH;
    points.push({ x, y });
  });

  if (points.length < 2) return '';

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const cx = (prev.x + curr.x) / 2;
    d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

/** Temperature trend for the carrying partner trends card (taller viewBox). */
export function buildBbtTrendSparklinePath(
  days: WeekDayCell[],
  width: number,
): string {
  return buildBbtSparklinePath(days, width, 32);
}

export function bbtSparklineCaption(days: WeekDayCell[]): string | null {
  const temps = days
    .map((d) => d.temperature)
    .filter((t): t is number => t != null);
  if (temps.length < 2) return null;
  const first = temps[0]!;
  const last = temps[temps.length - 1]!;
  return `${first.toFixed(1)} → ${last.toFixed(1)}°F this week`;
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
