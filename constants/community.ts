import { appBackground } from '@/constants/gradient';

/** Community screens — same flat light blue as the rest of the app */
export const COMMUNITY_SURFACE = appBackground;

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
