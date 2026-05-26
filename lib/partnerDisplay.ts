import { STRESS_LEVELS } from '@/constants/partner';
import { colors } from '@/constants/theme';
import type { HeatLevel, PartnerCategoryId, PartnerLogData } from '@/types/partnerLog';

/** First name for copy — falls back to "your partner" when unknown */
export function partnerFirstName(
  partnerName: string | null | undefined,
  partnerEmail?: string,
): string {
  const trimmed = partnerName?.trim();
  if (trimmed) return trimmed;

  const email = partnerEmail?.trim();
  if (email) {
    const local = email.split('@')[0]?.trim();
    if (local) {
      const first = local.split(/[._-]/)[0] ?? local;
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
  }

  return 'your partner';
}

export function isCategoryLogged(id: PartnerCategoryId, log: PartnerLogData): boolean {
  switch (id) {
    case 'sleep':
      return log.sleepHours != null;
    case 'exercise':
      return log.exerciseActive != null;
    case 'heat':
      return log.heatLevel != null;
    case 'substances':
      return log.substances.length > 0;
    case 'stress':
      return log.stressLevel != null;
    case 'notes':
      return log.notes.trim().length > 0;
    default:
      return false;
  }
}

export function countLoggedCategories(log: PartnerLogData): number {
  const ids: PartnerCategoryId[] = [
    'sleep',
    'exercise',
    'heat',
    'substances',
    'stress',
    'notes',
  ];
  return ids.filter((id) => isCategoryLogged(id, log)).length;
}

export function formatSleepValue(log: PartnerLogData): string {
  if (log.sleepHours == null) return '—';
  const h = Math.floor(log.sleepHours);
  const m = log.sleepMinutes ?? Math.round((log.sleepHours - h) * 60);
  return `${h}h ${m}m`;
}

export function formatHeatValue(log: PartnerLogData): {
  text: string;
  color: string;
} {
  if (!log.heatLevel) {
    return { text: '—', color: colors.textOnDark };
  }
  const label = log.heatLevel.charAt(0).toUpperCase() + log.heatLevel.slice(1);
  const color =
    log.heatLevel === 'low'
      ? colors.heatLow
      : log.heatLevel === 'medium'
        ? colors.heatMedium
        : colors.heatHigh;
  return { text: label, color };
}

export function formatSubstancesValue(log: PartnerLogData): {
  text: string;
  color: string;
} {
  if (!log.substances.length) {
    return { text: '—', color: colors.textOnDark };
  }
  if (log.substances.includes('None')) {
    return { text: 'None', color: colors.substancesNone };
  }
  const filtered = log.substances.filter((s) => s !== 'None');
  if (filtered.length <= 2) {
    return { text: filtered.join(', '), color: colors.textOnDark };
  }
  return { text: `${filtered.length} logged`, color: colors.textOnDark };
}

export function formatStressValue(log: PartnerLogData): string {
  if (log.stressLevel == null) return '—';
  const meta = STRESS_LEVELS.find((s) => s.level === log.stressLevel);
  return meta ? `${log.stressLevel} — ${meta.label}` : String(log.stressLevel);
}

export function formatNotesValue(log: PartnerLogData): string {
  const trimmed = log.notes.trim();
  return trimmed.length ? trimmed : 'No notes';
}

export function heatLevelTitle(level: HeatLevel): string {
  switch (level) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
  }
}
