import { SURFACE } from '@/constants/surfaces';

/** Flat pills on mist mesh — no liquid glass */
export const FLAT_PILL_INK = SURFACE.stroke;
export const FLAT_PILL_BORDER = SURFACE.stroke;

export const flatPillSurface = {
  idleBackground: 'rgba(255, 255, 255, 0.72)',
  selectedBackground: SURFACE.primaryFill,
  borderWidth: SURFACE.strokeWidth,
  borderColor: SURFACE.stroke,
} as const;

/** Outlined action pills on mist (Begin, Generate Report, etc.) */
export const flatPillOutline = {
  borderWidth: SURFACE.strokeWidth,
  borderColor: SURFACE.stroke,
  backgroundColor: SURFACE.inputBackground,
} as const;
