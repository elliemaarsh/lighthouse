import { getTodayDateString } from '@/lib/date';
import { supabase } from '@/lib/supabase';
import type { PeriodStatus } from '@/types/checkIn';

export async function seedDailyLogsIfEmpty(userId: string): Promise<void> {
  if (!userId) return;

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const from = sevenDaysAgo.toISOString().split('T')[0];

  const { count, error: countError } = await supabase
    .from('daily_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('date', from);

  if (countError) {
    console.warn('[Lighthouse] daily_logs seed count:', countError.message);
    return;
  }

  if (count && count > 0) return;

  const logs: Record<string, unknown>[] = [];

  for (let i = 6; i >= 1; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (dateStr === getTodayDateString()) continue;

    const cycleDay = 14 - i;
    const baseTemp = 97.2;
    const tempVariance = (cycleDay / 14) * 0.8;
    const temperature = parseFloat(
      (baseTemp + tempVariance + (Math.random() * 0.2 - 0.1)).toFixed(1),
    );

    const moodOptions = cycleDay < 10 ? [2, 3, 3, 4] : [3, 4, 4, 5];
    const mood = moodOptions[Math.floor(Math.random() * moodOptions.length)];

    const periodStatus: PeriodStatus =
      cycleDay <= 5 ? 'period_ongoing' : 'no_period';

    const follicularSymptoms: string[][] = [[], [], ['Fatigue'], ['Bloating'], []];
    const symptoms =
      follicularSymptoms[Math.floor(Math.random() * follicularSymptoms.length)]!;

    logs.push({
      user_id: userId,
      date: dateStr,
      period_status: periodStatus,
      temperature,
      temp_unit: 'F',
      mood,
      mood_note: null,
      symptoms,
      notes: null,
      created_at: new Date().toISOString(),
    });
  }

  if (logs.length === 0) return;

  const { error } = await supabase.from('daily_logs').insert(logs);
  if (error) {
    console.warn('[Lighthouse] daily_logs seed insert:', error.message);
    return;
  }

  console.log('[Lighthouse] Seeded', logs.length, 'days of daily log data');
}
