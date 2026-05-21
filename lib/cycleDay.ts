import type { TodayLogSummary } from '@/types/checkIn';

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
