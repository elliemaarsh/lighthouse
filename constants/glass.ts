import type { ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

/** White tint on top of blur — keep very low for true glass, not milky fog */
export const FROST_PILL_BASE = 0.01;
export const FROST_PILL_SELECTED_DELTA = 0.06;

/** Selection frost fade duration (ms) */
export const GLASS_SELECT_DURATION = 220;

export const glass = {
  blurTypeLight: 'light' as const,
  blurTypeDark: 'dark' as const,
  /** Stronger blur, minimal white wash — gradient shows through */
  blurAmountLight: 24,
  blurAmountDark: 20,
  borderLight: 'rgba(255, 255, 255, 0.16)',
  borderLightStrong: 'rgba(255, 255, 255, 0.24)',
  borderDark: 'rgba(255, 255, 255, 0.14)',
  frostBare: `rgba(255, 255, 255, ${FROST_PILL_BASE})`,
  frostCard: 'rgba(255, 255, 255, 0.02)',
  frostLight: 'rgba(255, 255, 255, 0.02)',
  frostInput: 'rgba(255, 255, 255, 0.035)',
  frostStrong: 'rgba(255, 255, 255, 0.04)',
  /** Extra layer cross-faded in when variant is `selected` */
  frostSelectionOverlay: `rgba(255, 255, 255, ${FROST_PILL_SELECTED_DELTA})`,
  frostSelected: `rgba(255, 255, 255, ${FROST_PILL_BASE + FROST_PILL_SELECTED_DELTA})`,
  highlight: 'rgba(255, 255, 255, 0.22)',
  fallbackLight: 'rgba(255, 255, 255, 0.02)',
  fallbackDark: 'rgba(255, 255, 255, 0.02)',
  webFrostOpacity: 0.12,
  dataRadius: 28,
  line: 'rgba(255, 255, 255, 0.1)',
  lineStrong: 'rgba(255, 255, 255, 0.28)',
  lineLight: 'rgba(255, 255, 255, 0.1)',
  lineLightStrong: 'rgba(255, 255, 255, 0.28)',
};

export const metricText = {
  label: colors.textMuted,
  value: colors.textPrimary,
  sub: colors.textSecondary,
};

export const glassShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const glassShadowSoft: ViewStyle = {
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 1,
};
