import type { PartnerBiologicalSex } from '@/store/useUserStore';

export type PartnerPronouns = {
  subject: string;
  subjectCap: string;
  object: string;
  possessive: string;
  feelingPhrase: string;
  askPhrase: string;
};

export function partnerPronouns(
  partnerBiologicalSex: PartnerBiologicalSex | null,
): PartnerPronouns {
  if (partnerBiologicalSex === 'male') {
    return {
      subject: 'he',
      subjectCap: 'He',
      object: 'him',
      possessive: 'his',
      feelingPhrase: "How he's feeling",
      askPhrase: 'Ask him',
    };
  }
  if (partnerBiologicalSex === 'female') {
    return {
      subject: 'she',
      subjectCap: 'She',
      object: 'her',
      possessive: 'her',
      feelingPhrase: "How she's feeling",
      askPhrase: 'Ask her',
    };
  }
  return {
    subject: 'they',
    subjectCap: 'They',
    object: 'them',
    possessive: 'their',
    feelingPhrase: "How they're feeling",
    askPhrase: 'Ask them',
  };
}

/** "Ellie's" or "Alex's" — falls back to "Your partner's" */
export function partnerPossessiveLabel(partnerName: string | null | undefined): string {
  const name = partnerName?.trim();
  if (!name) return "Your partner's";
  if (name.endsWith('s') || name.endsWith('S')) return `${name}'`;
  return `${name}'s`;
}
