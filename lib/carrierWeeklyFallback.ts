import { getTodayDateString } from '@/lib/date';
import { getWeekDateStrings } from '@/lib/partnerWeek';
import { getWeekStartString } from '@/lib/weekStart';
import type { WeeklyLogEntry } from '@/store/useTrackStore';

const PAST_DAY_TEMPLATES: Omit<WeeklyLogEntry, 'date'>[] = [
  { mood: 3, temperature: 97.2, symptoms: ['Fatigue'], periodStatus: 'no_period' },
  { mood: 2, temperature: 97.3, symptoms: [], periodStatus: 'no_period' },
  { mood: 4, temperature: 97.5, symptoms: ['Bloating'], periodStatus: 'no_period' },
  { mood: 3, temperature: 97.6, symptoms: [], periodStatus: 'no_period' },
  { mood: 4, temperature: 97.7, symptoms: [], periodStatus: 'no_period' },
  { mood: 5, temperature: 97.8, symptoms: [], periodStatus: 'no_period' },
];

/** Local week rows when Supabase has no data — today stays empty. */
export function buildFallbackWeeklyLogs(): WeeklyLogEntry[] {
  const today = getTodayDateString();
  const weekStart = getWeekStartString();
  const dates = getWeekDateStrings(weekStart);

  let templateIdx = 0;

  return dates.map((date) => {
    if (date === today) {
      return {
        date,
        mood: null,
        temperature: null,
        symptoms: [],
        periodStatus: null,
      };
    }

    const template =
      PAST_DAY_TEMPLATES[templateIdx % PAST_DAY_TEMPLATES.length] ??
      PAST_DAY_TEMPLATES[0]!;
    templateIdx += 1;

    return {
      date,
      ...template,
    };
  });
}
