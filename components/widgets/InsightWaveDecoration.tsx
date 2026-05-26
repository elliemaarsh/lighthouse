import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WAVE_STROKE = 'rgba(52, 49, 47, 0.07)';

type InsightWaveDecorationProps = {
  width?: number | string;
  height?: number;
};

/**
 * Three soft parallel waves on a transparent background — sits behind card content.
 */
export function InsightWaveDecoration({
  width = '100%',
  height = 88,
}: InsightWaveDecorationProps) {
  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 300 88" preserveAspectRatio="none">
        <Path
          d="M -8 28 C 45 12 95 44 148 28 S 248 12 308 28"
          stroke={WAVE_STROKE}
          strokeWidth={1.5}
          fill="none"
        />
        <Path
          d="M -8 44 C 45 28 95 60 148 44 S 248 28 308 44"
          stroke={WAVE_STROKE}
          strokeWidth={1.5}
          fill="none"
        />
        <Path
          d="M -8 60 C 45 44 95 76 148 60 S 248 44 308 60"
          stroke={WAVE_STROKE}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
