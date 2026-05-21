import { StyleSheet, Switch, Text, View } from 'react-native';

import { ConnectBlurCard } from '@/components/connect/ConnectBlurCard';
import { connectDashboard, fontSizes, fonts, textContrast } from '@/constants/theme';
import type { SharingPrefs } from '@/types/connect';

type ConnectSharingCardProps = {
  prefs: SharingPrefs;
  onChange: (prefs: SharingPrefs) => void;
};

const ROWS: { key: keyof SharingPrefs; label: string }[] = [
  { key: 'moodShared', label: 'Mood' },
  { key: 'symptomsShared', label: 'Symptoms' },
  { key: 'cycleShared', label: 'Cycle data' },
];

export function ConnectSharingCard({ prefs, onChange }: ConnectSharingCardProps) {
  const toggle = (key: keyof SharingPrefs, value: boolean) => {
    onChange({ ...prefs, [key]: value });
  };

  return (
    <ConnectBlurCard style={styles.card} padding={16}>
      <Text style={styles.label}>SHARING</Text>
      {ROWS.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Switch
            value={prefs[row.key]}
            onValueChange={(v) => toggle(row.key, v)}
            trackColor={{
              false: 'rgba(255, 255, 255, 0.15)',
              true: 'rgba(255, 255, 255, 0.35)',
            }}
            thumbColor={connectDashboard.textPrimary}
            ios_backgroundColor="rgba(255, 255, 255, 0.15)"
          />
        </View>
      ))}
      <Text style={styles.hint}>Partner sees only what you share</Text>
    </ConnectBlurCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: connectDashboard.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: connectDashboard.textPrimary,
    ...textContrast,
  },
  hint: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    marginTop: 8,
  },
});
