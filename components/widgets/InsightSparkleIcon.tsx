import Svg, { Path } from 'react-native-svg';

import { widgetPalette } from '@/constants/widgetPalette';

type InsightSparkleIconProps = {
  size?: number;
  color?: string;
};

/** Four-point star with small sparkles (insight card icon). */
export function InsightSparkleIcon({
  size = 22,
  color = widgetPalette.primary,
}: InsightSparkleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5 L13.8 9.2 L20.5 11 L13.8 12.8 L12 19.5 L10.2 12.8 L3.5 11 L10.2 9.2 Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path
        d="M19.5 4.5 L19.9 5.8 L21.2 6.2 L19.9 6.6 L19.5 7.9 L19.1 6.6 L17.8 6.2 L19.1 5.8 Z"
        fill={color}
        opacity={0.85}
      />
      <Path
        d="M5.2 16.8 L5.55 17.75 L6.5 18.1 L5.55 18.45 L5.2 19.4 L4.85 18.45 L3.9 18.1 L4.85 17.75 Z"
        fill={color}
        opacity={0.85}
      />
    </Svg>
  );
}
