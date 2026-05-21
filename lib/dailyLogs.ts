import {
  loadLocalDailyLog,
  saveLocalDailyLog,
} from '@/lib/checkInStorage';
import { getTodayDateString } from '@/lib/date';
import { ensureLocalUserId } from '@/lib/localUserId';
import { supabase } from '@/lib/supabase';
import type { CheckInData, TodayLogSummary } from '@/types/checkIn';

export { getTodayDateString } from '@/lib/date';

type DailyLogRow = {
  period_status: CheckInData['periodStatus'];
  temperature: number | null;
  temp_unit: CheckInData['tempUnit'];
  mood: number | null;
  mood_note: string | null;
  symptoms: string[];
  notes: string | null;
  date: string;
};

function rowToCheckInData(row: DailyLogRow, local?: CheckInData | null): CheckInData {
  return {
    periodStatus: row.period_status ?? null,
    temperature: row.temperature ?? null,
    temperatureNotMeasured:
      local?.temperatureNotMeasured ??
      (row.temperature == null && row.period_status != null),
    tempUnit: row.temp_unit ?? 'F',
    mood: row.mood ?? null,
    moodNote: row.mood_note ?? '',
    symptoms: row.symptoms ?? [],
    notes: row.notes ?? '',
  };
}

export async function fetchDailyLogForToday(
  userId: string | null,
): Promise<{ data: TodayLogSummary | null; error: Error | null }> {
  const uid = userId ?? ensureLocalUserId();
  const date = getTodayDateString();
  const local = await loadLocalDailyLog(uid, date);

  const { data: remote, error } = await supabase
    .from('daily_logs')
    .select(
      'period_status, temperature, temp_unit, mood, mood_note, symptoms, notes, date',
    )
    .eq('user_id', uid)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.warn('[Lighthouse] daily_logs fetch:', error.message);
    return { data: local, error: local ? null : new Error(error.message) };
  }

  if (!remote) {
    return { data: local, error: null };
  }

  const merged: TodayLogSummary = {
    ...rowToCheckInData(remote as DailyLogRow, local ?? undefined),
    date,
  };
  return { data: merged, error: null };
}

export async function saveDailyLog(
  userId: string | null,
  data: CheckInData,
): Promise<{ error: Error | null }> {
  const uid = userId ?? ensureLocalUserId();
  const date = getTodayDateString();

  await saveLocalDailyLog(uid, data, date);

  const payload = {
    user_id: uid,
    date,
    period_status: data.periodStatus,
    temperature: data.temperatureNotMeasured ? null : data.temperature,
    temp_unit: data.tempUnit,
    mood: data.mood,
    mood_note: data.moodNote || null,
    symptoms: data.symptoms,
    notes: data.notes || null,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('daily_logs').upsert(payload, {
    onConflict: 'user_id,date',
  });

  if (error) {
    console.warn('[Lighthouse] daily_logs save (local ok):', error.message);
    return { error: null };
  }

  return { error: null };
}
