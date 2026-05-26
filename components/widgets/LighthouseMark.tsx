import Svg, { Path, Rect } from 'react-native-svg';

type LighthouseMarkProps = {
  size?: number;
  color?: string;
  opacity?: number;
};

/** Simple lighthouse mark for the home header */
export function LighthouseMark({
  size = 18,
  color = '#27359E',
  opacity = 0.5,
}: LighthouseMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Rect
        x={7}
        y={2}
        width={4}
        height={3}
        rx={0.5}
        fill={color}
        opacity={opacity}
      />
      <Path
        d="M4 5h10l-1.5 11H5.5L4 5z"
        fill={color}
        opacity={opacity}
      />
      <Rect
        x={6}
        y={8}
        width={6}
        height={2}
        rx={0.5}
        fill={color}
        opacity={opacity * 0.8}
      />
      <Path
        d="M2 16h14"
        stroke={color}
        strokeWidth={1}
        opacity={opacity * 0.6}
      />
    </Svg>
  );
}
