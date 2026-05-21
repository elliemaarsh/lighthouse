import { supabase } from '@/lib/supabase';
import type { IvfPhaseId, IvfStatus } from '@/types/connect';

export async function fetchIvfStatus(userId: string | null): Promise<IvfStatus | null> {
  if (!userId || !supabase) return null;
  const { data, error } = await supabase
    .from('ivf_status')
    .select('current_phase, phase_start_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    currentPhase: data.current_phase as IvfPhaseId,
    phaseStartDate: data.phase_start_date,
  };
}

export async function saveIvfStatus(
  userId: string | null,
  currentPhase: IvfPhaseId,
): Promise<void> {
  if (!userId || !supabase) return;
  const today = new Date().toISOString().slice(0, 10);
  await supabase.from('ivf_status').upsert(
    {
      user_id: userId,
      current_phase: currentPhase,
      phase_start_date: today,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
}
