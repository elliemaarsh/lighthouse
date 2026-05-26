import { StyleSheet, Text, View } from 'react-native';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { colors, fonts, homeMist } from '@/constants/theme';

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function WeekCalendarWidget() {
  const today = new Date();
  const weekStart = startOfWeekMonday(today);
  const todayKey = today.toDateString();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const isToday = d.toDateString() === todayKey;
    const hasLog = i % 2 === 0 && !isToday;
    return { date: d, letter: LETTERS[i], isToday, hasLog };
  });

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc rx={60} bottom={-24} right={-24} />
        <Text style={widgetCard.label}>THIS WEEK</Text>
        <View style={styles.row}>
          {days.map(({ date, letter, isToday, hasLog }) => {
            const dayNum = date.getDate();
            return (
              <View key={date.toISOString()} style={styles.col}>
                <Text style={styles.letter}>{letter}</Text>
                {isToday ? (
                  <View style={styles.todayCircle}>
                    <Text style={styles.todayText}>{dayNum}</Text>
                  </View>
                ) : hasLog ? (
                  <View style={styles.highlightCircle}>
                    <Text style={styles.highlightText}>{dayNum}</Text>
                  </View>
                ) : (
                  <Text style={styles.plainDate}>{dayNum}</Text>
                )}
                {hasLog ? <View style={styles.logDot} /> : <View style={styles.dotSpacer} />}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  col: {
    alignItems: 'center',
    minWidth: 32,
  },
  letter: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: homeMist.textMuted,
    marginBottom: 6,
  },
  todayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: homeMist.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  highlightCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: homeMist.highlightSoft,
    borderWidth: 0.5,
    borderColor: homeMist.highlightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: homeMist.highlight,
  },
  plainDate: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: homeMist.textMuted,
    height: 32,
    lineHeight: 32,
    textAlign: 'center',
  },
  logDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: homeMist.logDot,
    marginTop: 4,
  },
  dotSpacer: {
    width: 4,
    height: 4,
    marginTop: 4,
  },
});
