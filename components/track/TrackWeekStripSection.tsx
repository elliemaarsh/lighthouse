import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  buildBbtSparklinePath,
  MOOD_MINI_HEIGHTS,
  type WeekDayCell,
} from '@/lib/trackWeekView';
import { lightCardShadow } from '@/constants/glass';
import { fonts } from '@/constants/theme';

const TRACK = {
  muted: '#9BB0AC',
  primary: '#27359E',
  secondary: '#80B9FE',
  spark: '#EDE290',
  primarySoft: 'rgba(39, 53, 158, 0.08)',
} as const;

type TrackWeekStripSectionProps = {
  days: WeekDayCell[];
  hasLoggedToday: boolean;
  onBeginCheckIn: () => void;
};

export function TrackWeekStripSection({
  days,
  hasLoggedToday,
  onBeginCheckIn,
}: TrackWeekStripSectionProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const sparkPath = chartWidth > 0 ? buildBbtSparklinePath(days, chartWidth) : '';

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>THIS WEEK</Text>
        {!hasLoggedToday ? (
          <Pressable onPress={onBeginCheckIn} hitSlop={8}>
            <Text style={styles.beginLink}>Begin check-in →</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.weekRow}>
          {days.map((day) => (
            <View key={day.dateKey} style={styles.col}>
              <Text style={styles.letter}>{day.letter}</Text>
              {renderDateCircle(day)}
              {day.hasLog ? <View style={styles.logDot} /> : <View style={styles.dotSpacer} />}
              {day.hasLog && day.mood != null && day.mood >= 1 && day.mood <= 5 ? (
                <View
                  style={[
                    styles.moodMini,
                    { height: MOOD_MINI_HEIGHTS[day.mood - 1] },
                  ]}
                />
              ) : (
                <View style={styles.moodSpacer} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.separator} />

        <Text style={styles.bbtLabel}>BBT</Text>
        <View
          style={styles.sparkWrap}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          {chartWidth > 0 && sparkPath ? (
            <Svg width={chartWidth} height={20} viewBox={`0 0 ${chartWidth} 20`}>
              <Path
                d={sparkPath}
                stroke={TRACK.spark}
                strokeWidth={1.5}
                fill="none"
              />
            </Svg>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function renderDateCircle(day: WeekDayCell) {
  const { isToday, hasLog, dayNum } = day;

  if (isToday && hasLog) {
    return (
      <View style={styles.todayLogged}>
        <Text style={styles.todayLoggedText}>{dayNum}</Text>
      </View>
    );
  }

  if (isToday && !hasLog) {
    return (
      <View style={styles.todayOpen}>
        <Text style={styles.todayOpenText}>{dayNum}</Text>
      </View>
    );
  }

  if (hasLog) {
    return (
      <View style={styles.loggedDay}>
        <Text style={styles.loggedDayText}>{dayNum}</Text>
      </View>
    );
  }

  return <Text style={styles.plainDay}>{dayNum}</Text>;
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: TRACK.muted,
    textTransform: 'uppercase',
  },
  beginLink: {
    fontSize: 12,
    fontFamily: fonts.light,
    color: TRACK.primary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    ...lightCardShadow,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  letter: {
    fontSize: 9,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginBottom: 6,
  },
  todayLogged: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TRACK.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TRACK.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  todayLoggedText: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: '#FFFFFF',
  },
  todayOpen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: TRACK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayOpenText: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: TRACK.primary,
  },
  loggedDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TRACK.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loggedDayText: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: TRACK.primary,
  },
  plainDay: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: TRACK.muted,
    height: 32,
    lineHeight: 32,
    textAlign: 'center',
  },
  logDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TRACK.secondary,
    marginTop: 4,
  },
  dotSpacer: {
    width: 4,
    height: 4,
    marginTop: 4,
  },
  moodMini: {
    width: 4,
    borderRadius: 2,
    backgroundColor: TRACK.secondary,
    opacity: 0.6,
    marginTop: 3,
  },
  moodSpacer: {
    width: 4,
    height: 4,
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(26, 36, 34, 0.08)',
    marginTop: 16,
    marginBottom: 12,
  },
  bbtLabel: {
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: fonts.light,
    color: 'rgba(128, 185, 254, 0.5)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sparkWrap: {
    width: '100%',
    height: 20,
  },
});
