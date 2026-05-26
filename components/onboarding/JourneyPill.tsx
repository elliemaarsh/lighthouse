import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { BUTTON_OPTION_SELECTED } from '@/constants/buttons';
import { colors, fontSizes, fonts, radius } from '@/constants/theme';

type JourneyPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function JourneyPill({ label, selected, onPress }: JourneyPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, noFocusRing, pressed && styles.pressed]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.pill}
        shadow={selected ? 'card' : 'soft'}
        style={styles.glass}
      >
        <View style={styles.inner}>
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    alignSelf: 'stretch',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  glass: {
    width: '100%',
  },
  inner: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  labelSelected: {
    ...BUTTON_OPTION_SELECTED.label,
  },
});
