import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

export type CommunityTagChip = {
  id: string;
  label: string;
};

type CommunityTagChipsProps = {
  chips: CommunityTagChip[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CommunityTagChips({
  chips,
  selectedId,
  onSelect,
}: CommunityTagChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {chips.map((chip) => {
        const active = chip.id === selectedId;
        return (
          <Pressable
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            style={[styles.chip, active && styles.chipSelected, noFocusRing]}
          >
            <Text style={[styles.chipLabel, active && styles.chipLabelSelected]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingRight: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(26, 36, 34, 0.1)',
    alignSelf: 'center',
  },
  chipSelected: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  chipLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  chipLabelSelected: {
    color: colors.white,
  },
});
