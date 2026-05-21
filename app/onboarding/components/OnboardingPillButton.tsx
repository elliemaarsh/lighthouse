import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type OnboardingPillButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

export function OnboardingPillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: OnboardingPillButtonProps) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.label,
          isGhost ? styles.labelGhost : styles.labelPrimary,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: onboardingTheme.buttonBg,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(26, 36, 34, 0.2)',
    paddingVertical: 14,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
  },
  labelPrimary: {
    color: onboardingTheme.buttonText,
  },
  labelGhost: {
    color: onboardingTheme.textSecondary,
    fontSize: fontSizes.label,
  },
  labelDisabled: {
    color: onboardingTheme.textMuted,
  },
});
