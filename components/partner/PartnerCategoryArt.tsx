import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { View } from 'react-native';

import { glass } from '@/constants/glass';
import type { PartnerCategoryId } from '@/types/partnerLog';

type ArtType = PartnerCategoryId | 'dna';

type PartnerCategoryArtProps = {
  type: ArtType;
  width?: number;
  height?: number;
  color?: string;
};

export function PartnerCategoryArt({
  type,
  width = 56,
  height = 56,
  color = glass.line,
}: PartnerCategoryArtProps) {
  return (
    <View style={{ width, height }} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {type === 'sleep' && (
          <>
            {[0.72, 0.58, 0.44].map((y, i) => (
              <Path
                key={y}
                d={`M ${width * 0.1} ${height * y} Q ${width * 0.5} ${height * (y - 0.12)} ${width * 0.9} ${height * y}`}
                stroke={color}
                strokeWidth={1}
                fill="none"
                opacity={0.5 + i * 0.15}
              />
            ))}
          </>
        )}
        {type === 'exercise' && (
          <Path
            d={`M ${width * 0.08} ${height * 0.55} L ${width * 0.28} ${height * 0.35} L ${width * 0.42} ${height * 0.62} L ${width * 0.58} ${height * 0.28} L ${width * 0.72} ${height * 0.5} L ${width * 0.92} ${height * 0.38}`}
            stroke={color}
            strokeWidth={1.25}
            fill="none"
          />
        )}
        {type === 'heat' && (
          <>
            <Line
              x1={width * 0.55}
              y1={height * 0.12}
              x2={width * 0.55}
              y2={height * 0.88}
              stroke={color}
              strokeWidth={1.25}
            />
            {[0.28, 0.45, 0.62, 0.78].map((y) => (
              <Line
                key={y}
                x1={width * 0.42}
                y1={height * y}
                x2={width * 0.68}
                y2={height * y}
                stroke={color}
                strokeWidth={1}
              />
            ))}
            <Circle cx={width * 0.55} cy={height * 0.22} r={3} fill={color} />
          </>
        )}
        {type === 'substances' && (
          <Path
            d={`M ${width * 0.5} ${height * 0.88} Q ${width * 0.2} ${height * 0.55} ${width * 0.35} ${height * 0.25} Q ${width * 0.5} ${height * 0.08} ${width * 0.65} ${height * 0.25} Q ${width * 0.8} ${height * 0.55} ${width * 0.5} ${height * 0.88}`}
            stroke={color}
            strokeWidth={1}
            fill="none"
          />
        )}
        {type === 'stress' && (
          <Path
            d={`M ${width * 0.08} ${height * 0.5} Q ${width * 0.25} ${height * 0.3} ${width * 0.42} ${height * 0.55} T ${width * 0.92} ${height * 0.48}`}
            stroke={color}
            strokeWidth={1.25}
            fill="none"
          />
        )}
        {type === 'notes' && (
          <>
            {[0.32, 0.48, 0.64].map((y) => (
              <Line
                key={y}
                x1={width * 0.2}
                y1={height * y}
                x2={width * 0.8}
                y2={height * y}
                stroke={color}
                strokeWidth={1}
              />
            ))}
          </>
        )}
        {type === 'dna' && (
          <>
            <Path
              d={`M ${width * 0.35} ${height * 0.15} Q ${width * 0.65} ${height * 0.35} ${width * 0.35} ${height * 0.55} Q ${width * 0.05} ${height * 0.75} ${width * 0.35} ${height * 0.95}`}
              stroke={color}
              strokeWidth={1.25}
              fill="none"
            />
            <Path
              d={`M ${width * 0.65} ${height * 0.05} Q ${width * 0.35} ${height * 0.25} ${width * 0.65} ${height * 0.45} Q ${width * 0.95} ${height * 0.65} ${width * 0.65} ${height * 0.85}`}
              stroke={color}
              strokeWidth={1.25}
              fill="none"
            />
          </>
        )}
      </Svg>
    </View>
  );
}
