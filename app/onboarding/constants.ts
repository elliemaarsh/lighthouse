import type { BiologicalSex } from '@/store/useUserStore';

export const SOLO_JOURNEY_LABEL = 'Solo journey';

export const RELATIONSHIP_OPTIONS = [
  { title: 'In a couple', subtext: "I'm doing this with my partner" },
  { title: 'Same-sex couple', subtext: 'We may have different needs' },
  { title: SOLO_JOURNEY_LABEL, subtext: "I'm navigating this on my own" },
  {
    title: 'Non-traditional structure',
    subtext: 'Co-parenting, donor, surrogate, etc.',
  },
] as const;

export const BIOLOGICAL_SEX_OPTIONS: BiologicalSex[] = [
  'female',
  'male',
  'intersex',
  'prefer not to say',
];

export function formatBiologicalSex(value: BiologicalSex): string {
  if (value === 'prefer not to say') return 'Prefer not to say';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const AGE_QUICK_OPTIONS = [
  { label: 'Under 25', value: 22 },
  { label: '25–30', value: 27 },
  { label: '31–35', value: 33 },
  { label: '36–40', value: 38 },
  { label: '40+', value: 42 },
] as const;

export const ROLE_OPTIONS = [
  {
    title: 'Carrying partner',
    subtext: "I'll be pregnant / carry the baby",
    value: 'carrying' as const,
    accent: '#C9A99A',
  },
  {
    title: 'Non-carrying partner',
    subtext: "I'm here to support and stay informed",
    value: 'non-carrying' as const,
    accent: '#90A8B8',
  },
  {
    title: 'We both track',
    subtext: 'We want full visibility for both of us',
    value: 'both' as const,
    accent: '#95B5A0',
  },
];

export const GOAL_OPTIONS = [
  'Conceiving naturally',
  'Improving fertility',
  'Managing IVF',
  'Reducing miscarriage risk',
  'Tracking my cycle',
  'Supporting my partner',
  'Staying connected as a couple',
  'Learning about fertility',
  'Finding community',
  'Navigating pregnancy loss',
];

export const JOURNEY_OPTIONS = [
  { title: 'Just starting out', subtext: "We're new to this" },
  { title: 'Trying to conceive naturally', subtext: 'Tracking cycles, timing, lifestyle' },
  { title: 'Going through IVF or IUI', subtext: 'In active treatment' },
  { title: 'Between treatments', subtext: 'Taking a break or reassessing' },
  { title: 'Navigating pregnancy loss', subtext: 'After a miscarriage or loss' },
  { title: 'Pregnant after infertility', subtext: 'We made it — still need support' },
];

export const IVF_STATUS_OPTIONS = [
  'Starting soon',
  'Stimulation',
  'Retrieval/Transfer',
  'Two-week wait',
];

export const IVF_JOURNEY_LABEL = 'Going through IVF or IUI';

export const BIRTH_CONTROL_OPTIONS = [
  'Not using any',
  'Coming off it now',
  'Still on it',
  'Never used it',
  'Prefer not to say',
];

export const FERTILITY_HISTORY_OPTIONS = [
  'PCOS',
  'Endometriosis',
  'Irregular cycles',
  'Low sperm count',
  'Low motility',
  'Hormonal imbalance',
  'Previous miscarriage',
  'Previous pregnancy',
  'Thyroid condition',
  'Unexplained infertility',
  'None of the above',
  'Prefer not to say',
];
