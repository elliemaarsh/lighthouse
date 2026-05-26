import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { routes } from '@/constants/routes';
import { fonts, homeMist } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export function LogQuickWidget() {
  const role = useUserStore((s) => s.role);

  const onPress = () => {
    if (role === 'non-carrying') {
      router.push(routes.track);
    } else {
      router.push(routes.checkinStep1);
    }
  };

  return (
    <WidgetDecoratedShell label="QUICK LOG" onPress={onPress}>
      <Text style={styles.body}>Open your daily log</Text>
      <WidgetAccentLine width={28} style={styles.accent} />
      <Text style={styles.muted}>Tap to jump to Track</Text>
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
    marginVertical: 8,
  },
  muted: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: homeMist.textMuted,
    zIndex: 1,
  },
});
