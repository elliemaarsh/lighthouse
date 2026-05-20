import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, radius, textContrast } from '@/constants/theme';

type GlassPillOptionProps = {
  index: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  wide?: boolean;
};

export function GlassPillOption({
  index,
  label,
  selected,
  onPress,
  wide = false,
}: GlassPillOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, wide && styles.wrapWide, noFocusRing]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.pill}
        shadow={selected ? 'card' : 'soft'}
        style={styles.glass}
      >
        <View style={styles.inner}>
          <Text style={styles.index}>{index}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '47%',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: 4,
  },
  wrapWide: {
    width: '100%',
  },
  glass: {
    width: '100%',
  },
  inner: {
    minHeight: 96,
    paddingVertical: 22,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  index: {
    fontSize: fontSizes.pillIndex,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    ...textContrast,
  },
  label: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.15,
    ...textContrast,
  },
});
