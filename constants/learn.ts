import { colors } from '@/constants/theme';

export const learnSurface = colors.backgroundTransparent;

export const LEARN_BACKGROUND = learnSurface;

export type LearnFilterId =
  | 'for-you'
  | 'ivf'
  | 'cycle'
  | 'relationship'
  | 'loss'
  | 'basics'
  | 'solo'
  | 'same-sex'
  | 'pcos'
  | 'endometriosis';

export const LEARN_FILTER_CHIPS: { id: LearnFilterId; label: string }[] = [
  { id: 'for-you', label: 'For You' },
  { id: 'ivf', label: 'IVF' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'loss', label: 'Loss' },
  { id: 'basics', label: 'Fertility Basics' },
  { id: 'solo', label: 'Solo' },
  { id: 'same-sex', label: 'Same-Sex' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'endometriosis', label: 'Endometriosis' },
];

export const LEARN_FILTER_CATEGORIES: Record<
  Exclude<LearnFilterId, 'for-you'>,
  string[]
> = {
  ivf: ['IVF & Treatment'],
  cycle: ['Understanding Your Body', 'Cycle Tracking', 'Conceiving Naturally'],
  relationship: ['Relationship & Connection', 'For the Supporting Partner'],
  loss: ['Pregnancy Loss'],
  basics: ['Fertility Basics', 'Improving Fertility', 'Community & Disclosure'],
  solo: ['Solo Journey'],
  'same-sex': ['Same-Sex Couples'],
  pcos: ['PCOS'],
  endometriosis: ['Endometriosis'],
};
