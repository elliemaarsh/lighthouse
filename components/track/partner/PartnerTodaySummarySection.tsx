import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { STRESS_LEVELS } from '@/constants/partner';
import { lightCardShadow } from '@/constants/glass';
import { formatTodayHeader } from '@/lib/trackWeekView';
import type { TodayLog } from '@/types/partnerLogStore';
import type { PartnerCategoryId, HeatLevel } from '@/types/partnerLog';
import { fonts } from '@/constants/theme';
import {
  countLoggedFromTodayLog,
  isCorePartnerLogComplete,
} from '@/lib/partnerLogMappers';

const TRACK = {
  muted: '#9BB0AC',
  ink: '#1A1A1A',
  accent: '#27359E',
  accentSoft: 'rgba(39, 53, 158, 0.08)',
  blue: '#80B9FE',
} as const;

const HEAT_COLORS: Record<HeatLevel, string> = {
  low: '#9BB0AC',
  medium: '#C4947A',
  high: '#C17B7B',
};

const HEAT_FILL: Record<HeatLevel, number> = {
  low: 0.33,
  medium: 0.66,
  high: 1,
};

type PartnerTodaySummarySectionProps = {
  todayLog: TodayLog;
  onOpenCategory: (id: PartnerCategoryId) => void;
  onEdit: () => void;
};

