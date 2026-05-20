import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { GlassChip } from '@/components/GlassChip';
import { GlassSurface } from '@/components/GlassSurface';
import { MoodFace } from '@/components/MoodFace';
import { useCheckIn } from '@/contexts/CheckInContext';
import { checkInSpacing } from '@/constants/checkIn';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, spacing, textContrast, typography } from '@/constants/theme';

const MOODS: { level: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { level: 1, label: 'Low' },
  { level: 2, label: 'Meh' },
  { level: 3, label: 'Okay' },
  { level: 4, label: 'Good' },
  { level: 5, label: 'Great' },
];

const SYMPTOMS = [
  'Cramping',
  'Bloating',
  'Headache',
  'Fatigue',
  'Breast tenderness',
  'Spotting',
  'Nausea',
  'Back pain',
  'Mood swings',
  'No symptoms',
];

const NO_SYMPTOMS = 'No symptoms';

export default function CheckInStep3() {
  const { data, update } = useCheckIn();
  const [mood, setMood] = useState<number | null>(data.mood);
  const [moodNote, setMoodNote] = useState(data.moodNote);
  const [symptoms, setSymptoms] = useState<string[]>(data.symptoms);

  const handleSelectMood = (level: 1 | 2 | 3 | 4 | 5) => {
    setMood(level);
    update({ mood: level });
  };

  const toggleSymptom = (symptom: string) => {
    let next: string[];

    if (symptom === NO_SYMPTOMS) {
      next = symptoms.includes(NO_SYMPTOMS) ? [] : [NO_SYMPTOMS];
    } else {
      const withoutNone = symptoms.filter((s) => s !== NO_SYMPTOMS);
      if (withoutNone.includes(symptom)) {
        next = withoutNone.filter((s) => s !== symptom);
      } else {
        next = [...withoutNone, symptom];
      }
    }

    setSymptoms(next);
    update({ symptoms: next });
  };

  const handleContinue = () => {
    update({ mood, moodNote: moodNote.trim(), symptoms });
    router.push(routes.checkinStep4Notes);
  };

  const handleSkip = () => {
    update({ mood: null, moodNote: '', symptoms: [] });
    router.push(routes.checkinStep4Notes);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CheckInStepLayout
        step={3}
        totalSteps={4}
        question="How are you feeling today?"
        canContinue={mood !== null}
        onContinue={handleContinue}
        onSkip={handleSkip}
        skipLabel="Prefer not to say"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <View key={m.level} style={styles.moodItem}>
                <MoodFace
                  level={m.level}
                  selected={mood === m.level}
                  onPress={() => handleSelectMood(m.level)}
                />
                <Text style={styles.moodLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
          <GlassSurface variant="input" borderRadius={20} shadow="soft">
            <TextInput
              value={moodNote}
              onChangeText={(text) => {
                setMoodNote(text);
                update({ moodNote: text });
              }}
              placeholder="Add a note about your mood... (optional)"
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.noteInput}
            />
          </GlassSurface>

          <Text style={styles.symptomsHeading}>Any symptoms today?</Text>
          <Text style={styles.symptomsSub}>Select all that apply</Text>
          <View style={styles.chipWrap}>
            {SYMPTOMS.map((symptom) => (
              <GlassChip
                key={symptom}
                label={symptom}
                selected={symptoms.includes(symptom)}
                onPress={() => toggleSymptom(symptom)}
              />
            ))}
          </View>
        </ScrollView>
      </CheckInStepLayout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  scroll: {
    paddingBottom: 16,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: checkInSpacing.sectionGap,
    paddingHorizontal: 2,
    paddingVertical: 12,
    gap: checkInSpacing.moodGap,
    overflow: 'visible',
  },
  moodItem: {
    alignItems: 'center',
    width: 64,
    flex: 1,
    maxWidth: 72,
  },
  moodLabel: {
    fontSize: fontSizes.micro,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    ...textContrast,
  },
  noteInput: {
    backgroundColor: 'transparent',
    padding: 16,
    minHeight: 80,
    fontSize: fontSizes.label,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textPrimary,
    ...textContrast,
    textAlignVertical: 'top',
    borderWidth: 0,
  },
  symptomsHeading: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    ...textContrast,
  },
  symptomsSub: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: spacing.md,
    ...textContrast,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: checkInSpacing.chipGap,
    paddingBottom: 4,
  },
});
