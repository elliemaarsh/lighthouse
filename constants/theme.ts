import { gradient } from '@/constants/gradient';

export const colors = {
  background: gradient.base,
  backgroundTransparent: 'transparent',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.82)',
  textMuted: 'rgba(255, 255, 255, 0.58)',

  accentRose: '#C9A99A',
  accentCobalt: '#8EB4C8',
  /** Ruler picker center tick */
  accentLime: '#C8E86A',

  surface: 'rgba(255, 255, 255, 0.06)',

  cardUnselectedBg: 'rgba(255, 255, 255, 0.05)',
  cardUnselectedBorder: 'rgba(255, 255, 255, 0.2)',
  cardSelectedBg: 'rgba(255, 255, 255, 0.1)',
  cardSelectedBorder: 'rgba(255, 255, 255, 0.28)',

  pillUnselectedBg: 'rgba(255, 255, 255, 0.05)',
  pillSelectedBg: 'rgba(255, 255, 255, 0.1)',

  buttonPrimaryBg: 'rgba(255, 255, 255, 0.12)',
  buttonGhostBorder: 'rgba(255, 255, 255, 0.28)',

  inputBg: 'rgba(255, 255, 255, 0.06)',
  inputBorder: 'rgba(255, 255, 255, 0.2)',
  inputBorderFocused: 'rgba(255, 255, 255, 0.45)',

  avatarBg: 'rgba(255, 255, 255, 0.1)',
  white: '#FFFFFF',
};

/** Geist family names (loaded in app/_layout.tsx) */
export const fonts = {
  light: 'Geist_300Light',
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semiBold: 'Geist_600SemiBold',
} as const;

/** Keeps white type readable on the light end of Monsoon Glow */
export const textContrast = {
  textShadowColor: 'rgba(48, 82, 130, 0.5)',
  textShadowOffset: { width: 0, height: 1 } as const,
  textShadowRadius: 8,
};

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
  tabBarInset: 100,
};

export const typography = {
  /** Headlines */
  headline: {
    fontFamily: fonts.semiBold,
    letterSpacing: 0.2,
    color: colors.textPrimary,
    ...textContrast,
  },
  /** Body / subtext */
  subtext: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    ...textContrast,
  },
  /** Large display numbers */
  display: {
    fontFamily: fonts.light,
    color: colors.textPrimary,
    ...textContrast,
  },
  /** Labels / caps */
  label: {
    fontFamily: fonts.medium,
    color: colors.textMuted,
    ...textContrast,
  },
  wordmark: {
    fontSize: fontSizes.wordmark,
    fontFamily: fonts.medium,
    letterSpacing: 5,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    ...textContrast,
  },
};
