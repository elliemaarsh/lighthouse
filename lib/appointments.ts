import { supabase } from '@/lib/supabase';
import type { Appointment, AppointmentType } from '@/types/connect';

type AppointmentRow = {
  id: string;
  user_id: string;
  partner_id: string | null;
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  type: string;
  notes: string | null;
  shared: boolean;
};

function mapRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    userId: row.user_id,
    partnerId: row.partner_id,
    title: row.title,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    type: row.type as AppointmentType,
    notes: row.notes ?? '',
    shared: row.shared,
  };
}

export async function fetchAppointments(userId: string | null): Promise<Appointment[]> {
  if (!userId || !supabase) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapRow(row as AppointmentRow));
}

export async function saveAppointment(
  userId: string | null,
  payload: Omit<Appointment, 'id' | 'userId'> & { id?: string },
): Promise<void> {
  if (!userId || !supabase) return;
  await supabase.from('appointments').upsert({
    id: payload.id,
    user_id: userId,
    partner_id: payload.partnerId,
    title: payload.title,
    date: payload.date,
    start_time: payload.startTime,
    end_time: payload.endTime,
    type: payload.type,
    notes: payload.notes,
    shared: payload.shared,
  });
}
