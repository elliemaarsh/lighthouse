import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';

export async function saveUserProfileToSupabase(): Promise<void> {
  const state = useUserStore.getState();
  if (!supabase) return;

  const payload = {
    user_id: state.userId,
    name: state.name,
    age: state.age,
    birth_date: state.birthDate,
    biological_sex: state.biologicalSex,
    partner_biological_sex: state.partnerBiologicalSex,
    partner_name: state.partnerName,
    relationship_structure: state.relationshipStructure,
    role: state.role,
    goals: state.goals,
    journey_type: state.journeyType,
    ivf_status: state.ivfStatus,
    natural_cycle_tracking: state.naturalCycleTracking,
    birth_control: state.birthControl,
    fertility_history: state.fertilityHistory,
    updated_at: new Date().toISOString(),
  };

  if (state.userId) {
    await supabase.from('user_profiles').upsert(payload, { onConflict: 'user_id' });
  } else {
    await supabase.from('user_profiles').insert(payload);
  }
}
