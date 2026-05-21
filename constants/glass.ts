import type { ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

/** White tint on top of blur — visible on flat light blue */
export const FROST_PILL_BASE = 0.42;
export const FROST_PILL_SELECTED_DELTA = 0.18;

/** Selection frost fade duration (ms) */
export const GLASS_SELECT_DURATION = 220;

export const glass = {
  blurTypeLight: 'light' as const,
  blurTypeDark: 'dark' as const,
  blurAmountLight: 24,
  blurAmountDark: 20,
  borderLight: colors.cardUnselectedBorder,
  borderLightStrong: colors.cardSelectedBorder,
  borderDark: 'rgba(26, 36, 34, 0.12)',
  frostBare: `rgba(255, 255, 255, ${FROST_PILL_BASE})`,
  frostCard: 'rgba(255, 255, 255, 0.42)',
  frostLight: 'rgba(255, 255, 255, 0.42)',
  frostInput: 'rgba(255, 255, 255, 0.65)',
  frostStrong: 'rgba(255, 255, 255, 0.55)',
  frostSelectionOverlay: `rgba(255, 255, 255, ${FROST_PILL_SELECTED_DELTA})`,
  frostSelected: `rgba(255, 255, 255, ${FROST_PILL_BASE + FROST_PILL_SELECTED_DELTA})`,
  highlight: 'rgba(255, 255, 255, 0.75)',
  fallbackLight: 'rgba(255, 255, 255, 0.42)',
  fallbackDark: 'rgba(255, 255, 255, 0.42)',
  webFrostOpacity: 0.55,
  dataRadius: 28,
  line: 'rgba(26, 36, 34, 0.1)',
  lineStrong: 'rgba(26, 36, 34, 0.22)',
  lineLight: 'rgba(26, 36, 34, 0.1)',
  lineLightStrong: 'rgba(26, 36, 34, 0.22)',
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
