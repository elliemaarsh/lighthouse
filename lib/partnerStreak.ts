import { supabase } from '@/lib/supabase';

/** Consecutive calendar days with a partner log (including today if logged). */
export async function fetchPartnerStreak(userId: string | null): Promise<number> {
  if (!userId || !supabase) return 0;

  const { data, error } = await supabase
    .from('partner_logs')
    .select('date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(60);

  if (error || !data?.length) return 0;

  const dates = new Set(data.map((row) => row.date as string));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!dates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
