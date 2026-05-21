import AsyncStorage from '@react-native-async-storage/async-storage';

import { getTodayDateString } from '@/lib/date';
import { isClient } from '@/lib/storage';
import type { CheckInData, TodayLogSummary } from '@/types/checkIn';
import type { PartnerLogData } from '@/types/partnerLog';

const dailyKey = (userId: string, date: string) =>
  `lighthouse:daily:${userId}:${date}`;
const partnerKey = (userId: string, date: string) =>
  `lighthouse:partner:${userId}:${date}`;
const partnerDatesKey = (userId: string) => `lighthouse:partner-dates:${userId}`;

export async function loadLocalDailyLog(
  userId: string,
  date = getTodayDateString(),
): Promise<TodayLogSummary | null> {
  if (!isClient) return null;
  const raw = await AsyncStorage.getItem(dailyKey(userId, date));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TodayLogSummary;
  } catch {
    return null;
  }
}

export async function saveLocalDailyLog(
  userId: string,
  data: CheckInData,
  date = getTodayDateString(),
): Promise<void> {
  if (!isClient) return;
  const payload: TodayLogSummary = { ...data, date };
  await AsyncStorage.setItem(dailyKey(userId, date), JSON.stringify(payload));
}

export async function loadLocalPartnerLog(
  userId: string,
  date = getTodayDateString(),
): Promise<PartnerLogData | null> {
  if (!isClient) return null;
  const raw = await AsyncStorage.getItem(partnerKey(userId, date));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PartnerLogData;
  } catch {
    return null;
  }
}

export async function saveLocalPartnerLog(
  userId: string,
  data: PartnerLogData,
  date = getTodayDateString(),
): Promise<void> {
  if (!isClient) return;
  await AsyncStorage.setItem(partnerKey(userId, date), JSON.stringify(data));
}

export async function touchPartnerLogDate(
  userId: string,
  date = getTodayDateString(),
): Promise<void> {
  if (!isClient) return;
  const key = partnerDatesKey(userId);
  const raw = await AsyncStorage.getItem(key);
  const dates: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!dates.includes(date)) {
    dates.push(date);
    dates.sort();
    await AsyncStorage.setItem(key, JSON.stringify(dates));
  }
}

export async function fetchLocalPartnerStreak(userId: string): Promise<number> {
  if (!isClient) return 0;
  const raw = await AsyncStorage.getItem(partnerDatesKey(userId));
  if (!raw) return 0;

  let dates: string[];
  try {
    dates = JSON.parse(raw) as string[];
  } catch {
    return 0;
  }

  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
