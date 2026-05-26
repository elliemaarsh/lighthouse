import type { PartnerLogData, PartnerCategoryId, HeatLevel } from '@/types/partnerLog';
import type { PartnerWeekDayLog, TodayLog } from '@/types/partnerLogStore';

export function partnerDataToTodayLog(
  data: PartnerLogData,
  loggedAt: string | null = new Date().toISOString(),
): TodayLog {
  return {
    sleep:
      data.sleepHours != null
        ? {
            hours: Math.floor(data.sleepHours),
            minutes:
              data.sleepMinutes ??
              Math.round((data.sleepHours - Math.floor(data.sleepHours)) * 60),
          }
        : null,
    exercise:
      data.exerciseActive != null
        ? {
            active: data.exerciseActive,
            minutes: data.exerciseMinutes,
            types: data.exerciseTypes ?? [],
          }
        : null,
    heat: data.heatLevel,
    substances: data.substances ?? [],
    alcoholDrinks: data.alcoholDrinks ?? 0,
    stress: data.stressLevel,
    notes: data.notes?.trim() ? data.notes.trim() : null,
    loggedAt,
  };
}

export function todayLogToPartnerData(log: TodayLog): PartnerLogData {
  const sleepHours =
    log.sleep != null ? log.sleep.hours + log.sleep.minutes / 60 : null;

  return {
    sleepHours,
    sleepMinutes: log.sleep?.minutes ?? null,
    exerciseActive: log.exercise?.active ?? null,
    exerciseMinutes: log.exercise?.minutes ?? null,
    exerciseTypes: log.exercise?.types ?? [],
    heatLevel: (log.heat as HeatLevel | null) ?? null,
    substances: log.substances ?? [],
    alcoholDrinks: log.alcoholDrinks ?? 0,
    stressLevel: log.stress,
    notes: log.notes ?? '',
  };
}

export function partnerEntryToWeekDayLog(entry: PartnerLogData & { date: string }): PartnerWeekDayLog {
  return {
    ...partnerDataToTodayLog(entry, null),
    date: entry.date,
  };
}

export function emptyWeekDayLog(date: string): PartnerWeekDayLog {
  return {
    date,
    sleep: null,
    exercise: null,
    heat: null,
    substances: [],
    alcoholDrinks: 0,
    stress: null,
    notes: null,
    loggedAt: null,
  };
}

export function countLoggedFromTodayLog(log: TodayLog | null): number {
  if (!log) return 0;
  return [
    log.sleep != null,
    log.exercise != null,
    log.heat != null,
    log.substances.length > 0,
    log.stress != null,
    log.notes != null && log.notes.length > 0,
  ].filter(Boolean).length;
}

export function hasAnyPartnerLogToday(log: TodayLog | null): boolean {
  return countLoggedFromTodayLog(log) > 0;
}

export function isCorePartnerLogComplete(log: TodayLog | null): boolean {
  if (!log) return false;
  return (
    log.sleep != null &&
    log.exercise != null &&
    log.heat != null &&
    log.stress != null
  );
}

export function categoryIdFromBentoTarget(
  target: 'sleep' | 'exercise' | 'heat' | 'substances' | 'stress' | 'notes',
): PartnerCategoryId {
  return target;
}
