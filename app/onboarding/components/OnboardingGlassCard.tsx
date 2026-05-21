import { BlurView } from '@react-native-community/blur';
import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type OnboardingGlassCardProps = {
  title: string;
  subtext?: string;
  selected: boolean;
  onPress: () => void;
  accentBorderColor?: string;
};

export function OnboardingGlassCard({
  title,
  subtext,
  selected,
  onPress,
  accentBorderColor,
}: OnboardingGlassCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, noFocusRing, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        style={[
          styles.shell,
          selected && styles.shellSelected,
          selected && accentBorderColor
            ? { borderLeftWidth: 4, borderLeftColor: accentBorderColor }
            : null,
        ]}
      >
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webFrost]} />
        ) : (
          <BlurView
            blurType="light"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor={onboardingTheme.cardBg}
          />
        )}
        <View style={styles.inner}>
          <View style={styles.copy}>
            <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
            {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
          </View>
          <View style={[styles.ring, selected && styles.ringSelected]}>
            {selected ? <Feather name="check" size={16} color={onboardingTheme.textPrimary} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.94,
  },
  shell: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
    overflow: 'hidden',
  },
  shellSelected: {
    borderColor: onboardingTheme.cardBorderSelected,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  webFrost: {
    backgroundColor: onboardingTheme.cardBg,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 12,
    zIndex: 1,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.medium,
    color: onboardingTheme.textPrimary,
  },
  titleSelected: {
    fontFamily: fonts.semiBold,
  },
  subtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: onboardingTheme.textSecondary,
    lineHeight: 20,
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(26, 36, 34, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSelected: {
    borderColor: onboardingTheme.textPrimary,
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
  },
});
