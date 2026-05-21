import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import {
  LEARN_FILTER_CHIPS,
  type LearnFilterId,
} from '@/constants/learn';
import { colors, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type LearnFilterChipsProps = {
  selected: LearnFilterId;
  onSelect: (id: LearnFilterId) => void;
};

export function LearnFilterChips({ selected, onSelect }: LearnFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {LEARN_FILTER_CHIPS.map((chip) => {
        const active = chip.id === selected;
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
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    paddingRight: 8,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(26, 36, 34, 0.1)',
  },
  chipSelected: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  chipLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: colors.white,
  },
});
