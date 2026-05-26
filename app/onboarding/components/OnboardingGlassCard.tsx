import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppBlurView } from '@/components/AppBlurView';
import { OnboardingOptionWaveDecoration } from '@/app/onboarding/components/OnboardingOptionWaveDecoration';

import { onboardingTheme } from '@/app/onboarding/theme';
import { BUTTON_OPTION_SELECTED, BUTTON_OPTION_UNSELECTED } from '@/constants/buttons';
import { OPTION_PRIMARY } from '@/constants/buttons';
import { SURFACE } from '@/constants/surfaces';
import { fontSizes, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type OnboardingGlassCardProps = {
  title: string;
  subtext?: string;
  selected: boolean;
  onPress: () => void;
};

export function OnboardingGlassCard({
  title,
  subtext,
  selected,
  onPress,
}: OnboardingGlassCardProps) {
  return (
    <View style={styles.root}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, noFocusRing, pressed && styles.pressed]}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
      >
        <View style={[styles.shell, selected && styles.shellSelected]}>
          {selected ? (
            <View style={styles.deco} pointerEvents="none">
              <OnboardingOptionWaveDecoration />
            </View>
          ) : (
            <AppBlurView
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
              {selected ? (
                <Feather name="check" size={16} color={OPTION_PRIMARY} />
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  pressable: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.94,
  },
  shell: {
    borderRadius: 20,
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.stroke,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  shellSelected: {
    ...BUTTON_OPTION_SELECTED.container,
    borderRadius: 20,
  },
  deco: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
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
    ...BUTTON_OPTION_SELECTED.label,
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
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSelected: {
    borderColor: OPTION_PRIMARY,
    backgroundColor: BUTTON_OPTION_SELECTED.container.backgroundColor,
  },
});
