import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import {
  LEARN_FILTER_CHIPS,
  type LearnFilterId,
} from '@/constants/learn';
import {
  BUTTON_OPTION_SELECTED,
  BUTTON_OPTION_UNSELECTED,
} from '@/constants/buttons';
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
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 8,
  },
  chip: {
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...BUTTON_OPTION_UNSELECTED.container,
  },
  chipSelected: {
    ...BUTTON_OPTION_SELECTED.container,
  },
  chipLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
    ...BUTTON_OPTION_UNSELECTED.label,
  },
  chipLabelSelected: {
    ...BUTTON_OPTION_SELECTED.label,
  },
});
