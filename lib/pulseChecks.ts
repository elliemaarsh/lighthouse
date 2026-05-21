import { loadLocalPulseCheck, saveLocalPulseCheck } from '@/lib/pulseCheckStorage';
import { ensureLocalUserId } from '@/lib/localUserId';
import { supabase } from '@/lib/supabase';
import { getWeekStartString } from '@/lib/weekStart';
import type { PulseCheckRecord } from '@/types/connect';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/** True if last check-in was more than 7 calendar days ago (or never). */
export function isPulseCheckStale(lastPulseCheckDate: string | null): boolean {
  if (!lastPulseCheckDate) return true;
  const last = new Date(`${lastPulseCheckDate}T12:00:00`);
  const now = new Date();
  const diffDays = (now.getTime() - last.getTime()) / 86_400_000;
  return diffDays > 7;
}

/** Checked in during the current ISO week (Monday–Sunday). */
export function hasPulseCheckThisWeek(lastPulseCheckDate: string | null): boolean {
  if (!lastPulseCheckDate) return false;
  return (
    getWeekStartString(new Date(lastPulseCheckDate)) === getWeekStartString()
  );
}

export function averagePulseScore(
  connectionScore: number,
  capacityScore: number,
): number {
  return Math.round(((connectionScore + capacityScore) / 2) * 10) / 10;
}

export function computeAlignmentScore(
  user: PulseCheckRecord | null,
  partner: PulseCheckRecord | null,
): number | null {
  if (!user || !partner) return null;
  const userAvg = averagePulseScore(user.connectionScore, user.capacityScore);
  const partnerAvg = averagePulseScore(
    partner.connectionScore,
    partner.capacityScore,
  );
  return Math.round(((userAvg + partnerAvg) / 2) * 10) / 10;
}

export function alignmentMessage(score: number): string {
  const rounded = Math.max(1, Math.min(5, Math.round(score)));
  const messages: Record<number, string> = {
    5: "You're beautifully in sync",
    4: 'Really well aligned this week',
    3: 'Some differences — worth a chat',
    2: 'You may be feeling out of sync',
    1: 'Hard week — be gentle with each other',
  };
  return messages[rounded];
}

type PulseRow = {
  user_id: string;
  week_start: string;
  connection_score: number;
  capacity_score?: number;
  emotional_score?: number;
  current_need?: string;
  translated_note?: string | null;
};

function rowToRecord(row: PulseRow): PulseCheckRecord {
  return {
    userId: row.user_id,
    weekStart: row.week_start,
    connectionScore: row.connection_score,
    capacityScore: row.capacity_score ?? row.emotional_score ?? 3,
    currentNeed: row.current_need ?? "Nothing specific — I'm okay",
    translatedNote: row.translated_note ?? null,
  };
}

export async function fetchPulseCheckForWeek(
  userId: string | null,
  weekStart = getWeekStartString(),
): Promise<PulseCheckRecord | null> {
  const uid = userId ?? ensureLocalUserId();
  const local = await loadLocalPulseCheck(uid, weekStart);

  const { data, error } = await supabase
    .from('pulse_checks')
    .select(
      'user_id, week_start, connection_score, capacity_score, emotional_score, current_need, translated_note',
    )
    .eq('user_id', uid)
    .eq('week_start', weekStart)
    .maybeSingle();

  if (error) {
    console.warn('[Lighthouse] pulse_checks fetch:', error.message);
    return local;
  }

  if (!data) return local;
  return rowToRecord(data as PulseRow);
}

export type SavePulseCheckInput = {
  connectionScore: number;
  capacityScore: number;
  currentNeed: string;
  translatedNote: string | null;
  weekStart?: string;
};

export async function savePulseCheck(
  userId: string | null,
  input: SavePulseCheckInput,
): Promise<{ error: Error | null }> {
  const uid = userId ?? ensureLocalUserId();
  const weekStart = input.weekStart ?? getWeekStartString();

  const record: PulseCheckRecord = {
    userId: uid,
    weekStart,
    connectionScore: input.connectionScore,
    capacityScore: input.capacityScore,
    currentNeed: input.currentNeed,
    translatedNote: input.translatedNote,
  };

  await saveLocalPulseCheck(uid, record);

  const payload = {
    user_id: uid,
    week_start: weekStart,
    connection_score: input.connectionScore,
    capacity_score: input.capacityScore,
    current_need: input.currentNeed,
    translated_note: input.translatedNote,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('pulse_checks').upsert(payload, {
    onConflict: 'user_id,week_start',
  });

  if (error) {
    console.warn('[Lighthouse] pulse_checks save (local ok):', error.message);
  }

  return { error: error ? new Error(error.message) : null };
}
