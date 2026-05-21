import AsyncStorage from '@react-native-async-storage/async-storage';

import { getWeekStartString } from '@/lib/weekStart';
import { isClient } from '@/lib/storage';
import type { PulseCheckRecord } from '@/types/connect';

const pulseKey = (userId: string, weekStart: string) =>
  `lighthouse:pulse:${userId}:${weekStart}`;

export async function loadLocalPulseCheck(
  userId: string,
  weekStart = getWeekStartString(),
): Promise<PulseCheckRecord | null> {
  if (!isClient) return null;
  const raw = await AsyncStorage.getItem(pulseKey(userId, weekStart));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PulseCheckRecord;
  } catch {
    return null;
  }
}

export async function saveLocalPulseCheck(
  userId: string,
  record: PulseCheckRecord,
): Promise<void> {
  if (!isClient) return;
  await AsyncStorage.setItem(
    pulseKey(userId, record.weekStart),
    JSON.stringify(record),
  );
}
