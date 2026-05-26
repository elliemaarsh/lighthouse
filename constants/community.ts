import { colors } from '@/constants/theme';

export const COMMUNITY_SURFACE = colors.backgroundTransparent;

/** @deprecated Use COMMUNITY_SURFACE */
export const COMMUNITY_SETUP_BG = COMMUNITY_SURFACE;

export const SUGGESTED_POST_TAGS = [
  'IVF',
  'Trying to conceive',
  'Miscarriage',
  'Male fertility',
  'Relationships',
  'Two-week wait',
  'PCOS',
  'Support',
] as const;

export const MAX_POST_TAGS = 5;
export const MAX_TAG_LENGTH = 20;
