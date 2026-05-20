import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fonts, textContrast } from '@/constants/theme';

type GlassStackOptionProps = {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  height?: number;
};

export function GlassStackOption({
  selected,
  onPress,
  children,
  height = 56,
}: GlassStackOptionProps) {
  return (
    <Pressable onPress={onPress} style={noFocusRing}>
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={14}
        shadow="none"
        style={styles.shell}
      >
        <View style={[styles.inner, { minHeight: height }]}>{children}</View>
      </GlassSurface>
    </Pressable>
  );
}

export function GlassStackOptionTitle({
  text,
  selected,
}: {
  text: string;
  selected: boolean;
}) {
  return (
    <Text style={[styles.title, selected && styles.titleSelected]}>{text}</Text>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  inner: {
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    lineHeight: 20,
    ...textContrast,
  },
  titleSelected: {
    fontFamily: fonts.semiBold,
  },
});
