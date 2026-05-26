import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { widgetPalette } from '@/constants/widgetPalette';

type WidgetAccentLineProps = {
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/** Subtle gold accent tick under hero values */
export function WidgetAccentLine({ width = 28, style }: WidgetAccentLineProps) {
  return (
    <View
      style={[styles.line, { width, backgroundColor: widgetPalette.accentLine, opacity: 0.35 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: 2,
    borderRadius: 1,
    marginTop: 8,
  },
});
