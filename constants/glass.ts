import type { ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

/** Base pill frost opacity — selected adds +0.20 (see frostPillSelected) */
export const FROST_PILL_BASE = 0.04;
export const FROST_PILL_SELECTED_DELTA = 0.2;

export const glass = {
  blurTypeLight: 'light' as const,
  blurTypeDark: 'dark' as const,
  /** Barely fogged — low blur so gradient stays visible */
  blurAmountLight: 14,
  blurAmountDark: 14,
  borderLight: 'rgba(255, 255, 255, 0.22)',
  borderLightStrong: 'rgba(255, 255, 255, 0.32)',
  borderDark: 'rgba(255, 255, 255, 0.18)',
  frostBare: `rgba(255, 255, 255, ${FROST_PILL_BASE})`,
  frostLight: 'rgba(255, 255, 255, 0.05)',
  frostStrong: 'rgba(255, 255, 255, 0.07)',
  frostSelected: `rgba(255, 255, 255, ${FROST_PILL_BASE + FROST_PILL_SELECTED_DELTA})`,
  highlight: 'rgba(255, 255, 255, 0.45)',
  fallbackLight: 'rgba(255, 255, 255, 0.06)',
  fallbackDark: 'rgba(255, 255, 255, 0.06)',
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
  shadowColor: '#305282',
  shadowOpacity: 0.14,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
};

export const glassShadowSoft: ViewStyle = {
  shadowColor: '#305282',
  shadowOpacity: 0.1,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};
