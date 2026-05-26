import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { GlassPillOption } from '@/components/GlassPillOption';
import { useCheckInEditMode } from '@/hooks/useCheckInEditMode';
import { checkInSpacing } from '@/constants/checkIn';
import { routes } from '@/constants/routes';
import {
  hydrateCheckInStoreFromTodayLog,
  useCheckInStore,
} from '@/store/useCheckInStore';
import { useTrackStore } from '@/store/useTrackStore';
import type { PeriodStatus } from '@/types/checkIn';

const OPTIONS: { index: string; label: string; value: PeriodStatus }[] = [
  { index: '01', label: 'Period started', value: 'period_started' },
  { index: '02', label: 'Period ongoing', value: 'period_ongoing' },
  { index: '03', label: 'Period ended', value: 'period_ended' },
  { index: '04', label: 'No period', value: 'no_period' },
];

export default function CheckInStep1() {
  const isEdit = useCheckInEditMode();
  const setField = useCheckInStore((s) => s.setField);
  const periodStatus = useCheckInStore((s) => s.periodStatus);
  const [selected, setSelected] = useState<PeriodStatus | null>(periodStatus);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const log = useTrackStore.getState().todayLog;
      if (log) {
        hydrateCheckInStoreFromTodayLog(log);
        setSelected(log.periodStatus);
      }
    } else {
      setSelected(useCheckInStore.getState().periodStatus);
    }
    setReady(true);
  }, [isEdit]);

  const handleSelect = (value: PeriodStatus) => {
    setSelected(value);
    setField('periodStatus', value);
  };

  const handleContinue = () => {
    if (selected) {
      setField('periodStatus', selected);
    }
    router.push(routes.checkinStep2);
  };

  const handleSkip = () => {
    setField('periodStatus', null);
    router.push(routes.checkinStep2);
  };

  if (!ready) {
    return null;
  }

  return (
    <CheckInStepLayout
      step={1}
      totalSteps={4}
      editMode={isEdit}
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
