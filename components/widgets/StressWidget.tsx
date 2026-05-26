import { StyleSheet, Text, View } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { homeMist } from '@/constants/theme';

const LEVEL = 3;
const MAX = 5;

export function StressWidget() {
  return (
    <WidgetDecoratedShell label="STRESS" arcRx={48}>
      <Text style={widgetText.valueLarge}>
        {LEVEL}/{MAX}
      </Text>
      <WidgetAccentLine width={20} />
      <View style={styles.dots}>
        {Array.from({ length: MAX }, (_, i) => (
          <View
            key={i}
            style={[styles.dot, i < LEVEL && styles.dotFilled]}
          />
        ))}
      </View>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 14,
    zIndex: 1,
  },
  dot: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: homeMist.track,
  },
  dotFilled: {
    backgroundColor: homeMist.highlight,
  },
});
