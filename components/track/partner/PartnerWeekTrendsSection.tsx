import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { lightCardShadow } from '@/constants/glass';
import { getTodayDateString } from '@/lib/date';
import { countLoggedFromTodayLog } from '@/lib/partnerLogMappers';
import { PARTNER_WEEK_DAY_LABELS } from '@/lib/partnerWeek';
import type { PartnerWeekDayLog, TodayLog } from '@/types/partnerLogStore';
import { fonts } from '@/constants/theme';

const TRACK = {
  muted: '#9BB0AC',
  ink: '#1A1A1A',
  accent: '#27359E',
  blue: '#80B9FE',
  blueGhost: 'rgba(128, 185, 254, 0.15)',
  track: 'rgba(26, 26, 26, 0.08)',
} as const;

const SUBSTANCE_COLORS: Record<string, string> = {
  Alcohol: '#F14E2A',
  'Caffeine (3+ cups)': '#EDE290',
  Smoking: '#C17B7B',
  Cannabis: '#80B9FE',
};

type PartnerWeekTrendsSectionProps = {
  weeklyLogs: PartnerWeekDayLog[];
  todayLog: TodayLog | null;
};

export function PartnerWeekTrendsSection({
  weeklyLogs,
  todayLog,
}: PartnerWeekTrendsSectionProps) {
  const today = getTodayDateString();
  const showHint =
    countLoggedFromTodayLog(todayLog) < 6;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>THIS WEEK&apos;S TRENDS</Text>

      <ActivityWeekCard days={weeklyLogs} today={today} />
      <SubstanceWeekCard days={weeklyLogs} today={today} />
      <StressWeekCard days={weeklyLogs} today={today} />

      {showHint ? (
        <Text style={styles.hint}>Log today to see your trends update →</Text>
      ) : null}
    </View>
  );
}

function ActivityWeekCard({
  days,
  today,
}: {
  days: PartnerWeekDayLog[];
  today: string;
}) {
  const maxMinutes = 60;
  const chartH = 48;
  const minH = 8;

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>ACTIVITY THIS WEEK</Text>
      <View style={styles.barRow}>
        {days.map((day, i) => {
          const isToday = day.date === today;
          const active = day.exercise?.active === true;
          const minutes = active ? (day.exercise?.minutes ?? 0) : 0;
          const rest = day.exercise?.active === false;
          const notLogged = day.exercise == null;
          const barH =
            notLogged || rest
              ? minH
              : minH + ((Math.min(minutes, maxMinutes) / maxMinutes) * (chartH - minH));
          const barColor = notLogged
            ? TRACK.track
            : rest
              ? TRACK.blueGhost
              : isToday
                ? TRACK.accent
                : TRACK.blue;

          return (
            <View key={day.date} style={styles.barCol}>
              <View style={[styles.barTrack, { height: chartH }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barH,
                      width: isToday ? 28 : 24,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{PARTNER_WEEK_DAY_LABELS[i]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function substanceDotColor(name: string): string {
  for (const [key, color] of Object.entries(SUBSTANCE_COLORS)) {
    if (name.includes(key.split(' ')[0]!)) return color;
  }
  return TRACK.muted;
}

function SubstanceWeekCard({
  days,
  today,
}: {
  days: PartnerWeekDayLog[];
  today: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>SUBSTANCE TRENDS</Text>
      <View style={styles.barRow}>
        {days.map((day, i) => {
          const substances = day.substances.filter((s) => s !== 'None');
          const isToday = day.date === today;
          return (
            <View key={day.date} style={styles.barCol}>
              <View style={[styles.dotStack, isToday && styles.dotStackToday]}>
                {substances.length === 0 ? (
                  <View style={styles.dotGrey} />
                ) : (
                  substances.slice(0, 3).map((s) => (
                    <View
                      key={s}
                      style={[styles.subDot, { backgroundColor: substanceDotColor(s) }]}
                    />
                  ))
                )}
              </View>
              <Text style={styles.dayLabel}>{PARTNER_WEEK_DAY_LABELS[i]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StressWeekCard({
  days,
  today,
}: {
  days: PartnerWeekDayLog[];
  today: string;
}) {
  const chartW = 280;
  const chartH = 72;
  const padL = 18;
  const padR = 8;
  const padT = 6;
  const padB = 4;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const values = days.map((d) => d.stress ?? 0);
  const points = values.map((v, i) => {
    const x = padL + (i / Math.max(1, values.length - 1)) * innerW;
    const y = padT + innerH - ((v - 1) / 4) * innerH;
    return { x, y, v, date: days[i]!.date };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath =
    points.length > 0
      ? `M ${points[0]!.x} ${padT + innerH} ` +
        points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${points[points.length - 1]!.x} ${padT + innerH} Z`
      : '';

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>STRESS THIS WEEK</Text>
      <View style={styles.stressChartRow}>
        <View style={styles.yLabels}>
          {[5, 4, 3, 2, 1].map((n) => (
            <Text key={n} style={styles.yLabel}>
              {n}
            </Text>
          ))}
        </View>
        <Svg width={chartW} height={chartH + 20}>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padT + (i / 4) * innerH;
            return (
              <Line
                key={i}
                x1={padL}
                y1={y}
                x2={padL + innerW}
                y2={y}
                stroke="rgba(26, 26, 26, 0.06)"
                strokeWidth={0.5}
              />
            );
          })}
          {areaPath ? (
            <Path d={areaPath} fill="rgba(39, 53, 158, 0.06)" stroke="none" />
          ) : null}
          {points
            .filter((p) => p.date === today)
            .map((p) => (
              <Circle
                key={`ring-${p.date}`}
                cx={p.x}
                cy={p.y}
                r={8}
                fill="rgba(39, 53, 158, 0.2)"
              />
            ))}
          {linePoints ? (
            <Polyline
              points={linePoints}
              fill="none"
              stroke={TRACK.accent}
              strokeWidth={1.5}
            />
          ) : null}
          {points.map((p) => {
            const isToday = p.date === today;
            if (days.find((d) => d.date === p.date)?.stress == null) {
              return null;
            }
            return (
              <Circle
                key={p.date}
                cx={p.x}
                cy={p.y}
                r={isToday ? 5 : 3}
                fill={TRACK.accent}
              />
            );
          })}
        </Svg>
      </View>
      <View style={styles.dayRowUnderChart}>
        {PARTNER_WEEK_DAY_LABELS.map((label, i) => (
          <Text key={`stress-day-${i}`} style={styles.dayLabelCentered}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    ...lightCardShadow,
  },
  cardLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 9,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginTop: 6,
  },
  dotStack: {
    minHeight: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  dotStackToday: {
    opacity: 1,
  },
  dotGrey: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(26, 26, 26, 0.15)',
  },
  subDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stressChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yLabels: {
    height: 72,
    justifyContent: 'space-between',
    marginRight: 4,
    paddingVertical: 2,
  },
  yLabel: {
    fontSize: 8,
    fontFamily: fonts.light,
    color: TRACK.muted,
  },
  dayRowUnderChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingLeft: 22,
  },
  dayLabelCentered: {
    fontSize: 9,
    fontFamily: fonts.light,
    color: TRACK.muted,
    width: 28,
    textAlign: 'center',
  },
  hint: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textAlign: 'right',
    marginTop: 8,
  },
});
