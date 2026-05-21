/** Flat light blue — app-wide (onboarding, tabs, all roles) */
export const appBackground = '#D4E3F0';

/** @deprecated Use `appBackground`; kept for imports */
export const onboardingGradient = {
  colors: [appBackground, appBackground, appBackground] as const,
  locations: [0, 0.5, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  base: appBackground,
};

export const gradient = onboardingGradient;

export type GradientVariant = 'app';
