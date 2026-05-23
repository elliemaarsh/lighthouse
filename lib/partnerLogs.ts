import {
  loadLocalPartnerLog,
  saveLocalPartnerLog,
  touchPartnerLogDate,
} from '@/lib/checkInStorage';
import { getTodayDateString } from '@/lib/date';
import { ensureLocalUserId } from '@/lib/localUserId';
import { countLoggedCategories } from '@/lib/partnerDisplay';
import { supabase } from '@/lib/supabase';
import type { PartnerLogData } from '@/types/partnerLog';

export { getTodayDateString } from '@/lib/date';

/** Combine remote row with local AsyncStorage — on-device log wins when both exist. */
export function mergePartnerLogs(
  local: PartnerLogData | null,
  remote: PartnerLogData,
): PartnerLogData {
  if (!local) return remote;
  return {
    sleepHours: local.sleepHours ?? remote.sleepHours,
    sleepMinutes: local.sleepMinutes ?? remote.sleepMinutes,
    exerciseActive: local.exerciseActive ?? remote.exerciseActive,
    exerciseMinutes: local.exerciseMinutes ?? remote.exerciseMinutes,
    exerciseTypes: local.exerciseTypes.length ? local.exerciseTypes : remote.exerciseTypes,
    heatLevel: local.heatLevel ?? remote.heatLevel,
    substances: local.substances.length ? local.substances : remote.substances,
    alcoholDrinks: local.alcoholDrinks ?? remote.alcoholDrinks,
    stressLevel: local.stressLevel ?? remote.stressLevel,
    notes: local.notes.trim() ? local.notes : remote.notes,
  };
}

function rowToPartnerLog(row: Record<string, unknown>): PartnerLogData {
  return {
    sleepHours: (row.sleep_hours as number | null) ?? null,
    sleepMinutes: (row.sleep_minutes as number | null) ?? null,
    exerciseActive: (row.exercise_active as boolean | null) ?? null,
    exerciseMinutes: (row.exercise_minutes as number | null) ?? null,
    exerciseTypes: (row.exercise_types as string[]) ?? [],
    heatLevel: (row.heat_level as PartnerLogData['heatLevel']) ?? null,
    substances: (row.substances as string[]) ?? [],
    alcoholDrinks: (row.alcohol_drinks as number | null) ?? null,
    stressLevel: (row.stress_level as number | null) ?? null,
    notes: (row.notes as string) ?? '',
  };
}

export async function fetchPartnerLogForToday(
  userId: string | null,
): Promise<{ data: PartnerLogData | null; error: Error | null }> {
  const uid = userId ?? ensureLocalUserId();
  const date = getTodayDateString();
  const local = await loadLocalPartnerLog(uid, date);

  const { data, error } = await supabase
    .from('partner_logs')
    .select('*')
    .eq('user_id', uid)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.warn('[Lighthouse] partner_logs fetch:', error.message);
    return { data: local, error: local ? null : new Error(error.message) };
  }

  if (!data) {
    return { data: local, error: null };
  }

  return { data: mergePartnerLogs(local, rowToPartnerLog(data)), error: null };
}

export async function savePartnerLog(
  userId: string | null,
  data: PartnerLogData,
): Promise<{ error: Error | null }> {
  const uid = userId ?? ensureLocalUserId();
  const date = getTodayDateString();

  await saveLocalPartnerLog(uid, data, date);
  if (countLoggedCategories(data) > 0) {
    await touchPartnerLogDate(uid, date);
  }

  const payload = {
    user_id: uid,
    date,
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
    console.warn('[Lighthouse] partner_logs save (local ok):', error.message);
    return { error: null };
  }

  return { error: null };
}
