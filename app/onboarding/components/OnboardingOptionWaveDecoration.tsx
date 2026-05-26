import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/** Sage tree-ring lines — light enough to stay behind copy */
const SAGE = 'rgba(138, 155, 126, 0.22)';
const SAGE_MID = 'rgba(138, 155, 126, 0.14)';
const SAGE_SOFT = 'rgba(138, 155, 126, 0.08)';

type OnboardingOptionWaveDecorationProps = {
  /** Optional height when not filling the card */
  height?: number;
};

/**
 * Concentric wavy rings on white — sits behind selected option card content.
 */
export function OnboardingOptionWaveDecoration({
  height,
}: OnboardingOptionWaveDecorationProps) {
  const sized = height != null;

  return (
    <View
      style={[styles.wrap, sized && { height }]}
      pointerEvents="none"
    >
      <Svg
        width="100%"
        height={sized ? height : '100%'}
        viewBox="0 0 400 140"
        preserveAspectRatio="xMinYMax slice"
      >
        {/* Inner rings — thin, soft */}
        <Path
          d="M -24 148 C 28 118 72 102 128 104 C 184 106 238 118 300 128 C 340 134 380 138 420 142"
          stroke={SAGE_SOFT}
          strokeWidth={0.5}
          fill="none"
        />
        <Path
          d="M -28 142 C 22 108 68 88 126 90 C 188 92 248 108 312 122 C 352 130 392 136 432 140"
          stroke={SAGE_SOFT}
          strokeWidth={0.5}
          fill="none"
        />
        <Path
          d="M -32 134 C 16 96 62 74 122 76 C 192 78 262 98 328 114 C 368 124 408 130 448 136"
          stroke={SAGE_MID}
          strokeWidth={0.5}
          fill="none"
        />
        <Path
          d="M -36 124 C 10 82 56 58 118 60 C 198 62 278 86 348 106 C 388 116 428 122 468 128"
          stroke={SAGE_MID}
          strokeWidth={0.55}
          fill="none"
        />
        <Path
          d="M -40 112 C 4 66 48 40 112 42 C 204 44 294 72 364 96 C 404 108 444 114 484 120"
          stroke={SAGE_MID}
          strokeWidth={0.55}
          fill="none"
        />
        <Path
          d="M -44 98 C -4 48 36 20 104 22 C 212 24 308 56 382 84 C 422 98 462 104 502 110"
          stroke={SAGE}
          strokeWidth={0.6}
          fill="none"
        />
        <Path
          d="M -48 82 C -12 28 24 -4 96 0 C 220 6 332 44 408 72 C 448 86 488 92 528 98"
          stroke={SAGE}
          strokeWidth={0.75}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
});
