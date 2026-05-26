import { getTodayDateString } from '@/lib/date';
import { partnerEntryToWeekDayLog } from '@/lib/partnerLogMappers';
import { supabase } from '@/lib/supabase';
import type { PartnerWeekDayLog } from '@/types/partnerLogStore';
import type { HeatLevel } from '@/types/partnerLog';

const HEAT_LEVELS: HeatLevel[] = ['low', 'low', 'low', 'medium'];

function buildSeedRow(userId: string, dateStr: string) {
  const date = new Date(`${dateStr}T12:00:00`);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const exerciseActive = isWeekend ? Math.random() > 0.6 : Math.random() > 0.3;
  const exerciseMinutes = exerciseActive
    ? isWeekend
      ? [0, 30, 45][Math.floor(Math.random() * 3)]!
      : [30, 45, 60][Math.floor(Math.random() * 3)]!
    : 0;

  return {
    user_id: userId,
    date: dateStr,
    sleep_hours: isWeekend
      ? Math.floor(Math.random() * 2) + 7
      : Math.floor(Math.random() * 2) + 6,
    sleep_minutes: [0, 15, 30, 45][Math.floor(Math.random() * 4)],
    exercise_active: exerciseActive,
    exercise_minutes: exerciseMinutes,
    exercise_types: exerciseActive
      ? isWeekend
        ? ['Walking']
        : Math.random() > 0.5
          ? ['Gym']
          : ['Running']
      : [],
    heat_level: HEAT_LEVELS[Math.floor(Math.random() * HEAT_LEVELS.length)],
    substances: Math.random() > 0.7 ? ['Caffeine (3+ cups)'] : [],
    alcohol_drinks: Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0,
    stress_level:
      dayOfWeek >= 2 && dayOfWeek <= 4
        ? Math.floor(Math.random() * 2) + 2
        : Math.floor(Math.random() * 2) + 1,
    notes: null,
    created_at: new Date().toISOString(),
  };
}

/** Inserts 6 prior days of demo partner logs when the last week is empty. */
export async function seedPartnerLogsIfEmpty(
  userId: string,
): Promise<PartnerWeekDayLog[]> {
  if (!userId) return [];

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const from = sevenDaysAgo.toISOString().split('T')[0];

  const { count, error: countError } = await supabase
    .from('partner_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('date', from);

  if (countError) {
    console.warn('[Lighthouse] partner_logs seed count:', countError.message);
    return [];
  }

  if (count && count > 0) return [];

  const rows = [];
  for (let i = 6; i >= 1; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (dateStr === getTodayDateString()) continue;
    rows.push(buildSeedRow(userId, dateStr));
  }

  if (rows.length === 0) return [];

  const { error } = await supabase.from('partner_logs').insert(rows);
  if (error) {
    console.warn('[Lighthouse] partner_logs seed insert:', error.message);
    return [];
  }

  console.log('[Lighthouse] Seeded', rows.length, 'days of partner log data');

  return rows.map((row) =>
    partnerEntryToWeekDayLog({
      date: row.date as string,
      sleepHours: row.sleep_hours as number,
      sleepMinutes: row.sleep_minutes as number,
      exerciseActive: row.exercise_active as boolean,
      exerciseMinutes: row.exercise_minutes as number,
      exerciseTypes: row.exercise_types as string[],
      heatLevel: row.heat_level as HeatLevel,
      substances: row.substances as string[],
      alcoholDrinks: row.alcohol_drinks as number,
      stressLevel: row.stress_level as number,
      notes: '',
    }),
  );
}
