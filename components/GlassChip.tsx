import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, radius, textContrast } from '@/constants/theme';

type GlassChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function GlassChip({ label, selected, onPress }: GlassChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.wrap, noFocusRing]}>
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.pill}
        shadow="none"
      >
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.2,
    ...textContrast,
  },
});
