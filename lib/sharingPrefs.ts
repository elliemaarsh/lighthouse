import { supabase } from '@/lib/supabase';
import type { SharingPrefs } from '@/types/connect';

const defaults: SharingPrefs = {
  moodShared: false,
  symptomsShared: false,
  cycleShared: false,
};

export async function fetchSharingPrefs(userId: string | null): Promise<SharingPrefs> {
  if (!userId || !supabase) return defaults;
  const { data, error } = await supabase
    .from('sharing_prefs')
    .select('mood_shared, symptoms_shared, cycle_shared')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return defaults;

  return {
    moodShared: !!data.mood_shared,
    symptomsShared: !!data.symptoms_shared,
    cycleShared: !!data.cycle_shared,
  };
}

export async function saveSharingPrefs(
  userId: string | null,
  prefs: SharingPrefs,
): Promise<void> {
  if (!userId || !supabase) return;
  await supabase.from('sharing_prefs').upsert(
    {
      user_id: userId,
      mood_shared: prefs.moodShared,
      symptoms_shared: prefs.symptomsShared,
      cycle_shared: prefs.cycleShared,
    },
    { onConflict: 'user_id' },
  );
}
