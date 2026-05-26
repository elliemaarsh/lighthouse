import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BUTTON_OPTION_SELECTED,
  BUTTON_OPTION_UNSELECTED,
} from '@/constants/buttons';
import { connectDashboard } from '@/constants/theme';

type PulseScorePillsProps = {
  value: number | null;
  onChange: (score: number) => void;
  leftLabel: string;
  rightLabel: string;
};

const SCORES = [1, 2, 3, 4, 5] as const;

export function PulseScorePills({
  value,
  onChange,
  leftLabel,
  rightLabel,
}: PulseScorePillsProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {SCORES.map((score) => {
          const selected = value === score;
          return (
            <Pressable
              key={score}
              onPress={() => onChange(score)}
              style={[
                styles.pill,
                selected
                  ? BUTTON_OPTION_SELECTED.container
                  : BUTTON_OPTION_UNSELECTED.container,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                style={[
                  styles.num,
                  selected ? BUTTON_OPTION_SELECTED.label : BUTTON_OPTION_UNSELECTED.label,
                ]}
              >
                {score}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{leftLabel}</Text>
        <Text style={styles.label}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  pill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontSize: 18,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 52 * 5 + 10 * 4,
    marginTop: 10,
  },
  label: {
    fontSize: 11,
    fontFamily: BUTTON_OPTION_UNSELECTED.label.fontFamily,
    color: connectDashboard.textMuted,
  },
});
