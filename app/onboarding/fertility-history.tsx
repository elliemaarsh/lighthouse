import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FERTILITY_HISTORY_OPTIONS } from '@/app/onboarding/constants';
import { listenRouteForRole } from '@/app/onboarding/constants/listen';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function FertilityHistoryScreen() {
  const role = useUserStore((s) => s.role);
  const fertilityHistory = useUserStore((s) => s.fertilityHistory);
  const toggleFertilityHistory = useUserStore((s) => s.toggleFertilityHistory);
  const setFertilityHistory = useUserStore((s) => s.setFertilityHistory);

  const goToListen = () => router.push(listenRouteForRole(role));

  return (
    <OnboardingShell
      headline={'Any relevant\nhealth history?'}
      subtext="This stays private unless you choose to share. It helps us personalize your insights."
      progress={{ current: 11, total: 11 }}
      showBack
      onBack={() => router.back()}
      showSkip
      onSkip={() => {
        setFertilityHistory([]);
        goToListen();
      }}
      continueDisabled={false}
      onContinue={goToListen}
    >
      <View style={styles.grid}>
        {FERTILITY_HISTORY_OPTIONS.map((item) => {
          const selected = fertilityHistory.includes(item);
          return (
            <Pressable
              key={item}
              onPress={() => toggleFertilityHistory(item)}
              style={[styles.pill, selected && styles.pillOn]}
            >
              <Text style={[styles.pillText, selected && styles.pillTextOn]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pill: {
    backgroundColor: onboardingTheme.pillBg,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 4,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
  },
  pillOn: {
    backgroundColor: onboardingTheme.pillSelectedBg,
    borderColor: onboardingTheme.pillSelectedBg,
  },
  pillText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
  },
  pillTextOn: {
    color: onboardingTheme.pillSelectedText,
    fontFamily: fonts.medium,
  },
});
