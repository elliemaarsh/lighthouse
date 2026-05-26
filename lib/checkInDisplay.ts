import type { PeriodStatus } from '@/types/checkIn';

const PERIOD_LABELS: Record<NonNullable<PeriodStatus>, string> = {
  period_started: 'Started',
  period_ongoing: 'Ongoing',
  period_ended: 'Ended',
  no_period: 'None',
};

const MOOD_LABELS = ['', 'Low', 'Meh', 'Okay', 'Good', 'Great'] as const;

export function formatPeriodStatus(status: PeriodStatus | null): string {
  if (!status) return '—';
  return PERIOD_LABELS[status] ?? '—';
}

export function formatMoodLabel(mood: number | null): string | null {
  if (mood == null || mood < 1 || mood > 5) return null;
  return MOOD_LABELS[mood] ?? null;
}

export function formatSymptomsSummary(symptoms: string[] | null | undefined): {
  kind: 'dash' | 'none' | 'single' | 'count';
  text: string;
} {
  if (symptoms == null) {
    return { kind: 'dash', text: '—' };
  }
  if (symptoms.length === 0) {
    return { kind: 'none', text: 'None' };
  }
  if (symptoms.length === 1) {
    return { kind: 'single', text: symptoms[0] };
  }
  return { kind: 'count', text: `${symptoms.length} logged` };
}

export function formatNotesPreview(notes: string | null | undefined): string {
  if (!notes?.trim()) return 'No notes';
  const trimmed = notes.trim();
  if (trimmed.length <= 60) return trimmed;
  return `${trimmed.slice(0, 60)}…`;
}
