import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GOAL_OPTIONS } from '@/app/onboarding/constants';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function GoalsScreen() {
  const goals = useUserStore((s) => s.goals);
  const toggleGoal = useUserStore((s) => s.toggleGoal);

  return (
    <OnboardingShell
      headline={'What brings you\nto Lighthouse?'}
      subtext="Select all that apply"
      progress={{ current: 8, total: 11 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => router.push('/onboarding/journey')}
    >
      <View style={styles.grid}>
        {GOAL_OPTIONS.map((goal) => {
          const selected = goals.includes(goal);
          return (
            <Pressable
              key={goal}
              onPress={() => toggleGoal(goal)}
              style={[styles.pill, selected && styles.pillOn]}
            >
              <Text style={[styles.pillText, selected && styles.pillTextOn]}>{goal}</Text>
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
