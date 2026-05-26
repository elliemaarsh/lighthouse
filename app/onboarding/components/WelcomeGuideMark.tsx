import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';

const SCALE = 1.4;
const CIRCLE_SIZE = Math.round(56 * SCALE);
const LINE_HEIGHT = Math.round(88 * SCALE);

/**
 * Glowing circle + vertical guide line (welcome hero).
 */
export function WelcomeGuideMark() {
  const cx = CIRCLE_SIZE / 2;
  const lineTop = CIRCLE_SIZE;

  return (
    <View style={styles.wrap}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE + LINE_HEIGHT}>
        <Defs>
          <RadialGradient id="welcomeGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle
          cx={cx}
          cy={cx}
          r={CIRCLE_SIZE / 2}
          fill="url(#welcomeGlow)"
        />
        <Circle
          cx={cx}
          cy={cx}
          r={CIRCLE_SIZE / 2 - 2}
          fill="none"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth={1}
        />
        <Line
          x1={cx}
          y1={lineTop}
          x2={cx}
          y2={lineTop + LINE_HEIGHT}
          stroke="#FFFFFF"
          strokeWidth={1}
          strokeOpacity={0.88}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
