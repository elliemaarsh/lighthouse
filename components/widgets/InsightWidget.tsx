import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { fonts, homeMist } from '@/constants/theme';

export function InsightWidget() {
  const { partnerName } = useHomeWidgetContext();

  return (
    <WidgetDecoratedShell label="DAILY INSIGHT" arcRx={64}>
      <Text style={styles.lead}>
        {partnerName.charAt(0).toUpperCase()}
        {partnerName.slice(1)} may appreciate a low-key evening — energy has been lower
        after appointments this week.
      </Text>
      <WidgetAccentLine width={40} style={styles.accent} />
      <Text style={widgetText.caption}>AI generated</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.extraLight,
    fontSize: 17,
    lineHeight: 26,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginVertical: 10,
  },
});
