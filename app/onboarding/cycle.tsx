import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BIRTH_CONTROL_OPTIONS } from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingOptionList } from '@/app/onboarding/components/OnboardingOptionList';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { BUTTON_OPTION_SELECTED, BUTTON_OPTION_UNSELECTED } from '@/constants/buttons';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function CycleScreen() {
  const biologicalSex = useUserStore((s) => s.biologicalSex);
  const role = useUserStore((s) => s.role);
  const birthControl = useUserStore((s) => s.birthControl);
  const setBirthControl = useUserStore((s) => s.setBirthControl);
  const naturalCycleTracking = useUserStore((s) => s.naturalCycleTracking);
  const setNaturalCycleTracking = useUserStore((s) => s.setNaturalCycleTracking);

  const detailed =
    biologicalSex === 'female' || role === 'carrying' || role === 'both';

  const [partnerShared, setPartnerShared] = useState<boolean | null>(null);
  const [trackingChoice, setTrackingChoice] = useState<'yes' | 'no' | null>(
    naturalCycleTracking ? 'yes' : null,
  );

  const handleContinue = () => {
    if (detailed) {
      router.push('/onboarding/fertility-history');
      return;
    }
    setNaturalCycleTracking(false);
    router.push('/onboarding/fertility-history');
  };

  if (!detailed) {
    return (
      <OnboardingShell
        headline="Quick question"
        progress={{ current: 10, total: 11 }}
        showBack
        onBack={() => router.back()}
        continueDisabled={false}
        onContinue={handleContinue}
      >
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            Has your partner shared their cycle information with you before?
          </Text>
        </View>
        <View style={styles.binaryRow}>
          <Pressable
            onPress={() => setPartnerShared(true)}
            style={[styles.binaryPill, partnerShared === true && styles.binaryPillOn]}
          >
            <Text
              style={[styles.binaryText, partnerShared === true && styles.binaryTextOn]}
            >
              Yes
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPartnerShared(false)}
            style={[styles.binaryPill, partnerShared === false && styles.binaryPillOn]}
          >
            <Text
              style={[styles.binaryText, partnerShared === false && styles.binaryTextOn]}
            >
              No, this is new for me
            </Text>
          </Pressable>
        </View>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell
      headline={'A bit about\nyour cycle'}
      progress={{ current: 10, total: 11 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={handleContinue}
      scrollable
    >
      <Text style={styles.sectionLabel}>Are you currently using birth control?</Text>
      <View style={styles.pillWrap}>
        {BIRTH_CONTROL_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => setBirthControl(option)}
            style={[styles.pill, birthControl === option && styles.pillOn]}
          >
            <Text style={[styles.pillText, birthControl === option && styles.pillTextOn]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionLabel, styles.sectionGap]}>
        Are you using natural family planning or fertility awareness methods?
      </Text>
      <OnboardingOptionList>
        <OnboardingGlassCard
          title="Yes — I track my cycle naturally"
          subtext="BBT, cervical mucus, ovulation tests"
          selected={trackingChoice === 'yes'}
          onPress={() => {
            setTrackingChoice('yes');
            setNaturalCycleTracking(true);
          }}
        />
        <OnboardingGlassCard
          title="No — just getting started"
          selected={trackingChoice === 'no'}
          onPress={() => {
            setTrackingChoice('no');
            setNaturalCycleTracking(false);
          }}
        />
      </OnboardingOptionList>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: onboardingTheme.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 4,
  },
  questionText: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.medium,
    color: onboardingTheme.textPrimary,
    lineHeight: 24,
  },
  question: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: onboardingTheme.textPrimary,
    marginBottom: 12,
  },
  sectionGap: {
    marginTop: 28,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    ...BUTTON_OPTION_UNSELECTED.container,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  pillOn: {
    ...BUTTON_OPTION_SELECTED.container,
    borderRadius: 100,
  },
  pillText: {
    ...BUTTON_OPTION_UNSELECTED.label,
    fontSize: fontSizes.label,
  },
  pillTextOn: {
    ...BUTTON_OPTION_SELECTED.label,
    fontSize: fontSizes.label,
  },
  binaryRow: {
    gap: 10,
    marginTop: 8,
  },
  binaryPill: {
    ...BUTTON_OPTION_UNSELECTED.container,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 100,
    alignItems: 'center',
  },
  binaryPillOn: {
    ...BUTTON_OPTION_SELECTED.container,
    borderRadius: 100,
  },
  binaryText: {
    ...BUTTON_OPTION_UNSELECTED.label,
    fontSize: fontSizes.body,
  },
  binaryTextOn: {
    ...BUTTON_OPTION_SELECTED.label,
    fontSize: fontSizes.body,
  },
});
