import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { GlassSurface } from '@/components/GlassSurface';
import { useCheckIn } from '@/contexts/CheckInContext';
import { checkInSpacing } from '@/constants/checkIn';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, radius, textContrast, typography } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

const PROMPTS = ['Feeling hopeful', 'Hard day emotionally', 'Grateful today'];

export default function CheckInStep5() {
  const { data, update } = useCheckIn();
  const [notes, setNotes] = useState(data.notes);

  const appendPrompt = (text: string) => {
    const next = notes.trim() ? `${notes.trim()} ${text}` : text;
    setNotes(next);
    update({ notes: next });
  };

  const handleContinue = () => {
    update({ notes: notes.trim() });
    router.push(routes.checkinComplete);
  };

  const handleSkip = () => {
    update({ notes: '' });
    router.push(routes.checkinComplete);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CheckInStepLayout
        step={4}
        totalSteps={4}
        question="Anything else on your mind?"
        subtext="This is your space. No one else sees this unless you choose to share."
        canContinue
        onContinue={handleContinue}
        onSkip={handleSkip}
        skipLabel="Nothing to add"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <GlassSurface
            variant="input"
            borderRadius={20}
            shadow="soft"
            style={styles.inputGlass}
          >
            <TextInput
              value={notes}
              onChangeText={(text) => {
                setNotes(text);
                update({ notes: text });
              }}
              placeholder="Write freely..."
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.input}
            />
          </GlassSurface>
          <View style={styles.prompts}>
            {PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => appendPrompt(prompt)}
                style={[styles.promptWrap, noFocusRing]}
              >
                <GlassSurface variant="pill" borderRadius={radius.pill} shadow="none">
                  <View style={styles.promptInner}>
                    <Text style={styles.promptText}>{prompt}</Text>
                  </View>
                </GlassSurface>
              </Pressable>
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
    paddingBottom: checkInSpacing.sectionGap,
  },
  inputGlass: {
    marginBottom: checkInSpacing.sectionGap,
  },
  input: {
    backgroundColor: 'transparent',
    padding: 22,
    minHeight: 160,
    fontSize: 15,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    ...textContrast,
  },
  prompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: checkInSpacing.promptGap,
  },
  promptWrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  promptInner: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  promptText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    ...textContrast,
  },
});
