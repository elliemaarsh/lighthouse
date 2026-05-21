import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchDailyLogForToday } from '@/lib/dailyLogs';
import { isClient } from '@/lib/storage';
import type { TodayLogSummary } from '@/types/checkIn';

const SHARED_CARRYING_LOG_KEY = 'lighthouse:carrying-partner-shared-log';

/** Mirror carrying partner's daily check-in for the non-carrying home screen (local dev). */
export async function publishCarryingPartnerSharedLog(
  log: TodayLogSummary,
): Promise<void> {
  if (!isClient) return;
  await AsyncStorage.setItem(SHARED_CARRYING_LOG_KEY, JSON.stringify(log));
}

export async function fetchCarryingPartnerSharedLog(): Promise<TodayLogSummary | null> {
  if (!isClient) return null;
  const raw = await AsyncStorage.getItem(SHARED_CARRYING_LOG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TodayLogSummary;
  } catch {
    return null;
  }
}

/** Partner daily check-in: linked user id first, then local mirror. */
export async function fetchPartnerDailyCheckIn(
  partnerUserId: string | null,
): Promise<TodayLogSummary | null> {
  if (partnerUserId) {
    const { data } = await fetchDailyLogForToday(partnerUserId);
    if (data) return data;
  }
  return fetchCarryingPartnerSharedLog();
}
