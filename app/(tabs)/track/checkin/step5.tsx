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

import { useCheckInEditMode } from '@/hooks/useCheckInEditMode';
import { CheckInStepLayout } from '@/components/checkin/CheckInStepLayout';
import { stashCheckInCompletionSnapshot } from '@/lib/checkInComplete';
import {
  checkInDraftToData,
  useCheckInStore,
} from '@/store/useCheckInStore';
import { checkInSpacing } from '@/constants/checkIn';
import { routes } from '@/constants/routes';
import { BUTTON_TIER_1 } from '@/constants/buttons';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fontSizes, fonts, radius, typography } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

const PROMPTS = ['Feeling hopeful', 'Hard day emotionally', 'Grateful today'];

export default function CheckInStep5() {
  const isEdit = useCheckInEditMode();
  const draft = useCheckInStore();
  const setField = useCheckInStore((s) => s.setField);
  const [notes, setNotes] = useState(draft.notes);

  const appendPrompt = (text: string) => {
    const next = notes.trim() ? `${notes.trim()} ${text}` : text;
    setNotes(next);
    setField('notes', next);
  };

  const goToComplete = () => {
    stashCheckInCompletionSnapshot(checkInDraftToData(useCheckInStore.getState()));
    router.push(routes.checkinComplete);
  };

  const handleContinue = () => {
    setField('notes', notes.trim());
    goToComplete();
  };

  const handleSkip = () => {
    setField('notes', '');
    goToComplete();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CheckInStepLayout
        step={4}
        totalSteps={4}
        editMode={isEdit}
        question="Anything else on your mind?"
        subtext="This is your space. No one else sees this unless you choose to share."
        canContinue
        onContinue={handleContinue}
        onSkip={handleSkip}
        skipLabel="Nothing to add"
        continueLabel={isEdit ? 'Save' : 'Continue →'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <TextInput
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setField('notes', text);
            }}
            placeholder="Write freely..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.input}
          />
          <View style={styles.prompts}>
            {PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => appendPrompt(prompt)}
                style={[styles.promptPill, noFocusRing]}
              >
                <Text style={styles.promptText}>{prompt}</Text>
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
  input: {
    ...inputFieldStyle,
    borderRadius: 16,
    padding: 22,
    minHeight: 160,
    fontSize: 15,
    fontFamily: typography.subtext.fontFamily,
    color: '#1A1A1A',
    textAlignVertical: 'top',
    marginBottom: checkInSpacing.sectionGap,
  },
  prompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: checkInSpacing.promptGap,
  },
  promptPill: {
    ...BUTTON_TIER_1.container,
    borderRadius: radius.pill,
  },
  promptText: {
    ...BUTTON_TIER_1.label,
  },
});
