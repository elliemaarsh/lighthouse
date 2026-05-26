import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BUTTON_OPTION_SELECTED,
  BUTTON_OPTION_UNSELECTED,
} from '@/constants/buttons';
import { noFocusRing } from '@/lib/focusRing';
import { fontSizes, radius } from '@/constants/theme';

type GlassPillOptionProps = {
  index: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  wide?: boolean;
};

export function GlassPillOption({
  index,
  label,
  selected,
  onPress,
  wide = false,
}: GlassPillOptionProps) {
  const option = selected ? BUTTON_OPTION_SELECTED : BUTTON_OPTION_UNSELECTED;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, wide && styles.wrapWide, noFocusRing]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={[styles.pill, option.container]}>
        <Text style={[styles.index, option.index]}>{index}</Text>
        <Text style={[styles.label, option.label]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '47%',
    marginBottom: 4,
  },
  wrapWide: {
    width: '100%',
  },
  pill: {
    minHeight: 84,
    paddingVertical: 18,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  index: {
    fontSize: fontSizes.pillIndex,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  label: {
    fontSize: fontSizes.body,
    letterSpacing: 0.15,
  },
});
