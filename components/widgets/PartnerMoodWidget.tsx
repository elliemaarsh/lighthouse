import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';

export function PartnerMoodWidget() {
  const { partnerName, isCarrying } = useHomeWidgetContext();
  const who = isCarrying ? partnerName : 'You';

  return (
    <WidgetDecoratedShell label={`${who.toUpperCase()}'S MOOD`}>
      <Text style={widgetText.valueMedium}>Hopeful</Text>
      <WidgetAccentLine width={18} style={styles.accent} />
      <Text style={widgetText.body}>Feeling steady after yesterday&apos;s appointment</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  accent: {
    marginVertical: 8,
  },
});