export function PartnerTodaySummarySection({
  todayLog,
  onOpenCategory,
  onEdit,
}: PartnerTodaySummarySectionProps) {
  const fullyLogged = isCorePartnerLogComplete(todayLog);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.dateHeader}>{formatTodayHeader()}</Text>
        {fullyLogged ? (
          <Pressable onPress={onEdit} hitSlop={8}>
            <Text style={styles.editLink}>Edit log</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.bento}>
        <View style={styles.splitRow}>
          <Pressable
            style={styles.halfCard}
            onPress={() => onOpenCategory('sleep')}
            accessibilityRole="button"
          >
            <Text style={styles.metricLabel}>SLEEP</Text>
            {todayLog.sleep ? (
              <>
                <Text style={styles.metricValue}>
                  {todayLog.sleep.hours}h {todayLog.sleep.minutes}m
                </Text>
                <SleepArc
                  hours={todayLog.sleep.hours + todayLog.sleep.minutes / 60}
                />
              </>
            ) : (
              <Text style={styles.metricValue}>—</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.halfCard}
            onPress={() => onOpenCategory('exercise')}
            accessibilityRole="button"
          >
            <Text style={styles.metricLabel}>EXERCISE</Text>
            {todayLog.exercise == null ? (
              <Text style={styles.metricValue}>—</Text>
            ) : todayLog.exercise.active ? (
              <>
                <Text style={styles.metricValue}>Active</Text>
                {todayLog.exercise.minutes != null ? (
                  <Text style={styles.subValue}>{todayLog.exercise.minutes} min</Text>
                ) : null}
                {todayLog.exercise.types.length > 0 ? (
                  <View style={styles.dotRow}>
                    {todayLog.exercise.types.map((t) => (
                      <View key={t} style={styles.typeDot} />
                    ))}
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={[styles.metricValue, styles.restValue]}>Rest</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.splitRow}>
          <Pressable
            style={styles.halfCard}
            onPress={() => onOpenCategory('heat')}
            accessibilityRole="button"
          >
            <Text style={styles.metricLabel}>HEAT</Text>
            {todayLog.heat ? (
              <>
                <Text
                  style={[
                    styles.metricValue,
                    { color: HEAT_COLORS[todayLog.heat as HeatLevel] ?? TRACK.ink },
                  ]}
                >
                  {todayLog.heat.charAt(0).toUpperCase() + todayLog.heat.slice(1)}
                </Text>
                <HeatThermometer level={todayLog.heat as HeatLevel} />
              </>
            ) : (
              <Text style={styles.metricValue}>—</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.halfCard}
            onPress={() => onOpenCategory('stress')}
            accessibilityRole="button"
          >
            <Text style={styles.metricLabel}>STRESS</Text>
            {todayLog.stress != null ? (
              <>
                <Text style={styles.metricValue}>
                  {formatStressLabel(todayLog.stress)}
                </Text>
                <StressDots level={todayLog.stress} />
              </>
            ) : (
              <Text style={styles.metricValue}>—</Text>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.fullCard}
          onPress={() => onOpenCategory('substances')}
          accessibilityRole="button"
        >
          <Text style={styles.metricLabel}>SUBSTANCES</Text>
          <SubstancesBody log={todayLog} />
        </Pressable>

        <Pressable
          style={styles.fullCard}
          onPress={() => onOpenCategory('notes')}
          accessibilityRole="button"
        >
          <Text style={styles.metricLabel}>NOTES</Text>
          <Text style={styles.notesBody} numberOfLines={4}>
            {todayLog.notes?.trim() ? todayLog.notes : 'No notes'}
          </Text>
        </Pressable>
      </View>

      {countLoggedFromTodayLog(todayLog) > 0 ? (
        <Pressable onPress={onEdit} style={styles.editBelow}>
          <Text style={styles.editLink}>Edit log</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function formatStressLabel(level: number): string {
  const meta = STRESS_LEVELS.find((s) => s.level === level);
  return meta ? `${level} ${meta.label}` : String(level);
}

function SleepArc({ hours }: { hours: number }) {
  const ratio = Math.min(1, Math.max(0, hours / 9));
  const w = 64;
  const h = 32;
  const r = 26;
  const cx = w / 2;
  const cy = h;
  const startAngle = Math.PI;
  const endAngle = Math.PI + Math.PI * ratio;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const large = ratio > 0.5 ? 1 : 0;
  const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;

  return (
    <Svg width={w} height={h} style={styles.sleepArc}>
      <Path
        d={d}
        stroke={TRACK.blue}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function HeatThermometer({ level }: { level: HeatLevel }) {
  const fillPct = HEAT_FILL[level];
  const color = HEAT_COLORS[level];
  return (
    <View style={styles.thermoTrack}>
      <View
        style={[
          styles.thermoFill,
          {
            height: 36 * fillPct,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function StressDots({ level }: { level: number }) {
  return (
    <View style={styles.stressDots}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[
            styles.stressDot,
            n <= level ? styles.stressDotFilled : styles.stressDotEmpty,
          ]}
        />
      ))}
    </View>
  );
}

function SubstancesBody({ log }: { log: TodayLog }) {
  if (!log.substances.length) {
    return <Text style={styles.noneLogged}>None logged</Text>;
  }

  const pills: string[] = [];
  for (const s of log.substances) {
    if (s === 'None') continue;
    if (s === 'Alcohol' && log.alcoholDrinks > 0) {
      pills.push(`Alcohol (${log.alcoholDrinks} drinks)`);
    } else {
      pills.push(s);
    }
  }

  if (pills.length === 0 && log.substances.includes('None')) {
    return <Text style={styles.noneLogged}>None</Text>;
  }

  return (
    <View style={styles.pillRow}>
      {pills.map((label) => (
        <View key={label} style={styles.pill}>
          <Text style={styles.pillText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateHeader: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: TRACK.muted,
  },
  editLink: {
    fontSize: 12,
    fontFamily: fonts.light,
    color: TRACK.muted,
  },
  editBelow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bento: {
    gap: 12,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    minWidth: 0,
    ...lightCardShadow,
  },
  fullCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    ...lightCardShadow,
  },
  metricLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontFamily: fonts.extraLight,
    color: TRACK.ink,
    lineHeight: 28,
  },
  subValue: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginTop: 2,
  },
  restValue: {
    color: TRACK.muted,
  },
  notesBody: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: TRACK.ink,
    lineHeight: 20,
  },
  noneLogged: {
    fontSize: 15,
    fontFamily: fonts.light,
    color: TRACK.muted,
  },
  sleepArc: {
    marginTop: 8,
  },
  thermoTrack: {
    width: 6,
    height: 36,
    borderRadius: 3,
    backgroundColor: 'rgba(26, 26, 26, 0.08)',
    marginTop: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  thermoFill: {
    width: '100%',
    borderRadius: 3,
  },
  stressDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  stressDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  stressDotFilled: {
    backgroundColor: TRACK.accent,
  },
  stressDotEmpty: {
    backgroundColor: 'rgba(39, 53, 158, 0.12)',
  },
  dotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK.blue,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    backgroundColor: TRACK.accentSoft,
    borderWidth: 0.5,
    borderColor: TRACK.accent,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillText: {
    fontSize: 12,
    fontFamily: fonts.light,
    color: TRACK.accent,
  },
});
