import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCheckInEditMode } from '@/hooks/useCheckInEditMode';
import { CheckInAlternateOption } from '@/components/checkin/CheckInAlternateOption';
import { TemperatureRulerPicker } from '@/components/checkin/TemperatureRulerPicker';
import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import {
  BUTTON_OPTION_SELECTED,
  BUTTON_OPTION_UNSELECTED,
} from '@/constants/buttons';
import { noFocusRing } from '@/lib/focusRing';
import { useCheckInStore } from '@/store/useCheckInStore';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, textContrast } from '@/constants/theme';
import type { TempUnit } from '@/types/checkIn';

const DIDNT_MEASURE_LABEL = "Didn't measure";
function defaultForUnit(unit: TempUnit): number {
  return unit === 'F' ? 98.6 : 36.8;
}

function fToC(f: number): number {
  return Math.round(((f - 32) * (5 / 9)) * 10) / 10;
}

function cToF(c: number): number {
  return Math.round((c * (9 / 5) + 32) * 10) / 10;
}

export default function CheckInStep2() {
  const isEdit = useCheckInEditMode();
  const draft = useCheckInStore();
  const setFields = useCheckInStore((s) => s.setFields);
  const [temperature, setTemperature] = useState<number | null>(
    draft.temperature ??
      (draft.temperatureNotMeasured ? null : defaultForUnit(draft.tempUnit)),
  );
  const [unit, setUnit] = useState<TempUnit>(draft.tempUnit);
  const [didntMeasure, setDidntMeasure] = useState(draft.temperatureNotMeasured);

  const hasValue = !didntMeasure;
  const pickerValue = didntMeasure ? null : (temperature ?? defaultForUnit(unit));

  const goNext = (payload: {
    temperature: number | null;
    temperatureNotMeasured: boolean;
    tempUnit: TempUnit;
  }) => {
    setFields(payload);
    router.push(routes.checkinStep3);
  };

  const handleContinue = () => {
    goNext({
      temperature: didntMeasure ? null : pickerValue,
      temperatureNotMeasured: didntMeasure,
      tempUnit: unit,
    });
  };

  const handleDidntMeasure = () => {
    setDidntMeasure(true);
    setTemperature(null);
    setFields({ temperature: null, temperatureNotMeasured: true });
  };

  const handleSkip = () => {
    goNext({
      temperature: null,
      temperatureNotMeasured: true,
      tempUnit: unit,
    });
  };

  const handleTempChange = (next: number) => {
    setTemperature(next);
    setDidntMeasure(false);
    setFields({ temperature: next, temperatureNotMeasured: false });
  };

  const setTempUnit = (next: TempUnit) => {
    if (next === unit) return;
    setUnit(next);
    if (temperature !== null) {
      const converted = next === 'C' ? fToC(temperature) : cToF(temperature);
      setTemperature(converted);
      setFields({ tempUnit: next, temperature: converted });
    } else {
      setFields({ tempUnit: next });
    }
  };

  return (
    <CheckInStepLayout
      step={2}
      totalSteps={4}
      editMode={isEdit}
      question="What was your basal temperature?"
      subtext="Measure first thing in the morning, before getting up"
      canContinue={hasValue || didntMeasure}
      onContinue={handleContinue}
      onSkip={handleSkip}
      skipLabel={DIDNT_MEASURE_LABEL}
    >
      <View style={[styles.center, didntMeasure && styles.centerMuted]}>
        <TemperatureRulerPicker
          value={pickerValue}
          unit={unit}
          onChange={handleTempChange}
          disabled={didntMeasure}
        />
        <View style={styles.unitRow}>
          {(['F', 'C'] as TempUnit[]).map((u) => (
            <Pressable
              key={u}
              onPress={() => setTempUnit(u)}
              disabled={didntMeasure}
              style={({ pressed }) => [
                styles.unitPillPressable,
                pressed && !didntMeasure && styles.unitPillPressed,
                noFocusRing,
                didntMeasure && styles.unitPillMuted,
              ]}
            >
              <View
                style={[
                  styles.unitPill,
                  unit === u && styles.unitPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    unit === u && styles.unitTextSelected,
                    didntMeasure && styles.unitTextMuted,
                  ]}
                >
                  °{u}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <CheckInAlternateOption
          label={DIDNT_MEASURE_LABEL}
          selected={didntMeasure}
          onPress={handleDidntMeasure}
        />
      </View>
    </CheckInStepLayout>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', width: '100%' },
  centerMuted: { opacity: 0.45 },
  unitRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  unitPillPressable: {
    borderRadius: 100,
  },
  unitPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    ...BUTTON_OPTION_UNSELECTED.container,
  },
  unitPillSelected: {
    ...BUTTON_OPTION_SELECTED.container,
  },
  unitPillPressed: {
    opacity: 0.88,
  },
  unitPillMuted: {
    opacity: 0.5,
  },
  unitText: {
    fontSize: 14,
    letterSpacing: 0.3,
    ...BUTTON_OPTION_UNSELECTED.label,
    ...textContrast,
  },
  unitTextSelected: {
    ...BUTTON_OPTION_SELECTED.label,
  },
  unitTextMuted: {
    color: colors.textMuted,
  },
});
