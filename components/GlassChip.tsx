import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BUTTON_OPTION_SELECTED, BUTTON_OPTION_UNSELECTED } from '@/constants/buttons';
import { noFocusRing } from '@/lib/focusRing';
import { fontSizes, fonts, partnerDashboard, radius } from '@/constants/theme';

type GlassChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Partner track sheets use filled selection */
  tone?: 'default' | 'partner' | 'checkin';
};

function FlatMistChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={noFocusRing}>
      <View
        style={[
          styles.flatChip,
          selected
            ? [BUTTON_OPTION_SELECTED.container, styles.flatChipSelected]
            : [BUTTON_OPTION_UNSELECTED.container, styles.flatChipIdle],
        ]}
      >
        <Text
          style={[
            styles.flatLabel,
            selected ? BUTTON_OPTION_SELECTED.label : BUTTON_OPTION_UNSELECTED.label,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function GlassChip({ label, selected, onPress, tone = 'default' }: GlassChipProps) {
  if (tone === 'partner') {
    return (
      <Pressable onPress={onPress} style={noFocusRing}>
        <View
          style={[
            styles.partnerChip,
            selected
              ? [BUTTON_OPTION_SELECTED.container, styles.partnerChipSelected]
              : [BUTTON_OPTION_UNSELECTED.container, styles.partnerChipIdle],
          ]}
        >
          <Text
            style={[
              styles.partnerLabel,
              selected
                ? BUTTON_OPTION_SELECTED.label
                : [BUTTON_OPTION_UNSELECTED.label, styles.partnerLabelIdle],
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    );
  }

  return <FlatMistChip label={label} selected={selected} onPress={onPress} />;
}

const styles = StyleSheet.create({
  flatChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
  },
  flatChipIdle: {},
  flatChipSelected: {},
  flatLabel: {
    fontSize: fontSizes.label,
    letterSpacing: 0.2,
  },
  partnerChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
  },
  partnerChipIdle: {},
  partnerChipSelected: {},
  partnerLabel: {
    fontSize: fontSizes.label,
    letterSpacing: 0.2,
  },
  partnerLabelIdle: {
    color: partnerDashboard.textPrimary,
  },
});
