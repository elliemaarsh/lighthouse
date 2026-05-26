import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { fonts, homeMist } from '@/constants/theme';

const PROMPTS = [
  'What felt supportive today?',
  'One small win from this week',
  'Something your body did well today',
  'A moment of calm you noticed',
  'Someone who showed up for you',
  'Progress you made, however small',
  'A comfort you are grateful for',
];

export function GratitudeWidget() {
  const prompt = PROMPTS[new Date().getDay()];

  return (
    <WidgetDecoratedShell label="GRATITUDE">
      <Text style={styles.prompt}>{prompt}</Text>
      <WidgetAccentLine width={28} style={styles.accent} />
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  prompt: {
    fontFamily: fonts.extraLight,
    fontSize: 17,
    lineHeight: 26,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginTop: 12,
  },
});
