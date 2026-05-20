import { supabase } from '@/lib/supabase';
import type { PartnerLogData } from '@/types/partnerLog';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function fetchPartnerLogForToday(
  userId: string | null,
): Promise<{ data: PartnerLogData | null; error: Error | null }> {
  if (!userId) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('partner_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', getTodayDateString())
    .maybeSingle();

  if (error) {
    console.error('[Lighthouse] Failed to fetch partner log:', error.message);
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return {
    data: {
      sleepHours: data.sleep_hours ?? null,
      sleepMinutes: data.sleep_minutes ?? null,
      exerciseActive: data.exercise_active ?? null,
      exerciseMinutes: data.exercise_minutes ?? null,
      exerciseTypes: data.exercise_types ?? [],
      heatLevel: data.heat_level ?? null,
      substances: data.substances ?? [],
      alcoholDrinks: data.alcohol_drinks ?? null,
      stressLevel: data.stress_level ?? null,
      notes: data.notes ?? '',
    },
    error: null,
  };
}

export async function savePartnerLog(
  userId: string | null,
  data: PartnerLogData,
): Promise<{ error: Error | null }> {
  const payload = {
    user_id: userId,
    date: getTodayDateString(),
    sleep_hours: data.sleepHours,
    sleep_minutes: data.sleepMinutes,
    exercise_active: data.exerciseActive,
    exercise_minutes: data.exerciseMinutes,
    exercise_types: data.exerciseTypes,
    heat_level: data.heatLevel,
    substances: data.substances,
    alcohol_drinks: data.alcoholDrinks,
    stress_level: data.stressLevel,
    notes: data.notes || null,
  };

  const { error } = await supabase.from('partner_logs').upsert(payload, {
    onConflict: 'user_id,date',
  });

  if (error) {
    console.error('[Lighthouse] Failed to save partner log:', error.message);
    return { error: new Error(error.message) };
  }

  return { error: null };
}
