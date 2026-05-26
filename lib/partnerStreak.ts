import { DEFAULT_PARTNER_DAILY_STREAK } from '@/constants/partner';
import { fetchLocalPartnerStreak } from '@/lib/checkInStorage';
import { ensureLocalUserId } from '@/lib/localUserId';
import { supabase } from '@/lib/supabase';

/** Consecutive calendar days with a partner log (including today if logged). */
export async function fetchPartnerStreak(userId: string | null): Promise<number> {
  const uid = userId ?? ensureLocalUserId();
  const localStreak = await fetchLocalPartnerStreak(uid);

  const { data, error } = await supabase
    .from('partner_logs')
    .select('date')
    .eq('user_id', uid)
    .order('date', { ascending: false })
    .limit(60);

  if (error || !data?.length) {
    return Math.max(localStreak, DEFAULT_PARTNER_DAILY_STREAK);
  }

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

  return Math.max(streak, localStreak, DEFAULT_PARTNER_DAILY_STREAK);
}
