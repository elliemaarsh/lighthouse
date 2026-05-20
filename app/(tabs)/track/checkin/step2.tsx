import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckInAlternateOption } from '@/components/checkin/CheckInAlternateOption';
import { TemperatureRulerPicker } from '@/components/checkin/TemperatureRulerPicker';
import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { useCheckIn } from '@/contexts/CheckInContext';
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
  const { data, update } = useCheckIn();
  const [temperature, setTemperature] = useState<number | null>(
    data.temperature ??
      (data.temperatureNotMeasured ? null : defaultForUnit(data.tempUnit)),
  );
  const [unit, setUnit] = useState<TempUnit>(data.tempUnit);
  const [didntMeasure, setDidntMeasure] = useState(data.temperatureNotMeasured);

  const hasValue = !didntMeasure;
  const pickerValue = didntMeasure ? null : (temperature ?? defaultForUnit(unit));

  const goNext = (payload: {
    temperature: number | null;
    temperatureNotMeasured: boolean;
    tempUnit: TempUnit;
  }) => {
    update(payload);
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
    update({ temperature: null, temperatureNotMeasured: true });
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
    update({ temperature: next, temperatureNotMeasured: false });
  };

  const setTempUnit = (next: TempUnit) => {
    if (next === unit) return;
    setUnit(next);
    if (temperature !== null) {
      const converted = next === 'C' ? fToC(temperature) : cToF(temperature);
      setTemperature(converted);
      update({ tempUnit: next, temperature: converted });
    } else {
      update({ tempUnit: next });
    }
  };

  return (
    <CheckInStepLayout
      step={2}
      totalSteps={4}
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
              style={[
                styles.unitPillWrap,
                noFocusRing,
                didntMeasure && styles.unitPillMuted,
              ]}
            >
              <GlassSurface
                variant={unit === u ? 'selected' : 'pill'}
                borderRadius={100}
                shadow="none"
              >
                <View style={styles.unitPillInner}>
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
              </GlassSurface>
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
  unitPillWrap: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  unitPillInner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  unitPillMuted: {
    opacity: 0.5,
  },
  unitText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    ...textContrast,
  },
  unitTextSelected: {
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  unitTextMuted: {
    color: colors.textMuted,
  },
});
