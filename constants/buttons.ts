import { fonts } from '@/constants/theme';

export const OPTION_PRIMARY = '#27359E';
export const OPTION_SELECTED_BG = 'rgba(39, 53, 158, 0.12)';
export const OPTION_INDEX_MUTED = '#9BB0AC';

/** Tier 1 — secondary / inline actions inside cards */
export const BUTTON_TIER_1 = {
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  label: {
    color: '#1A1A1A',
    fontFamily: fonts.light,
    fontSize: 14,
    letterSpacing: 0.3,
  },
} as const;

/** Tier 2 — primary full-width screen CTAs */
export const BUTTON_TIER_2 = {
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: OPTION_PRIMARY,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    alignSelf: 'stretch' as const,
    width: '100%' as const,
  },
  label: {
    color: OPTION_PRIMARY,
    fontFamily: fonts.light,
    fontSize: 15,
    letterSpacing: 0.3,
    textAlign: 'center' as const,
  },
} as const;

/** Selectable pills / chips — unselected */
export const BUTTON_OPTION_UNSELECTED = {
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
  label: {
    color: '#1A1A1A',
    fontFamily: fonts.light,
  },
  index: {
    color: OPTION_INDEX_MUTED,
    fontFamily: fonts.light,
  },
} as const;

/** Selectable pills / chips — selected (light blue tint) */
export const BUTTON_OPTION_SELECTED = {
  container: {
    backgroundColor: OPTION_SELECTED_BG,
    borderWidth: 0.5,
    borderColor: OPTION_PRIMARY,
  },
  label: {
    color: OPTION_PRIMARY,
    fontFamily: fonts.light,
  },
  index: {
    color: OPTION_PRIMARY,
    opacity: 0.6,
    fontFamily: fonts.light,
  },
} as const;
