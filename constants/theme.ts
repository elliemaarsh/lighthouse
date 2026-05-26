export const colors = {
  // Backgrounds
  background: '#1A0A05',
  backgroundTransparent: 'transparent',
  backgroundWarm: '#F5EDE6',
  backgroundClean: '#FDFAF7',
  /** Home dashboard — diagonal mesh gradient corners */
  homeGradientTopLeft: '#E2E5E6',
  homeGradientTopRight: '#FDFDFD',
  homeGradientBottomLeft: '#F1F3E7',
  homeGradientBottomRight: '#E8EFEB',
  homeGradientCenter: '#FAFCFB',
  /** @deprecated Use home gradient tokens */
  homeBackground: '#F5F6F5',
  homeBackgroundSoft: '#EEEBE6',
  homeText: '#FFFFFF',
  homeTextSecondary: 'rgba(255,255,255,0.6)',
  homeTextMuted: 'rgba(255,255,255,0.35)',
  homeAccentBlue: '#6B9BB8',
  homeAccentOrange: '#D4845A',
  homeAccentGold: '#C9A227',

  // Surfaces — white cards on mist mesh (Home, Track, Connect, Learn, etc.)
  glassCard: '#FFFFFF',
  glassCardBorder: 'rgba(28, 24, 20, 0.06)',
  glassCardLight: '#FFFFFF',
  glassCardLightBorder: 'rgba(28, 24, 20, 0.06)',

  // Text — global on mist mesh background
  textPrimary: '#1A2422',
  textSecondary: 'rgba(26, 36, 34, 0.65)',
  textMuted: '#9BB0AC',

  /** @deprecated Use textPrimary / textSecondary / textMuted */
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.6)',
  textOnDarkFaint: 'rgba(255,255,255,0.35)',

  // Accent colors — warm orange palette
  accentOrange: '#F14E2A',
  accentAmber: '#E8821A',
  accentGold: '#EDE290',
  accentCream: '#F5EDE6',

  // Legacy aliases (mapped to warm palette)
  accentRose: '#F14E2A',
  accentCobalt: '#E8821A',
  accentLime: '#EDE290',

  heatLow: '#E8821A',
  heatMedium: '#C4947A',
  heatHigh: '#C17B7B',
  substancesNone: '#E8821A',
  loggedDot: '#E8821A',

  surface: 'rgba(255,255,255,0.12)',

  cardUnselectedBg: '#FFFFFF',
  cardUnselectedBorder: '#1A1A1A',
  cardSelectedBg: 'rgba(39, 53, 158, 0.12)',
  cardSelectedBorder: '#27359E',

  pillUnselectedBg: 'rgba(255,255,255,0.12)',
  pillSelectedBg: '#FFFFFF',

  buttonPrimaryBg: '#FFFFFF',
  buttonPrimaryText: '#1C0F08',
  buttonGhostBorder: '#1A1A1A',

  inputBg: '#FFFFFF',
  inputBorder: '#1A1A1A',
  inputBorderFocused: '#1A1A1A',

  avatarBg: 'rgba(255,255,255,0.15)',

  white: '#FFFFFF',
  border: 'rgba(255,255,255,0.12)',
  borderLight: 'rgba(28,15,8,0.08)',
};

/** Connect tab — white cards on mist background */
export const connectDashboard = {
  background: colors.backgroundTransparent,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  progressTrack: 'rgba(26, 36, 34, 0.08)',
  progressFill: colors.textPrimary,
  cardBorder: colors.glassCardBorder,
  cardBorderStrong: 'rgba(28, 24, 20, 0.12)',
  sage: colors.accentAmber,
  buttonBg: '#FFFFFF',
  buttonText: colors.textPrimary,
  inputBg: '#FFFFFF',
  decoration: 'rgba(26, 36, 34, 0.1)',
  sheetHandle: 'rgba(26, 36, 34, 0.2)',
  calendarSelectedBg: colors.accentOrange,
  calendarSelectedText: colors.white,
  todayTextColor: colors.accentGold,
  arrowColor: colors.textPrimary,
};

/** Partner Track — white cards on mist background */
export const partnerDashboard = {
  background: colors.backgroundTransparent,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  progressTrack: 'rgba(26, 36, 34, 0.08)',
  progressFill: colors.accentGold,
  streakBg: 'rgba(255, 255, 255, 0.65)',
  streakText: colors.textPrimary,
  cardBorder: colors.glassCardBorder,
  cardBorderStrong: 'rgba(28, 24, 20, 0.12)',
  loggedDot: colors.loggedDot,
  heatLow: colors.heatLow,
  heatMedium: colors.heatMedium,
  heatHigh: colors.heatHigh,
  substancesNone: colors.substancesNone,
  decoration: 'rgba(26, 36, 34, 0.1)',
  decorationStrong: 'rgba(26, 36, 34, 0.14)',
  sheetHandle: 'rgba(26, 36, 34, 0.2)',
  selectedBg: colors.white,
  selectedText: colors.textPrimary,
  inputBg: '#FFFFFF',
  quickPillBg: 'rgba(255, 255, 255, 0.55)',
};

