import type { ViewStyle } from 'react-native';

import { colors, homeMist } from '@/constants/theme';

export const FROST_PILL_BASE = 0.3;
export const FROST_PILL_SELECTED_DELTA = 0.15;

export const GLASS_SELECT_DURATION = 220;

/** Floating tab bar — light liquid glass */
export const tabBarGlass = {
  blurType: 'light' as const,
  blurAmount: 24,
  frost: 'rgba(255, 255, 255, 0.55)',
  fallback: 'rgba(255, 255, 255, 0.72)',
  border: 'rgba(255, 255, 255, 0.65)',
  borderStrong: 'rgba(255, 255, 255, 0.85)',
  selectedFill: 'rgba(255, 255, 255, 0.94)',
};

/** Primary app cards — white on mist (Connect, Track, Learn, etc.) */
export const connectCardGlass = {
  blurType: 'light' as const,
  blurAmount: 16,
  frost: homeMist.card,
  fallback: homeMist.card,
  border: homeMist.cardBorder,
  borderStrong: 'rgba(28, 24, 20, 0.1)',
};

export const glass = {
  blurTypeLight: 'light' as const,
  blurTypeDark: 'dark' as const,
  blurAmountLight: 16,
  blurAmountDark: 20,
  borderLight: colors.glassCardLightBorder,
  borderLightStrong: 'rgba(28, 24, 20, 0.1)',
  borderDark: colors.glassCardBorder,
  borderDarkStrong: 'rgba(28, 24, 20, 0.12)',
  frostBare: 'rgba(255, 255, 255, 0.88)',
  frostCard: connectCardGlass.frost,
  frostLight: colors.glassCardLight,
  frostInput: 'rgba(255, 255, 255, 0.75)',
  frostStrong: 'rgba(255, 255, 255, 0.92)',
  frostSelectionOverlay: 'rgba(255, 255, 255, 0.35)',
  frostSelected: '#FFFFFF',
  fallbackLight: colors.glassCardLight,
  fallbackDark: colors.glassCard,
  fallbackConnect: connectCardGlass.fallback,
  webFrostOpacity: 1,
  dataRadius: 28,
  line: 'rgba(26, 36, 34, 0.08)',
  lineStrong: 'rgba(26, 36, 34, 0.12)',
  lineLight: 'rgba(26, 36, 34, 0.08)',
  lineLightStrong: 'rgba(26, 36, 34, 0.12)',
};

export const metricText = {
  label: colors.textMuted,
  value: colors.textPrimary,
  sub: colors.textSecondary,
};

export const glassShadow: ViewStyle = {
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export const glassShadowSoft: ViewStyle = {
  shadowColor: homeMist.shadow,
  shadowOpacity: 0.06,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const lightCardShadow: ViewStyle = {
  shadowColor: homeMist.shadow,
  shadowOpacity: 0.06,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};
