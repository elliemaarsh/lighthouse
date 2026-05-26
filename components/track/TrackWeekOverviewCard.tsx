import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { SURFACE } from '@/constants/surfaces';
import { fonts } from '@/constants/theme';
import { lightCardShadow } from '@/constants/glass';

const MOOD_BAR_HEIGHTS = [28, 20, 36, 16, 32, 24, 30] as const;
const MOOD_BAR_MAX = Math.max(...MOOD_BAR_HEIGHTS);

/** Symptom squares per day (Mon–Sun) */
const SYMPTOM_DAYS: number[] = [2, 1, 3, 0, 2, 1, 2];

const SPARKLINE_REF_WIDTH = 240;
const SPARKLINE_END_Y = 14;

type TrackWeekOverviewCardProps = {
  onLogToday?: () => void;
};

function moodBarOpacity(height: number, isToday: boolean) {
  if (isToday) return 1;
  const t = height / MOOD_BAR_MAX;
  return 0.5 + t * 0.5;
}

/** Scale placeholder path so the end lands at `endX` (chartWidth - 8). */
function buildSparklinePath(endX: number): string {
  const s = endX / SPARKLINE_REF_WIDTH;
  const x = (n: number) => Math.round(n * s * 10) / 10;
  return (
    `M ${x(0)},28 C ${x(20)},24 ${x(40)},32 ${x(60)},20` +
    ` C ${x(80)},14 ${x(100)},22 ${x(120)},18` +
    ` C ${x(140)},12 ${x(160)},20 ${x(180)},16` +
    ` C ${x(200)},10 ${x(220)},18 ${x(240)},${SPARKLINE_END_Y}`
  );
}

export function TrackWeekOverviewCard({ onLogToday }: TrackWeekOverviewCardProps) {
  const [chartWidth, setChartWidth] = useState(280);
  const pathEndX = Math.max(chartWidth - 8, 0);
  const sparklinePath = buildSparklinePath(pathEndX);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>THIS WEEK</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>TEMPERATURE</Text>
        <View
          style={styles.sparklineWrap}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          {chartWidth > 0 ? (
            <Svg
              width={chartWidth}
              height={40}
              viewBox={`0 0 ${chartWidth} 40`}
            >
              <Path
                d={sparklinePath}
                stroke={SURFACE.chartBlue}
                strokeWidth={2}
                fill="none"
              />
              <Circle
                cx={pathEndX}
                cy={SPARKLINE_END_Y}
                r={4}
                fill={SURFACE.chartBlueDark}
              />
            </Svg>
          ) : null}
        </View>
        <Text style={styles.sparkCaption}>97.2 → 97.8°F this week</Text>
      </View>

      <View style={styles.splitRow}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>MOOD</Text>
          <View style={styles.moodBars}>
            {MOOD_BAR_HEIGHTS.map((height, index) => {
              const isToday = index === MOOD_BAR_HEIGHTS.length - 1;
              return (
                <View
                  key={index}
                  style={[
                    styles.moodBar,
                    {
                      height,
                      backgroundColor: isToday
                        ? SURFACE.chartBlueDark
                        : SURFACE.chartBlue,
                      opacity: moodBarOpacity(height, isToday),
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.columnLabel}>SYMPTOMS</Text>
          <View style={styles.symptomColumns}>
            {SYMPTOM_DAYS.map((count, dayIndex) => {
              const isToday = dayIndex === SYMPTOM_DAYS.length - 1;
              return (
                <View key={dayIndex} style={styles.symptomColumn}>
                  {Array.from({ length: count }).map((_, squareIndex) => (
                    <View
                      key={squareIndex}
                      style={[
                        styles.symptomSquare,
                        {
                          backgroundColor: isToday
                            ? SURFACE.chartBlueDark
                            : SURFACE.chartBlue,
                        },
                      ]}
                    />
                  ))}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <Pressable
        onPress={onLogToday}
        disabled={!onLogToday}
        style={styles.footerPress}
        accessibilityRole="button"
        accessibilityLabel="Log today to update your trends"
      >
        <Text style={styles.footerText}>Log today to update your trends →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    ...lightCardShadow,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  row: {
    marginBottom: 20,
  },
  rowLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sparklineWrap: {
    width: '100%',
    height: 40,
    marginBottom: 6,
    overflow: 'visible',
    paddingRight: 8,
  },
  sparkCaption: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  columnLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  moodBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 36,
  },
  moodBar: {
    width: 6,
    borderRadius: 3,
  },
  symptomColumns: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 5,
    minHeight: 24,
  },
  symptomColumn: {
    gap: 2,
    justifyContent: 'flex-end',
  },
  symptomSquare: {
    width: 6,
    height: 6,
    borderRadius: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 36, 34, 0.08)',
    marginBottom: 14,
  },
  footerPress: {
    alignSelf: 'stretch',
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
    textAlign: 'right',
  },
});