/**
 * Inter family — only Extra Light (≥28px) and Light (everything else).
 */
export const fonts = {
  extraLight: 'Inter_200ExtraLight',
  light: 'Inter_300Light',
  regular: 'Inter_300Light',
  medium: 'Inter_300Light',
  semiBold: 'Inter_300Light',
  bold: 'Inter_200ExtraLight',
} as const;

/** Use Extra Light for display-scale type (28px+). */
export function fontFamilyForSize(fontSize: number): string {
  return fontSize >= 28 ? fonts.extraLight : fonts.light;
}

/** Light home screen — corner colors for layered gradient */
export const homeGradient = {
  topLeft: colors.homeGradientTopLeft,
  topRight: colors.homeGradientTopRight,
  bottomLeft: colors.homeGradientBottomLeft,
  bottomRight: colors.homeGradientBottomRight,
  center: colors.homeGradientCenter,
} as const;

/** Home widgets — dark type on white cards, blue active indicators */
export const homeMist = {
  background: colors.backgroundTransparent,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  card: '#FFFFFF',
  cardBorder: 'rgba(28, 24, 20, 0.06)',
  /** Filled circles, progress bars, active dots on home widgets */
  highlight: '#27359E',
  highlightSoft: 'rgba(39, 53, 158, 0.1)',
  highlightBorder: 'rgba(39, 53, 158, 0.3)',
  highlightMuted: 'rgba(39, 53, 158, 0.15)',
  logDot: '#80B9FE',
  starAccent: '#80B9FE',
  ctaChevronBg: 'rgba(39, 53, 158, 0.3)',
  accentOrange: colors.accentOrange,
  sparkline: colors.accentGold,
  barAccent: colors.accentGold,
  ctaBackground: '#80B9FE',
  ctaText: '#1A2422',
  ctaTextSecondary: 'rgba(26, 36, 34, 0.55)',
  iconMuted: 'rgba(26, 36, 34, 0.2)',
  fertileDotPeak: colors.accentOrange,
  track: 'rgba(39, 53, 158, 0.08)',
  dotEmpty: 'rgba(39, 53, 158, 0.15)',
  shadow: '#000',
  ctaShadow: '#80B9FE',
  checkInProgressFill: '#80B9FE',
  checkInProgressTrack: 'rgba(128, 185, 254, 0.2)',
} as const;

/** Light cream home screen */
export const homeDashboard = {
  background: colors.homeGradientTopRight,
  backgroundSoft: colors.homeGradientBottomLeft,
  textPrimary: colors.homeText,
  textSecondary: colors.homeTextSecondary,
  textMuted: colors.homeTextMuted,
  accentBlue: colors.homeAccentBlue,
  accentOrange: colors.homeAccentOrange,
  accentGold: colors.homeAccentGold,
  cardBorder: 'rgba(28, 24, 20, 0.08)',
  titleFont: fonts.extraLight,
  labelFont: fonts.light,
};

/** Use on flower-background screens for legible light text */
export const textOnDarkContrast = {
  color: colors.textOnDark,
} as const;

/** @deprecated Empty — use textOnDarkContrast on dark screens or theme text colors on cream */
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
  stadium: 48,
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
  tabBarInset: 128,
};

export const typography = {
  /** Global H1 — Inter Extra Light */
  h1: {
    fontFamily: fonts.extraLight,
    fontSize: fontSizes.display,
    lineHeight: 48,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  headline: {
    fontFamily: fonts.extraLight,
    fontSize: fontSizes.display,
    lineHeight: 48,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  subtext: {
    fontFamily: fonts.light,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  display: {
    fontFamily: fonts.extraLight,
    color: colors.textPrimary,
  },
  /** Body copy */
  body: {
    fontFamily: fonts.light,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  label: {
    fontFamily: fonts.light,
    color: colors.textMuted,
  },
  wordmark: {
    fontSize: fontSizes.wordmark,
    fontFamily: fonts.light,
    letterSpacing: 5,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
  },
  /** Large titles — Extra Light */
  title: {
    fontFamily: fonts.extraLight,
    color: colors.textPrimary,
  },
};
