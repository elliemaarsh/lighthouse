import { StyleSheet, Text, View } from 'react-native';

import { PartnerGlassCard } from '@/components/partner/PartnerGlassCard';
import { colors, fontSizes, fonts, textContrast } from '@/constants/theme';

type PartnerDailyStreakCardProps = {
  streak: number;
};

const WEEK_DOTS = 7;

export function PartnerDailyStreakCard({ streak }: PartnerDailyStreakCardProps) {
  const todayIndex = new Date().getDay();

  return (
    <PartnerGlassCard style={styles.card} padding={20}>
      <Text style={styles.label}>Daily streak</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{streak}</Text>
        <Text style={styles.unit}>days</Text>
      </View>
      <View style={styles.timeline}>
        {Array.from({ length: WEEK_DOTS }, (_, i) => {
          const isToday = i === todayIndex % WEEK_DOTS;
          return (
            <View key={i} style={styles.dotSlot}>
              {isToday ? <View style={styles.todayBar} /> : <View style={styles.dot} />}
            </View>
          );
        })}
      </View>
    </PartnerGlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1.35,
    minHeight: 148,
  },
  label: {
    fontSize: fontSizes.statLabel,
    fontFamily: fonts.medium,
    letterSpacing: 1.2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    ...textContrast,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 10,
  },
  value: {
    fontSize: 44,
    fontFamily: fonts.light,
    color: colors.textPrimary,
    letterSpacing: 1,
    ...textContrast,
  },
  unit: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    ...textContrast,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 20,
  },
  dotSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 22,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  todayBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.accentLime,
  },
});
