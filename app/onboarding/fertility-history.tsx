import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FERTILITY_HISTORY_OPTIONS } from '@/app/onboarding/constants';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { BUTTON_OPTION_SELECTED, BUTTON_OPTION_UNSELECTED } from '@/constants/buttons';
import { useUserStore } from '@/store/useUserStore';

export default function FertilityHistoryScreen() {
  const fertilityHistory = useUserStore((s) => s.fertilityHistory);
  const toggleFertilityHistory = useUserStore((s) => s.toggleFertilityHistory);
  const setFertilityHistory = useUserStore((s) => s.setFertilityHistory);

  const goToInvite = () => router.push('/onboarding/invite');

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
        goToInvite();
      }}
      continueDisabled={false}
      onContinue={goToInvite}
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
