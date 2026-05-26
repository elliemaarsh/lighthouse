import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { fonts, homeMist } from '@/constants/theme';

const AFFIRMATIONS = [
  'You are doing enough.',
  'This journey is hard and you are brave.',
  'One day at a time is a valid pace.',
  'Your feelings make sense.',
  'Rest is part of the work.',
  'You and your partner are a team.',
  'Hope and grief can coexist.',
];

export function AffirmationWidget() {
  const line = AFFIRMATIONS[new Date().getDay()];

  return (
    <WidgetDecoratedShell label="AFFIRMATION">
      <Text style={styles.quote}>{line}</Text>
      <WidgetAccentLine width={32} style={styles.accent} />
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  quote: {
    fontFamily: fonts.extraLight,
    fontSize: 18,
    lineHeight: 28,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginTop: 12,
  },
});
