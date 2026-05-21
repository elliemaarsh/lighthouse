import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadLocalDailyLog, loadLocalPartnerLog } from '@/lib/checkInStorage';
import { ensureLocalUserId } from '@/lib/localUserId';
import { isClient } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import type { TodayLogSummary } from '@/types/checkIn';
import type { PartnerLogData } from '@/types/partnerLog';

export type DailyLogEntry = TodayLogSummary;
export type PartnerLogEntry = PartnerLogData & { date: string };

function inRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

export async function fetchDailyLogsInRange(
  userId: string | null,
  from: string,
  to: string,
): Promise<DailyLogEntry[]> {
  const uid = userId ?? ensureLocalUserId();
  const byDate = new Map<string, DailyLogEntry>();

  const { data: remote, error } = await supabase
    .from('daily_logs')
    .select(
      'date, period_status, temperature, temp_unit, mood, mood_note, symptoms, notes',
    )
    .eq('user_id', uid)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });

  if (!error && remote) {
    for (const row of remote) {
      const date = row.date as string;
      byDate.set(date, {
        date,
        periodStatus: row.period_status ?? null,
        temperature: row.temperature ?? null,
        temperatureNotMeasured: row.temperature == null,
        tempUnit: (row.temp_unit as 'F' | 'C') ?? 'F',
        mood: row.mood ?? null,
        moodNote: row.mood_note ?? '',
        symptoms: (row.symptoms as string[]) ?? [],
        notes: row.notes ?? '',
      });
    }
  }

  if (isClient) {
    const allKeys = await AsyncStorage.getAllKeys();
    const prefix = `lighthouse:daily:${uid}:`;
    for (const key of allKeys) {
      if (!key.startsWith(prefix)) continue;
      const date = key.slice(prefix.length);
      if (!inRange(date, from, to)) continue;
      const local = await loadLocalDailyLog(uid, date);
      if (local) byDate.set(date, local);
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, log]) => log);
}

export async function fetchPartnerLogsInRange(
  userId: string | null,
  from: string,
  to: string,
): Promise<PartnerLogEntry[]> {
  const uid = userId ?? ensureLocalUserId();
  const byDate = new Map<string, PartnerLogEntry>();

  const { data: remote, error } = await supabase
    .from('partner_logs')
    .select('*')
    .eq('user_id', uid)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });

  if (!error && remote) {
    for (const row of remote) {
      const date = row.date as string;
      byDate.set(date, {
        date,
        sleepHours: row.sleep_hours ?? null,
        sleepMinutes: row.sleep_minutes ?? null,
        exerciseActive: row.exercise_active ?? null,
        exerciseMinutes: row.exercise_minutes ?? null,
        exerciseTypes: row.exercise_types ?? [],
        heatLevel: row.heat_level ?? null,
        substances: row.substances ?? [],
        alcoholDrinks: row.alcohol_drinks ?? null,
        stressLevel: row.stress_level ?? null,
        notes: row.notes ?? '',
      });
    }
  }

  if (isClient) {
    const allKeys = await AsyncStorage.getAllKeys();
    const prefix = `lighthouse:partner:${uid}:`;
    for (const key of allKeys) {
      if (!key.startsWith(prefix)) continue;
      const date = key.slice(prefix.length);
      if (!inRange(date, from, to)) continue;
      const local = await loadLocalPartnerLog(uid, date);
      if (local) byDate.set(date, { ...local, date });
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, log]) => log);
}
