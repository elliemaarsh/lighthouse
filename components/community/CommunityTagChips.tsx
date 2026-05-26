import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import {
  BUTTON_OPTION_SELECTED,
  BUTTON_OPTION_UNSELECTED,
} from '@/constants/buttons';
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
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    ...BUTTON_OPTION_UNSELECTED.container,
  },
  chipSelected: {
    ...BUTTON_OPTION_SELECTED.container,
  },
  chipLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 18,
    ...BUTTON_OPTION_UNSELECTED.label,
  },
  chipLabelSelected: {
    ...BUTTON_OPTION_SELECTED.label,
  },
});
