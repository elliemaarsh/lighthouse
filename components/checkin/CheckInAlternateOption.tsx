import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, radius, textContrast, typography } from '@/constants/theme';

type CheckInAlternateOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function CheckInAlternateOption({
  label,
  selected,
  onPress,
}: CheckInAlternateOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, noFocusRing]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.pill}
        shadow={selected ? 'soft' : 'none'}
      >
        <View style={styles.inner}>
          <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginTop: 28,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: fontSizes.label,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textSecondary,
    ...textContrast,
  },
  textSelected: {
    color: colors.textPrimary,
  },
});
