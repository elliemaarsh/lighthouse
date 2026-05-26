import { StyleSheet, Text, View } from 'react-native';

import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts } from '@/constants/theme';

const REMINDERS = [
  { time: '8:00 AM', name: 'Gonal-F' },
  { time: '8:00 PM', name: 'Cetrotide' },
];

export function MedicationWidget() {
  return (
    <WidgetDecoratedShell label="MEDICATION">
      {REMINDERS.map((item) => (
        <View key={item.name} style={styles.row}>
          <View style={styles.timePill}>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={widgetText.body}>{item.name}</Text>
        </View>
      ))}
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    zIndex: 1,
  },
  timePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: widgetPalette.primaryFillSoft,
    minWidth: 64,
  },
  time: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: widgetPalette.primary,
    textAlign: 'center',
  },
});
