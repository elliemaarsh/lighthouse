export const MOOD_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Meh',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export function moodLabel(level: number | null | undefined): string | null {
  if (level == null || level < 1 || level > 5) return null;
  return MOOD_LABELS[level] ?? null;
}
