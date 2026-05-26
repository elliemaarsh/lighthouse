import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import {
  bbtSparklineCaption,
  buildBbtTrendSparklinePath,
  type WeekDayCell,
} from '@/lib/trackWeekView';
import { lightCardShadow } from '@/constants/glass';
import { fonts } from '@/constants/theme';

const TRACK = {
  muted: '#9BB0AC',
  primary: '#27359E',
  secondary: '#80B9FE',
  secondaryGhost: 'rgba(128, 185, 254, 0.15)',
  symptomEmpty: 'rgba(26, 36, 34, 0.12)',
} as const;

type TrackCarryingWeekTrendsSectionProps = {
  days: WeekDayCell[];
  hasLoggedToday: boolean;
  onBeginCheckIn?: () => void;
};

function moodBarHeight(mood: number | null): number {
  if (mood == null || mood < 1) return 0;
  return 8 + ((Math.min(5, mood) - 1) / 4) * 28;
}

export function TrackCarryingWeekTrendsSection({
  days,
  hasLoggedToday,
  onBeginCheckIn,
}: TrackCarryingWeekTrendsSectionProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const sparkPath =
    chartWidth > 0 ? buildBbtTrendSparklinePath(days, chartWidth) : '';
  const caption = bbtSparklineCaption(days);
  const showFooter = !hasLoggedToday && onBeginCheckIn;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>THIS WEEK&apos;S TRENDS</Text>

      <View style={styles.card}>
        <Text style={styles.rowLabel}>TEMPERATURE</Text>
        <View
          style={styles.sparklineWrap}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          {chartWidth > 0 && sparkPath ? (
            <Svg width={chartWidth} height={40} viewBox={`0 0 ${chartWidth} 40`}>
              <Path
                d={sparkPath}
                stroke={TRACK.secondary}
                strokeWidth={1.5}
                fill="none"
              />
              {days.map((day, i) => {
                if (day.temperature == null) return null;
                const pad = 2;
                const innerH = 32;
                const x =
                  pad + (i / Math.max(days.length - 1, 1)) * (chartWidth - pad * 2);
                const y = 4 + innerH - ((day.temperature - 97.0) / 1.5) * 24;
                return (
                  <Circle
                    key={`temp-dot-${day.dateKey}`}
                    cx={x}
                    cy={y}
                    r={day.isToday ? 4 : 3}
                    fill={day.isToday ? TRACK.primary : TRACK.secondary}
                  />
                );
              })}
            </Svg>
          ) : null}
        </View>
        {caption ? <Text style={styles.sparkCaption}>{caption}</Text> : null}

        <View style={styles.splitRow}>
          <View style={styles.column}>
            <Text style={styles.columnLabel}>MOOD</Text>
            <View style={styles.moodBars}>
              {days.map((day) => {
                const height = moodBarHeight(day.mood);
                const hasMood = day.hasLog && height > 0;
                return (
                  <View
                    key={`mood-${day.dateKey}`}
                    style={[
                      styles.moodBar,
                      {
                        height: hasMood ? height : 4,
                        backgroundColor: hasMood
                          ? day.isToday
                            ? TRACK.primary
                            : TRACK.secondary
                          : TRACK.secondaryGhost,
                        opacity: hasMood ? (day.isToday ? 1 : 0.75) : 1,
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
              {days.map((day) => {
                const symptoms =
                  day.hasLog && day.symptoms.length > 0 ? day.symptoms : [];
                const isToday = day.isToday;
                return (
                  <View key={`sym-${day.dateKey}`} style={styles.symptomColumn}>
                    {symptoms.length === 0 ? (
                      <View
                        style={[
                          styles.symptomSquare,
                          { backgroundColor: TRACK.symptomEmpty },
                        ]}
                      />
                    ) : (
                      symptoms.map((_, squareIndex) => (
                        <View
                          key={squareIndex}
                          style={[
                            styles.symptomSquare,
                            {
                              backgroundColor: isToday
                                ? TRACK.primary
                                : TRACK.secondary,
                            },
                          ]}
                        />
                      ))
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {showFooter ? (
          <>
            <View style={styles.divider} />
            <Pressable onPress={onBeginCheckIn} style={styles.footerPress}>
              <Text style={styles.footerText}>Log today to update your trends →</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...lightCardShadow,
  },
  rowLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sparklineWrap: {
    width: '100%',
    height: 40,
    marginBottom: 6,
  },
  sparkCaption: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginBottom: 16,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  columnLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  moodBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    height: 36,
  },
  moodBar: {
    flex: 1,
    maxWidth: 12,
    borderRadius: 3,
  },
  symptomColumns: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    minHeight: 24,
  },
  symptomColumn: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 16,
    marginBottom: 12,
  },
  footerPress: {
    alignSelf: 'stretch',
  },
  footerText: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textAlign: 'right',
  },
});
