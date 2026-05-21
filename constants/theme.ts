import { appBackground } from '@/constants/gradient';

export const colors = {
  background: appBackground,
  backgroundTransparent: 'transparent',

  textPrimary: '#1A2422',
  textSecondary: 'rgba(26, 36, 34, 0.65)',
  textMuted: 'rgba(26, 36, 34, 0.45)',

  accentRose: '#C9A99A',
  accentCobalt: '#6B8FA8',
  /** Ruler picker center tick */
  accentLime: '#5A8F4A',

  heatLow: '#7BAF8A',
  heatMedium: '#C4947A',
  heatHigh: '#C17B7B',
  substancesNone: '#7BAF8A',
  loggedDot: '#7BAF8A',

  surface: 'rgba(26, 36, 34, 0.06)',

  cardUnselectedBg: 'rgba(255, 255, 255, 0.42)',
  cardUnselectedBorder: 'rgba(255, 255, 255, 0.55)',
  cardSelectedBg: 'rgba(255, 255, 255, 0.65)',
  cardSelectedBorder: 'rgba(26, 36, 34, 0.18)',

  pillUnselectedBg: '#FFFFFF',
  pillSelectedBg: '#1A2422',

  buttonPrimaryBg: '#1A2422',
  buttonGhostBorder: 'rgba(26, 36, 34, 0.22)',

  inputBg: '#FFFFFF',
  inputBorder: 'rgba(26, 36, 34, 0.12)',
  inputBorderFocused: 'rgba(26, 36, 34, 0.35)',

  avatarBg: 'rgba(255, 255, 255, 0.55)',
  white: '#FFFFFF',
};

/** Connect tab — glass on flat light blue */
export const connectDashboard = {
  background: colors.backgroundTransparent,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  progressTrack: colors.surface,
  progressFill: colors.textPrimary,
  cardBorder: colors.cardUnselectedBorder,
  cardBorderStrong: colors.cardSelectedBorder,
  sage: colors.heatLow,
  buttonBg: colors.buttonPrimaryBg,
  buttonText: colors.white,
  inputBg: colors.inputBg,
  decoration: 'rgba(26, 36, 34, 0.06)',
  sheetHandle: 'rgba(26, 36, 34, 0.15)',
  calendarSelectedBg: colors.white,
  calendarSelectedText: colors.textPrimary,
};

/** Partner Track — same flat surface as the rest of the app */
export const partnerDashboard = {
  background: appBackground,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  progressTrack: colors.surface,
  progressFill: colors.textPrimary,
  streakBg: colors.textPrimary,
  streakText: colors.white,
  cardBorder: connectDashboard.cardBorder,
  cardBorderStrong: connectDashboard.cardBorderStrong,
  loggedDot: colors.loggedDot,
  heatLow: colors.heatLow,
  heatMedium: colors.heatMedium,
  heatHigh: colors.heatHigh,
  substancesNone: colors.substancesNone,
  decoration: connectDashboard.decoration,
  decorationStrong: 'rgba(26, 36, 34, 0.08)',
  sheetHandle: connectDashboard.sheetHandle,
  selectedBg: colors.textPrimary,
  selectedText: colors.white,
  inputBg: colors.inputBg,
  quickPillBg: 'rgba(255, 255, 255, 0.55)',
};

/** Geist family names (loaded in app/_layout.tsx) */
export const fonts = {
  light: 'Geist_300Light',
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semiBold: 'Geist_600SemiBold',
} as const;

export const textContrast = {} as const;

export const fontSizes = {
  display: 44,
  displaySm: 36,
  h1: 32,
  h2: 22,
  h3: 18,
  body: 16,
  label: 13,
  micro: 11,
  wordmark: 11,
  tabLabel: 10,
  statLabel: 10,
  statNumber: 48,
  pillIndex: 12,
};

export const radius = {
  card: 28,
  /** Large selection tiles (period options) */
  stadium: 48,
  /** Capsule chips and small pills */
  pill: 999,
  button: 999,
  avatar: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  footer: 48,
  /** Space above floating tab bar (pill + safe area + breathing room) */
  tabBarInset: 128,
};

export const typography = {
  headline: {
    fontFamily: fonts.semiBold,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  subtext: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  display: {
    fontFamily: fonts.light,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  wordmark: {
    fontSize: fontSizes.wordmark,
    fontFamily: fonts.medium,
    letterSpacing: 5,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
  },
};
