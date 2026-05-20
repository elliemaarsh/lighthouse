import { forwardRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, radius, textContrast } from '@/constants/theme';

type PillButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'glass';
  disabled?: boolean;
  style?: ViewStyle;
};

export const PillButton = forwardRef<ComponentRef<typeof Pressable>, PillButtonProps>(
  function PillButton(
    { label, onPress, variant = 'primary', disabled = false, style },
    ref,
  ) {
    const isGlass = variant === 'glass' || variant === 'primary';
    const isGhost = variant === 'ghost';

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          noFocusRing,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <GlassSurface
          variant={isGhost ? 'pill' : 'selected'}
          borderRadius={radius.pill}
          shadow="card"
          style={styles.glass}
        >
          <View style={styles.inner}>
            <Text
              style={[
                styles.label,
                isGhost ? styles.labelGhost : styles.labelPrimary,
              ]}
            >
              {label}
            </Text>
          </View>
        </GlassSurface>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  glass: {
    width: '100%',
  },
  inner: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.medium,
    letterSpacing: 0.4,
  },
  labelPrimary: {
    color: colors.textPrimary,
    ...textContrast,
  },
  labelGhost: {
    color: colors.textSecondary,
    ...textContrast,
  },
});
