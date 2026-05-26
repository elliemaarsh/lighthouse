import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { routes } from '@/constants/routes';
import { fonts, homeMist } from '@/constants/theme';

export function ExportWidget() {
  return (
    <WidgetDecoratedShell label="EXPORT" onPress={() => router.push(routes.trackExport)}>
      <Text style={styles.body}>Medical report for your clinic</Text>
      <WidgetAccentLine width={32} style={styles.accent} />
      <Text style={styles.muted}>PDF export · tap to open</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fonts.extraLight,
    fontSize: 17,
    lineHeight: 24,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginVertical: 10,
  },
  muted: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: homeMist.textMuted,
    zIndex: 1,
  },
});
