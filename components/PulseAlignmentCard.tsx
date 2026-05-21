import { StyleSheet, Text, View } from 'react-native';

import { alignmentMessage } from '@/lib/pulseChecks';
import { colors, fonts } from '@/constants/theme';

type PulseAlignmentCardProps = {
  userScore: number;
  partnerScore: number | null;
  userNeed: string;
  partnerNeed: string | null;
  week: string;
};

function ScoreDots({ score }: { score: number }) {
  const filled = Math.round(Math.max(1, Math.min(5, score)));
  return (
    <View style={styles.dotsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[styles.dot, n <= filled ? styles.dotFilled : styles.dotEmpty]}
        />
      ))}
    </View>
  );
}

function formatWeekLabel(weekStart: string): string {
  const start = new Date(`${weekStart}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function PulseAlignmentCard({
  userScore,
  partnerScore,
  userNeed,
  partnerNeed,
  week,
}: PulseAlignmentCardProps) {
  const alignment =
    partnerScore != null
      ? Math.round(((userScore + partnerScore) / 2) * 10) / 10
      : userScore;

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>ALIGNMENT</Text>
      <Text style={styles.score}>
        {alignment}
        <Text style={styles.scoreOf}> / 5</Text>
      </Text>
      <ScoreDots score={alignment} />
      <Text style={styles.message}>{alignmentMessage(alignment)}</Text>
      <Text style={styles.week}>{formatWeekLabel(week)}</Text>

      <View style={styles.needsRow}>
        <View style={styles.needCol}>
          <Text style={styles.needLabel}>YOU</Text>
          <Text style={styles.needText}>{userNeed}</Text>
        </View>
        {partnerNeed ? (
          <View style={styles.needCol}>
            <Text style={styles.needLabel}>PARTNER</Text>
            <Text style={styles.needText}>{partnerNeed}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 280,
    minHeight: 280,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
    backgroundColor: colors.cardUnselectedBg,
    marginVertical: 24,
  },
  kicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  score: {
    fontSize: 52,
    fontFamily: fonts.light,
    color: colors.textPrimary,
    lineHeight: 56,
  },
  scoreOf: {
    fontSize: 22,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: colors.textPrimary,
  },
  dotEmpty: {
    backgroundColor: colors.surface,
  },
  message: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 200,
    marginTop: 8,
    lineHeight: 18,
  },
  week: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 6,
  },
  needsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  needCol: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
  },
  needLabel: {
    fontSize: 9,
    fontFamily: fonts.medium,
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  needText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});
