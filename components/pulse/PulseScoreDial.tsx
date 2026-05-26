import { StyleSheet, Text, View } from 'react-native';

import { DialRulerPicker } from '@/components/ui/DialRulerPicker';
import { PULSE_SCORE_VALUES } from '@/constants/pulseCheck';
import { connectDashboard, fonts } from '@/constants/theme';

type PulseScoreDialProps = {
  value: number | null;
  onChange: (score: number) => void;
  leftLabel: string;
  rightLabel: string;
  /** Maps 1–5 to the subtitle under the large number */
  scoreLabels: Record<number, string>;
};

const VALUES = [...PULSE_SCORE_VALUES];

export function PulseScoreDial({
  value,
  onChange,
  leftLabel,
  rightLabel,
  scoreLabels,
}: PulseScoreDialProps) {
  const unitLabel =
    value != null
      ? scoreLabels[value]
      : 'Slide the dial to choose';

  return (
    <View style={styles.wrap}>
      <DialRulerPicker
        value={value}
        values={VALUES}
        onChange={onChange}
        formatValue={(v) => String(v)}
        unitLabel={unitLabel}
        defaultValue={3}
        placeholderDisplay="—"
        palette="mist"
      />
      <View style={styles.edgeLabels}>
        <Text style={styles.edgeLabel}>{leftLabel}</Text>
        <Text style={[styles.edgeLabel, styles.edgeLabelRight]}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: 4,
  },
  edgeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -4,
  },
  edgeLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    maxWidth: '42%',
  },
  edgeLabelRight: {
    textAlign: 'right',
  },
});
