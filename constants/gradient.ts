/** Monsoon Glow — onboarding (light blue → white) */
export const onboardingGradient = {
  colors: ['#305282', '#98AFC7', '#E9ECEF'] as const,
  locations: [0, 0.48, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  base: '#305282',
};

/** Legacy alias */
export const gradient = onboardingGradient;

export type GradientVariant = 'onboarding' | 'carrying' | 'non-carrying';

export type GradientLayer = {
  colors: readonly string[];
  locations?: readonly number[];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export type GradientPreset = {
  base: string;
  layers: GradientLayer[];
};

/** Carrying — magenta top → deep purple/black bottom + pink rim */
export const carryingGradient: GradientPreset = {
  base: '#1A051D',
  layers: [
    {
      colors: ['#E063A8', '#9E3D78', '#4A1848', '#1A051D'],
      locations: [0, 0.3, 0.58, 1],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
    {
      colors: [
        'rgba(224, 99, 168, 0.5)',
        'rgba(26, 5, 29, 0)',
        'rgba(26, 5, 29, 0)',
        'rgba(224, 99, 168, 0.5)',
      ],
      locations: [0, 0.32, 0.68, 1],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    {
      colors: ['rgba(26, 5, 29, 0)', 'rgba(26, 5, 29, 0)', 'rgba(232, 72, 140, 0.55)'],
      locations: [0, 0.72, 1],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
  ],
};

/** Non-carrying — dark navy center + electric blue edge glow */
export const nonCarryingGradient: GradientPreset = {
  base: '#060A14',
  layers: [
    {
      colors: ['#0C1428', '#060A14', '#080E1A'],
      locations: [0, 0.5, 1],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
    {
      colors: [
        'rgba(37, 99, 235, 0.75)',
        'rgba(6, 10, 20, 0)',
        'rgba(6, 10, 20, 0)',
        'rgba(37, 99, 235, 0.75)',
      ],
      locations: [0, 0.3, 0.7, 1],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    {
      colors: ['rgba(6, 10, 20, 0)', 'rgba(30, 80, 210, 0.65)'],
      locations: [0.55, 1],
      start: { x: 0.5, y: 0.2 },
      end: { x: 0.5, y: 1 },
    },
    {
      colors: ['rgba(6, 10, 20, 0)', 'rgba(59, 130, 246, 0.35)'],
      locations: [0.65, 1],
      start: { x: 0.5, y: 0.5 },
      end: { x: 0.5, y: 1 },
    },
  ],
};

export const gradientPresets: Record<GradientVariant, GradientPreset | typeof onboardingGradient> = {
  onboarding: onboardingGradient,
  carrying: carryingGradient,
  'non-carrying': nonCarryingGradient,
};
