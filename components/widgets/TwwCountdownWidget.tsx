import { StyleSheet, Text, View } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { homeMist } from '@/constants/theme';

const DAY = 5;
const TOTAL = 14;

export function TwwCountdownWidget() {
  const progress = DAY / TOTAL;

  return (
    <WidgetDecoratedShell label="TWO-WEEK WAIT">
      <Text style={widgetText.valueLarge}>
        Day {DAY} of {TOTAL}
      </Text>
      <WidgetAccentLine width={28} />
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={widgetText.caption}>Transfer was 5 days ago</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: homeMist.track,
    marginTop: 12,
    overflow: 'hidden',
    zIndex: 1,
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: homeMist.highlight,
  },
});
