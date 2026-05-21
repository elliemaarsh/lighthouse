import { moodLabel } from '@/constants/mood';
import type { PartnerPronouns } from '@/lib/partnerPronouns';
import type { TodayLogSummary } from '@/types/checkIn';

export type PartnerFeelingDisplay = {
  value: string;
  subtitle: string;
  isEmpty: boolean;
};

function hasntCheckedInSubtitle(pronouns: PartnerPronouns): string {
  if (pronouns.subject === 'they') {
    return "They haven't checked in today";
  }
  return `${pronouns.subjectCap} hasn't checked in today`;
}

export function partnerFeelingFromLog(
  log: TodayLogSummary | null,
  pronouns: PartnerPronouns,
): PartnerFeelingDisplay {
  const label = moodLabel(log?.mood ?? null);

  if (!label) {
    return {
      value: 'Check in',
      subtitle: hasntCheckedInSubtitle(pronouns),
      isEmpty: true,
    };
  }

  const note = log?.moodNote?.trim();
  return {
    value: label,
    subtitle: note || `${log!.mood}/5 today`,
    isEmpty: false,
  };
}
