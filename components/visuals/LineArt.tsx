import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { glass } from '@/constants/glass';

export type LineArtType =
  | 'orbits'
  | 'ripples'
  | 'arcs'
  | 'arc'
  | 'timeline'
  | 'pulse'
  | 'wave'
  | 'grid';
export type LineArtTone = 'light' | 'dark';
export type LineArtPlacement = 'background' | 'corner';

type LineArtProps = {
  type: LineArtType;
  width?: number;
  height?: number;
  tone?: LineArtTone;
  placement?: LineArtPlacement;
};

function resolveType(type: LineArtType): LineArtType {
  if (type === 'ripples') return 'orbits';
  if (type === 'arc') return 'arcs';
  return type;
}

export function LineArt({
  type,
  width = 200,
  height = 140,
  tone = 'dark',
  placement = 'background',
}: LineArtProps) {
  const resolved = resolveType(type);
  const stroke = tone === 'dark' ? glass.line : glass.lineLight;
  const strokeAccent = tone === 'dark' ? glass.lineStrong : glass.lineLightStrong;
  const thin = 0.5;
  const accent = 0.75;
  const cx = width * 0.68;
  const cy = height * 0.38;

  const placementStyle =
    placement === 'background'
      ? [
          styles.background,
          {
            width,
            height,
            right: -width * 0.22,
            top: -height * 0.18,
          },
        ]
      : [styles.corner, { width, height }];

  return (
    <View style={placementStyle} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {resolved === 'orbits' &&
          [0.4, 0.32, 0.24, 0.16, 0.08].map((ry, i) => (
            <Ellipse
              key={ry}
              cx={cx}
              cy={cy}
              rx={width * 0.36}
              ry={height * ry}
              stroke={i === 2 ? strokeAccent : stroke}
              strokeWidth={i === 2 ? accent : thin}
              fill="none"
              opacity={i === 2 ? 0.22 : 0.06 + i * 0.03}
            />
          ))}

        {resolved === 'arcs' &&
          [
            { r: 0.46, opacity: 0.08 },
            { r: 0.36, opacity: 0.12 },
            { r: 0.26, opacity: 0.2 },
          ].map(({ r, opacity }) => (
            <Path
              key={r}
              d={`M ${width * (0.48 - r * 0.32)} ${height * 0.95} A ${width * r} ${width * r} 0 0 1 ${width * 0.98} ${height * 0.38}`}
              stroke={stroke}
              strokeWidth={thin}
              fill="none"
              opacity={opacity}
            />
          ))}

        {resolved === 'timeline' && (
          <>
            <Line
              x1={width * 0.08}
              y1={height * 0.62}
              x2={width * 0.92}
              y2={height * 0.62}
              stroke={stroke}
              strokeWidth={thin}
              opacity={0.2}
            />
            {[0.18, 0.48, 0.78].map((p, i) => (
              <Circle
                key={p}
                cx={width * p}
                cy={height * 0.62}
                r={i === 1 ? 3 : 2}
                fill={stroke}
                opacity={0.12 + i * 0.06}
              />
            ))}
          </>
        )}

        {resolved === 'pulse' && (
          <>
            <Line
              x1={width * 0.08}
              y1={height * 0.55}
              x2={width * 0.92}
              y2={height * 0.55}
              stroke={stroke}
              strokeWidth={thin}
              opacity={0.18}
            />
            <Path
              d={`M ${width * 0.14} ${height * 0.55} L ${width * 0.26} ${height * 0.28} L ${width * 0.38} ${height * 0.65} L ${width * 0.5} ${height * 0.32} L ${width * 0.62} ${height * 0.58} L ${width * 0.74} ${height * 0.4} L ${width * 0.86} ${height * 0.55}`}
              stroke={strokeAccent}
              strokeWidth={accent}
              fill="none"
              opacity={0.22}
            />
          </>
        )}

        {resolved === 'wave' && (
          <>
            <Path
              d={`M ${width * 0.06} ${height * 0.64} Q ${width * 0.28} ${height * 0.28} ${width * 0.52} ${height * 0.64} T ${width * 0.9} ${height * 0.64}`}
              stroke={stroke}
              strokeWidth={thin}
              fill="none"
              opacity={0.16}
            />
            <Line
              x1={width * 0.8}
              y1={height * 0.2}
              x2={width * 0.8}
              y2={height * 0.34}
              stroke={strokeAccent}
              strokeWidth={accent}
              opacity={0.2}
            />
            <Circle cx={width * 0.8} cy={height * 0.16} r={2} fill={strokeAccent} opacity={0.2} />
          </>
        )}

        {resolved === 'grid' && (
          <>
            <Line
              x1={width * 0.5}
              y1={height * 0.15}
              x2={width * 0.5}
              y2={height * 0.85}
              stroke={stroke}
              strokeWidth={thin}
              opacity={0.18}
            />
            <Line
              x1={width * 0.15}
              y1={height * 0.5}
              x2={width * 0.85}
              y2={height * 0.5}
              stroke={stroke}
              strokeWidth={thin}
              opacity={0.18}
            />
            <Circle cx={width * 0.5} cy={height * 0.5} r={3} fill={stroke} opacity={0.15} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    zIndex: 0,
    opacity: 0.85,
  },
  corner: {
    position: 'absolute',
    right: -12,
    top: -8,
    zIndex: 0,
    opacity: 0.8,
  },
});
