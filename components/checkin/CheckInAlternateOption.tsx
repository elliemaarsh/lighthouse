import { Pressable, StyleSheet, Text } from 'react-native';

import { BUTTON_OPTION_SELECTED, BUTTON_TIER_1 } from '@/constants/buttons';
import { noFocusRing } from '@/lib/focusRing';
import { radius } from '@/constants/theme';

type CheckInAlternateOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function CheckInAlternateOption({
  label,
  selected,
  onPress,
}: CheckInAlternateOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, noFocusRing]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginTop: 28,
    borderRadius: radius.pill,
    ...BUTTON_TIER_1.container,
  },
  text: {
    ...BUTTON_TIER_1.label,
    opacity: 0.55,
  },
  textSelected: {
    ...BUTTON_OPTION_SELECTED.label,
    opacity: 1,
  },
});
