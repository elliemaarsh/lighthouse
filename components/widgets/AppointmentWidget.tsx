import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts } from '@/constants/theme';

export function AppointmentWidget() {
  return (
    <WidgetDecoratedShell label="NEXT APPOINTMENT">
      <Text style={styles.title}>Monitoring visit</Text>
      <WidgetAccentLine width={30} style={styles.accent} />
      <Text style={widgetText.muted}>Thursday · 9:30 AM</Text>
      <Text style={widgetText.caption}>Reproductive clinic</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.extraLight,
    fontSize: 20,
    color: widgetPalette.ink,
    lineHeight: 26,
    zIndex: 1,
  },
  accent: {
    marginVertical: 8,
  },
});
