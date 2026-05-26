import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { GlassChip } from '@/components/GlassChip';
import { inputFieldStyle } from '@/constants/surfaces';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { NOTE_QUICK_INSERTS } from '@/constants/partner';
import { colors, fontSizes, fonts, radius, textContrast } from '@/constants/theme';
import type { PartnerLogData } from '@/types/partnerLog';

type NotesSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function NotesSheetContent({ log, onSave }: NotesSheetContentProps) {
  const [notes, setNotes] = useState(log.notes);

  useEffect(() => {
    setNotes(log.notes);
  }, [log.notes]);

  const insert = (text: string) => {
    setNotes((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
  };

  const handleSave = () => {
    onSave({ notes: notes.trim() });
  };

  return (
    <PartnerSheetShell title="Notes" onSave={handleSave}>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="How are you feeling today?"
        placeholderTextColor={colors.textMuted}
        multiline
        style={styles.input}
        textAlignVertical="top"
      />
      <View style={styles.quickRow}>
        {NOTE_QUICK_INSERTS.map((text) => (
          <GlassChip
            key={text}
            label={text}
            selected={false}
            onPress={() => insert(text)}
            tone="partner"
          />
        ))}
      </View>
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  input: {
    ...inputFieldStyle,
    width: '100%',
    borderRadius: radius.card,
    minHeight: 160,
    padding: 20,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 22,
    ...textContrast,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
});
