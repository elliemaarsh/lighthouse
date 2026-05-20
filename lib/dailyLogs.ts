import { supabase } from '@/lib/supabase';
import type { CheckInData } from '@/types/checkIn';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function saveDailyLog(
  userId: string | null,
  data: CheckInData,
): Promise<{ error: Error | null }> {
  const payload = {
    user_id: userId,
    date: getTodayDateString(),
    period_status: data.periodStatus,
    temperature: data.temperature,
    temp_unit: data.tempUnit,
    mood: data.mood,
    mood_note: data.moodNote || null,
    symptoms: data.symptoms,
    notes: data.notes || null,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('daily_logs').insert(payload);

  if (error) {
    console.error('[Lighthouse] Failed to save daily log:', error.message);
    return { error: new Error(error.message) };
  }

  return { error: null };
}
