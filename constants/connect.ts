import type { AppointmentType, IvfPhaseId } from '@/types/connect';

export const PULSE_CONNECTION_OPTIONS = [
  { value: 1, label: 'Distant' },
  { value: 2, label: 'A little apart' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Close' },
  { value: 5, label: 'Very connected' },
] as const;

export const PULSE_EMOTIONAL_OPTIONS = [
  { value: 1, label: 'Struggling' },
  { value: 2, label: 'Hard' },
  { value: 3, label: 'Managing' },
  { value: 4, label: 'Okay' },
  { value: 5, label: 'Good' },
] as const;

export const ALIGNMENT_MESSAGES: Record<number, string> = {
  5: "You're beautifully in sync",
  4: 'Really well aligned this week',
  3: 'Some differences — worth a chat',
  2: 'You may be feeling out of sync',
  1: 'Hard week — be gentle with each other',
};

export const PULSE_CONFIRMATION_BY_SCORE = {
  low: 'It takes courage to be honest. Be gentle with yourself this week.',
  mid: "You're navigating something hard. That's enough.",
  high: "You're showing up. That matters.",
} as const;

export const APPOINTMENT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'scan', label: 'Scan' },
  { value: 'blood', label: 'Blood test' },
  { value: 'ivf', label: 'IVF procedure' },
  { value: 'other', label: 'Other' },
];

export const IVF_PHASES: {
  id: IvfPhaseId;
  title: string;
  duration: string;
  description: string;
  tags: string[];
}[] = [
  {
    id: 'stimulation',
    title: 'Stimulation',
    duration: '~10–14 days',
    description:
      'Daily hormone injections to stimulate egg production. Regular monitoring scans.',
    tags: ['Injections', 'Mood changes', 'Bloating'],
  },
  {
    id: 'retrieval',
    title: 'Egg Retrieval',
    duration: '1 day procedure',
    description:
      'A short procedure under sedation to collect mature eggs. Rest is important after.',
    tags: ['Sedation', 'Rest needed', 'Results in 24h'],
  },
  {
    id: 'transfer',
    title: 'Transfer',
    duration: '1 day procedure',
    description:
      'One or more embryos are transferred. The two-week wait begins today.',
    tags: ['Quick procedure', 'Two-week wait', 'Rest'],
  },
  {
    id: 'two-week-wait',
    title: 'Two-Week Wait',
    duration: '~14 days',
    description:
      'The most emotionally challenging phase. Try to rest, stay gentle with yourself, and lean on each other.',
    tags: ['Testing time', 'Be kind to yourself'],
  },
];

/** Carrying partner — ways to care for yourself and invite support */
export const SUPPORT_PLACEHOLDERS_CARRYING = [
  "Tell your partner one thing that would help you feel supported today.",
  "It's okay to rest tonight — you don't have to push through.",
  "Send a quick note when you're having a hard moment. They want to know.",
  'Plan a quiet evening with no expectations.',
] as const;

/** Non-carrying partner — ways to show up for your partner */
export const SUPPORT_PLACEHOLDERS_NON_CARRYING = [
  'Ask how your partner is feeling before sharing your day.',
  'Offer to handle a chore tonight so they can rest.',
  'Send a short message of encouragement before their appointment.',
  'Plan something low-key together this weekend.',
] as const;
