import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { fonts, homeMist } from '@/constants/theme';

export function MilestoneWidget() {
  const { isIvfJourney, ivfDay } = useHomeWidgetContext();

  return (
    <WidgetDecoratedShell label="MILESTONE">
      <Text style={styles.headline}>
        {isIvfJourney ? `Stimulation day ${ivfDay}` : 'Cycle day 14'}
      </Text>
      <WidgetAccentLine width={36} style={styles.accent} />
      <Text style={widgetText.muted}>
        {isIvfJourney
          ? 'Halfway through your stimulation phase'
          : 'Mid-cycle — keep logging to spot patterns'}
      </Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontFamily: fonts.extraLight,
    fontSize: 20,
    lineHeight: 26,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginVertical: 8,
  },
});
