/** Shared surfaces — inputs, strokes, track charts */
export const SURFACE = {
  inputBackground: '#FFFFFF',
  stroke: '#1A1A1A',
  primaryStroke: '#27359E',
  primaryFill: '#1A2422',
  strokeWidth: 0.5,
  /** Selected pills/chips — light tint */
  selectedFill: 'rgba(39, 53, 158, 0.12)',
  optionSelectedBorder: '#27359E',
  /** CheckInCTAWidget card only — not buttons */
  ctaCardFill: '#1A2422',
  chartBlue: '#80B9FE',
  chartBlueDark: '#27359E',
  labelMuted: '#9BB0AC',
} as const;

export const inputFieldStyle = {
  backgroundColor: SURFACE.inputBackground,
  borderWidth: SURFACE.strokeWidth,
  borderColor: SURFACE.stroke,
} as const;

export const unselectedPillBorder = {
  borderWidth: SURFACE.strokeWidth,
  borderColor: SURFACE.stroke,
} as const;
