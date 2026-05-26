/** Fallback solid behind mesh layers */
export const appBackground = '#FAFCFB';

/** Global mist mesh — corner stops from reference gradient */
export const mistGradient = {
  topLeft: '#E2E5E6',
  topRight: '#FDFDFD',
  bottomLeft: '#F1F3E7',
  bottomRight: '#E8EFEB',
  center: '#FAFCFB',
} as const;

/** @deprecated Use mistGradient */
export const flowerGradient = mistGradient;

/** @deprecated Use FlowerBackground */
export const appGradient = {
  colors: [mistGradient.topLeft, mistGradient.center, mistGradient.bottomRight] as const,
  locations: [0, 0.5, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  base: appBackground,
};
