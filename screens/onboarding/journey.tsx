import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { JourneyPill } from '@/components/onboarding/JourneyPill';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { OnboardingTypography } from '@/components/onboarding/OnboardingTypography';
import { PillButton } from '@/components/onboarding/PillButton';
import { JOURNEY_OPTIONS } from '@/constants/onboarding';
import { routes } from '@/constants/routes';
import { spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function JourneyScreen() {
  const journeyTypes = useUserStore((s) => s.journeyTypes);
  const toggleJourneyType = useUserStore((s) => s.toggleJourneyType);

  return (
    <OnboardingScreen
      showBack
      scrollable
      footer={
        <PillButton
          label="Continue"
          onPress={() => router.push(routes.partner)}
        />
      }
    >
      <View style={styles.body}>
        <OnboardingTypography variant="headlineRole">
          Where are you in your journey?
        </OnboardingTypography>
        <View style={styles.pills}>
          {JOURNEY_OPTIONS.map((option) => (
            <JourneyPill
              key={option.id}
              label={option.label}
              selected={journeyTypes.includes(option.id)}
              onPress={() => toggleJourneyType(option.id)}
            />
          ))}
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: spacing.md,
  },
  pills: {
    marginTop: spacing.sm,
  },
});
