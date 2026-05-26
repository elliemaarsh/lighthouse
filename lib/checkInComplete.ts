import type { CheckInData } from '@/types/checkIn';

/** One snapshot per check-in completion (avoids Strict Mode double-save wiping data). */
let completionSnapshot: CheckInData | null = null;

export function stashCheckInCompletionSnapshot(data: CheckInData): CheckInData {
  completionSnapshot = data;
  return data;
}

export function takeCheckInCompletionSnapshot(): CheckInData | null {
  const snapshot = completionSnapshot;
  completionSnapshot = null;
  return snapshot;
}

export function clearCheckInCompletionSnapshot(): void {
  completionSnapshot = null;
}
