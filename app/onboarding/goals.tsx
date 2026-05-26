import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GOAL_OPTIONS } from '@/app/onboarding/constants';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { BUTTON_OPTION_SELECTED, BUTTON_OPTION_UNSELECTED } from '@/constants/buttons';
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
    ...BUTTON_OPTION_UNSELECTED.container,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 4,
  },
  pillOn: {
    ...BUTTON_OPTION_SELECTED.container,
    borderRadius: 100,
  },
  pillText: {
    ...BUTTON_OPTION_UNSELECTED.label,
    fontSize: 14,
  },
  pillTextOn: {
    ...BUTTON_OPTION_SELECTED.label,
    fontSize: 14,
  },
});
