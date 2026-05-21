import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import {
  IVF_JOURNEY_LABEL,
  IVF_STATUS_OPTIONS,
  JOURNEY_OPTIONS,
} from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function JourneyScreen() {
  const journeyType = useUserStore((s) => s.journeyType);
  const toggleJourneyType = useUserStore((s) => s.toggleJourneyType);
  const ivfStatus = useUserStore((s) => s.ivfStatus);
  const setIvfStatus = useUserStore((s) => s.setIvfStatus);

  const showIvf = journeyType.includes(IVF_JOURNEY_LABEL);
  const expand = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(expand, {
      toValue: showIvf ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [showIvf, expand]);

  const ivfHeight = expand.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <OnboardingShell
      headline={'Where are you\nright now?'}
      subtext="Select all that apply"
      progress={{ current: 9, total: 11 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => router.push('/onboarding/cycle')}
    >
      {JOURNEY_OPTIONS.map((option) => (
        <OnboardingGlassCard
          key={option.title}
          title={option.title}
          subtext={option.subtext}
          selected={journeyType.includes(option.title)}
          onPress={() => toggleJourneyType(option.title)}
        />
      ))}

      <Animated.View style={[styles.ivfExpand, { height: ivfHeight, opacity: expand }]}>
        {showIvf ? (
          <View style={styles.ivfInner}>
            <Text style={styles.ivfLabel}>Which stage?</Text>
            <View style={styles.ivfPills}>
              {IVF_STATUS_OPTIONS.map((stage) => (
                <Pressable
                  key={stage}
                  onPress={() => setIvfStatus(stage)}
                  style={[styles.ivfPill, ivfStatus === stage && styles.ivfPillOn]}
                >
                  <Text
                    style={[styles.ivfPillText, ivfStatus === stage && styles.ivfPillTextOn]}
                  >
                    {stage}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </Animated.View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  ivfExpand: {
    overflow: 'hidden',
    marginTop: 4,
  },
  ivfInner: {
    paddingTop: 4,
  },
  ivfLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: onboardingTheme.textMuted,
    marginBottom: 10,
  },
  ivfPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ivfPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: onboardingTheme.pillBg,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
  },
  ivfPillOn: {
    backgroundColor: onboardingTheme.pillSelectedBg,
    borderColor: onboardingTheme.pillSelectedBg,
  },
  ivfPillText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
  },
  ivfPillTextOn: {
    color: onboardingTheme.pillSelectedText,
    fontFamily: fonts.medium,
  },
});
