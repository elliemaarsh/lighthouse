import { forwardRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { BUTTON_TIER_1, BUTTON_TIER_2 } from '@/constants/buttons';
import { radius } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

export type AppButtonTier = 1 | 2;

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  tier?: AppButtonTier;
  disabled?: boolean;
  style?: ViewStyle;
};

export const AppButton = forwardRef<ComponentRef<typeof Pressable>, AppButtonProps>(
  function AppButton(
    { label, onPress, tier = 2, disabled = false, style },
    ref,
  ) {
    const isTier2 = tier === 2;
    const tierStyles = isTier2 ? BUTTON_TIER_2 : BUTTON_TIER_1;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          isTier2 ? styles.pressableTier2 : styles.pressableTier1,
          noFocusRing,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <View style={[tierStyles.container, disabled && styles.pillDisabled]}>
          <Text style={tierStyles.label}>{label}</Text>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  pressableTier1: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  pressableTier2: {
    borderRadius: radius.pill,
    alignSelf: 'stretch',
    width: '100%',
  },
  pillDisabled: {
    opacity: 0.45,
  },
  disabled: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.88,
  },
});
