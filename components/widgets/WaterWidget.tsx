import { StyleSheet, Text, View } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { widgetPalette } from '@/constants/widgetPalette';
import { homeMist } from '@/constants/theme';

const GLASSES = 5;
const GOAL = 8;

export function WaterWidget() {
  return (
    <WidgetDecoratedShell label="WATER" arcRx={52}>
      <Text style={widgetText.valueLarge}>
        {GLASSES}/{GOAL}
      </Text>
      <WidgetAccentLine width={18} />
      <Text style={widgetText.caption}>glasses today</Text>
      <View style={styles.row}>
        {Array.from({ length: GOAL }, (_, i) => (
          <View
            key={i}
            style={[styles.glass, i < GLASSES && styles.glassFilled]}
          />
        ))}
      </View>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 14,
    zIndex: 1,
  },
  glass: {
    flex: 1,
    height: 22,
    borderRadius: 4,
    backgroundColor: homeMist.track,
  },
  glassFilled: {
    backgroundColor: widgetPalette.secondary,
    opacity: 0.85,
  },
});
