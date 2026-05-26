import type { TodayLogSummary } from '@/types/checkIn';

export const CYCLE_ACCENT = '#27359E';
export const CYCLE_DOT_COUNT = 10;
export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_CYCLE_DAY = 14;

export function cyclePhaseForDay(day: number): string {
  if (day <= 0) return '';
  if (day <= 5) return 'Menstrual';
  if (day <= 14) return 'Follicular';
  return 'Luteal';
}

export function cycleFilledDotCount(day: number, cycleLength = DEFAULT_CYCLE_LENGTH): number {
  if (day <= 0) return 0;
  return Math.min(
    CYCLE_DOT_COUNT,
    Math.max(1, Math.round((day / cycleLength) * CYCLE_DOT_COUNT)),
  );
}

export type CycleDayDisplay = {
  value: string;
  subtitle: string;
};

export function cycleDayFromPartnerLog(
  log: TodayLogSummary | null,
  partnerFirst: string,
): CycleDayDisplay {
  const name = partnerFirst.trim() || 'Partner';

  if (!log) {
    return {
      value: '—',
      subtitle: `${name} hasn't logged yet`,
    };
  }

  switch (log.periodStatus) {
    case 'period_started':
      return { value: 'Day 1', subtitle: 'Period started today' };
    case 'period_ongoing':
      return { value: 'In cycle', subtitle: 'Period ongoing' };
    case 'period_ended':
      return { value: '—', subtitle: 'Period ended recently' };
    case 'no_period':
      return { value: '—', subtitle: 'No period today' };
    default:
      return {
        value: '—',
        subtitle: `${name} hasn't logged cycle yet`,
      };
  }
}
