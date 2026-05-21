import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import {
  ageFromBirthDate,
  formatDisplayDate,
  parseBirthDateParts,
} from '@/app/onboarding/lib/birthDate';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function BirthDateScreen() {
  const stored = useUserStore((s) => s.birthDate);
  const setBirthDate = useUserStore((s) => s.setBirthDate);
  const setAge = useUserStore((s) => s.setAge);

  const initial = formatDisplayDate(stored);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [year, setYear] = useState(initial.year);

  const iso = useMemo(
    () => parseBirthDateParts(month, day, year),
    [month, day, year],
  );
  const computedAge = iso ? ageFromBirthDate(iso) : null;
  const canContinue = computedAge != null && computedAge >= 13;

  return (
    <OnboardingShell
      headline={"When's your\nbirthday?"}
      subtext="We use this to personalize your experience."
      progress={{ current: 2 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => {
        if (iso && computedAge != null && computedAge >= 13) {
          setBirthDate(iso);
          setAge(computedAge);
        }
        router.push('/onboarding/biological-sex');
      }}
    >
      <View style={styles.fieldsRow}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Month</Text>
          <TextInput
            value={month}
            onChangeText={(t) => setMonth(t.replace(/\D/g, '').slice(0, 2))}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="MM"
            placeholderTextColor={onboardingTheme.textMuted}
            style={styles.input}
            textAlign="center"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Day</Text>
          <TextInput
            value={day}
            onChangeText={(t) => setDay(t.replace(/\D/g, '').slice(0, 2))}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="DD"
            placeholderTextColor={onboardingTheme.textMuted}
            style={styles.input}
            textAlign="center"
          />
        </View>
        <View style={[styles.field, styles.fieldYear]}>
          <Text style={styles.fieldLabel}>Year</Text>
          <TextInput
            value={year}
            onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="YYYY"
            placeholderTextColor={onboardingTheme.textMuted}
            style={styles.input}
            textAlign="center"
          />
        </View>
      </View>

      {computedAge != null && canContinue ? (
        <Text style={styles.hint}>Age {computedAge}</Text>
      ) : (
        <Text style={styles.hint}>Enter a valid date (you must be at least 13)</Text>
      )}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  fieldsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  field: {
    flex: 1,
  },
  fieldYear: {
    flex: 1.35,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 1.5,
    color: onboardingTheme.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: onboardingTheme.inputBg,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: onboardingTheme.textPrimary,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
  },
  hint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: onboardingTheme.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
