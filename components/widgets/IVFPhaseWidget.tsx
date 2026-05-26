import { StyleSheet, Text, View } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { fonts, homeMist } from '@/constants/theme';

const PHASES = ['Stimulation', 'Retrieval', 'Transfer', 'Wait'] as const;

export function IVFPhaseWidget() {
  const { isIvfJourney, ivfPhase, ivfDay } = useHomeWidgetContext();

  if (!isIvfJourney) {
    return null;
  }

  const activeIndex = PHASES.findIndex(
    (p) => p.toLowerCase() === ivfPhase.toLowerCase(),
  );
  const active = activeIndex >= 0 ? activeIndex : 0;

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc />
        <Text style={widgetCard.label}>IVF PHASE</Text>
        <Text style={styles.phase}>{ivfPhase}</Text>
        <WidgetAccentLine width={36} style={styles.accent} />
        <Text style={styles.days}>Day {ivfDay} of ~12</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '50%' }]} />
        </View>
        <View style={styles.phaseRow}>
          {PHASES.map((phase, i) => (
            <View key={phase} style={styles.phaseCol}>
              <View
                style={[
                  styles.phaseDot,
                  i === active ? styles.phaseDotActive : styles.phaseDotInactive,
                ]}
              />
              <Text
                style={[
                  styles.phaseLabel,
                  i === active && styles.phaseLabelActive,
                ]}
              >
                {phase}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phase: {
    fontFamily: fonts.extraLight,
    fontSize: 22,
    color: homeMist.textPrimary,
    lineHeight: 28,
    zIndex: 1,
  },
  accent: {
    marginTop: 4,
    marginBottom: 4,
  },
  days: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginTop: 4,
    zIndex: 1,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: homeMist.track,
    width: '100%',
    marginTop: 14,
    overflow: 'hidden',
    zIndex: 1,
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: homeMist.highlight,
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    zIndex: 1,
  },
  phaseCol: {
    alignItems: 'center',
    flex: 1,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseDotActive: {
    backgroundColor: homeMist.highlight,
  },
  phaseDotInactive: {
    backgroundColor: homeMist.highlightMuted,
  },
  phaseLabel: {
    fontSize: 9,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginTop: 5,
    textAlign: 'center',
  },
  phaseLabelActive: {
    fontFamily: fonts.medium,
    color: homeMist.highlight,
  },
});
