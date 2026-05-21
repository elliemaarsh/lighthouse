import { BlurView } from '@react-native-community/blur';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type OnboardingGlassPillButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** `light` = white label (photo/dark bg). `dark` = mist onboarding screens */
  tone?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
};

export function OnboardingGlassPillButton({
  label,
  onPress,
  disabled = false,
  tone = 'dark',
  style,
}: OnboardingGlassPillButtonProps) {
  const isLight = tone === 'light';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        style,
        noFocusRing,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={styles.pill}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webGlass]} />
        ) : (
          <BlurView
            blurType="light"
            blurAmount={32}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(255,255,255,0.12)"
          />
        )}
        <View style={styles.frost} pointerEvents="none" />
        <View style={styles.highlight} pointerEvents="none" />
        <Text
          style={[
            styles.label,
            isLight ? styles.labelLight : styles.labelDark,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  pill: {
    borderRadius: 100,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 28,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  webGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 100,
  },
  frost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 100,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 1,
  },
  label: {
    fontSize: fontSizes.body,
    fontFamily: fonts.semiBold,
    letterSpacing: 0.3,
    zIndex: 2,
  },
  labelLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  labelDark: {
    color: onboardingTheme.textPrimary,
  },
  labelDisabled: {
    color: onboardingTheme.textMuted,
  },
});
