export const PULSE_NEED_OPTIONS = [
  'Space and quiet',
  'To feel seen and heard',
  'Practical help',
  'Physical closeness',
  "Just to know you're there",
  "Nothing specific — I'm okay",
] as const;

export type PulseNeedOption = (typeof PULSE_NEED_OPTIONS)[number];

export const PULSE_SCORE_VALUES = [1, 2, 3, 4, 5] as const;

export const PULSE_CONNECTION_LABELS: Record<number, string> = {
  1: 'Distant',
  2: 'A little distant',
  3: 'Somewhere in between',
  4: 'Close',
  5: 'Really close',
};

export const PULSE_CAPACITY_LABELS: Record<number, string> = {
  1: 'Running on empty',
  2: 'Running low',
  3: 'About half full',
  4: 'Mostly full',
  5: "I've got enough",
};

export const PULSE_TRANSLATE_SYSTEM_PROMPT = `You are a compassionate relationship companion for couples navigating fertility challenges. Your job is to translate a private note from one partner into a gentle, actionable suggestion for their partner to receive.

Rules:
- Never quote the original note directly
- Remove any frustration, heat, or overwhelm from the tone — translate the emotion into a need
- Keep it to 2-3 sentences maximum
- Frame it as something the receiving partner can actually do or feel
- Start with 'Your partner...' or 'This week, [name]...'
- Never be clinical or cold
- If the note is empty or very short, generate a suggestion based on their Q3 need selection and scores instead
- Tone: warm, human, like a wise friend`;
