import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { GlassPillOption } from '@/components/GlassPillOption';
import { useCheckIn } from '@/contexts/CheckInContext';
import { checkInSpacing } from '@/constants/checkIn';
import { routes } from '@/constants/routes';
import { colors, fontSizes } from '@/constants/theme';
import type { PeriodStatus } from '@/types/checkIn';

const OPTIONS: { index: string; label: string; value: PeriodStatus }[] = [
  { index: '01', label: 'Period started', value: 'period_started' },
  { index: '02', label: 'Period ongoing', value: 'period_ongoing' },
  { index: '03', label: 'Period ended', value: 'period_ended' },
  { index: '04', label: 'No period', value: 'no_period' },
];

export default function CheckInStep1() {
  const { data, update, reset } = useCheckIn();
  const [selected, setSelected] = useState<PeriodStatus | null>(data.periodStatus);

  useEffect(() => {
    reset();
    setSelected(null);
  }, [reset]);

  const handleSelect = (value: PeriodStatus) => {
    setSelected(value);
    update({ periodStatus: value });
  };

  const handleContinue = () => {
    router.push(routes.checkinStep2);
  };

  const handleSkip = () => {
    update({ periodStatus: null });
    router.push(routes.checkinStep2);
  };

  return (
    <CheckInStepLayout
      step={1}
      totalSteps={4}
      question="Any period activity today?"
      subtext="Select one"
      canContinue={selected !== null}
      onContinue={handleContinue}
      onSkip={handleSkip}
      skipLabel="Not sure"
    >
      <View style={styles.grid}>
        {OPTIONS.map((option) => (
          <GlassPillOption
            key={option.value}
            index={option.index}
            label={option.label}
            selected={selected === option.value}
            onPress={() => handleSelect(option.value)}
          />
        ))}
      </View>
    </CheckInStepLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: checkInSpacing.optionGap,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
