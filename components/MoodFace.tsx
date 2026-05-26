import { Pressable, StyleSheet, View } from 'react-native';

import { noFocusRing } from '@/lib/focusRing';

const FEATURE_UNSELECTED = 'rgba(26, 36, 34, 0.52)';
const FEATURE_SELECTED = '#1A1A1A';
const SIZE = 56;
const SIZE_SELECTED = 64;

type MoodFaceProps = {
  level: 1 | 2 | 3 | 4 | 5;
  selected: boolean;
  onPress: () => void;
};

function Mouth({ level, color }: { level: number; color: string }) {
  if (level === 1) {
    return <View style={[styles.mouthSad, { borderColor: color }]} />;
  }
  if (level === 2) {
    return <View style={[styles.mouthSlightlySad, { borderColor: color }]} />;
  }
  if (level === 3) {
    return <View style={[styles.mouthNeutral, { backgroundColor: color }]} />;
  }
  if (level === 4) {
    return <View style={[styles.mouthSlightlyHappy, { borderColor: color }]} />;
  }
  return <View style={[styles.mouthHappy, { borderColor: color }]} />;
}

function Eyes({ level, color }: { level: number; color: string }) {
  if (level >= 5) {
    return (
      <View style={styles.eyesRow}>
        <View style={[styles.eyeCrescent, { borderBottomColor: color }]} />
        <View style={[styles.eyeCrescent, { borderBottomColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.eyesRow}>
      <View style={[styles.eyeDot, { backgroundColor: color }]} />
      <View style={[styles.eyeDot, { backgroundColor: color }]} />
    </View>
  );
}

const DEFAULT_DISPLAY_SIZE = 48;

type MoodFaceDisplayProps = {
  level: 1 | 2 | 3 | 4 | 5;
  size?: number;
};

/** Read-only mood face for summary cards */
export function MoodFaceDisplay({ level, size = DEFAULT_DISPLAY_SIZE }: MoodFaceDisplayProps) {
  const featureColor = FEATURE_SELECTED;
  const circleRadius = size / 2;
  const innerScale = size / DEFAULT_DISPLAY_SIZE;

  return (
    <View
      style={[
        styles.displayCircle,
        {
          width: size,
          height: size,
          borderRadius: circleRadius,
        },
      ]}
    >
      <View style={{ transform: [{ scale: innerScale }] }}>
        <Eyes level={level} color={featureColor} />
        <Mouth level={level} color={featureColor} />
      </View>
    </View>
  );
}

export function MoodFace({ level, selected, onPress }: MoodFaceProps) {
  const featureColor = selected ? FEATURE_SELECTED : FEATURE_UNSELECTED;
  const circleSize = selected ? SIZE_SELECTED : SIZE;
  const circleRadius = circleSize / 2;

  return (
    <View style={styles.slot}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          noFocusRing,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Mood level ${level}`}
      >
        <View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleRadius,
            },
            selected && styles.circleSelected,
          ]}
        >
          <Eyes level={level} color={featureColor} />
          <Mouth level={level} color={featureColor} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: SIZE_SELECTED + 8,
    height: SIZE_SELECTED + 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  circle: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  circleSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  eyeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eyeCrescent: {
    width: 8,
    height: 4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 0,
    borderRadius: 4,
  },
  mouthSad: {
    width: 14,
    height: 7,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 4,
  },
  mouthSlightlySad: {
    width: 12,
    height: 4,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginTop: 5,
  },
  mouthNeutral: {
    width: 14,
    height: 2,
    borderRadius: 1,
    marginTop: 6,
  },
  mouthSlightlyHappy: {
    width: 12,
    height: 4,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: 3,
  },
  mouthHappy: {
    width: 14,
    height: 7,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 2,
  },
  displayCircle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
});
