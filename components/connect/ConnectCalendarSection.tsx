import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { ConnectBlurCard } from '@/components/connect/ConnectBlurCard';
import { connectDashboard, fonts } from '@/constants/theme';
import type { Appointment } from '@/types/connect';

type ConnectCalendarSectionProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  appointments: Appointment[];
  onAddPress: () => void;
};

function formatTimeRange(start: string | null, end: string | null): string {
  if (!start) return '';
  if (!end) return start.slice(0, 5);
  return `${start.slice(0, 5)}–${end.slice(0, 5)}`;
}

export function ConnectCalendarSection({
  selectedDate,
  onSelectDate,
  appointments,
  onAddPress,
}: ConnectCalendarSectionProps) {
  const markedDates = useMemo(() => {
    const marks: Record<
      string,
      {
        marked?: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
        selectedTextColor?: string;
      }
    > = {};
    for (const apt of appointments) {
      marks[apt.date] = {
        marked: true,
        dotColor: connectDashboard.textPrimary,
      };
    }
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: connectDashboard.calendarSelectedBg,
      selectedTextColor: connectDashboard.calendarSelectedText,
    };
    return marks;
  }, [appointments, selectedDate]);

  const dayAppointments = appointments.filter((a) => a.date === selectedDate);

  const onDayPress = (day: DateData) => {
    onSelectDate(day.dateString);
  };

  return (
    <View style={styles.wrap}>
      <ConnectBlurCard borderRadius={20} blurAmount={16} padding={12}>
        <Calendar
          current={selectedDate}
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType="dot"
          enableSwipeMonths
          style={styles.calendar}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: connectDashboard.textMuted,
            selectedDayBackgroundColor: connectDashboard.calendarSelectedBg,
            selectedDayTextColor: connectDashboard.calendarSelectedText,
            todayTextColor: connectDashboard.textPrimary,
            dayTextColor: connectDashboard.textPrimary,
            textDisabledColor: connectDashboard.textMuted,
            dotColor: connectDashboard.textPrimary,
            arrowColor: connectDashboard.textPrimary,
            monthTextColor: connectDashboard.textPrimary,
            textDayFontFamily: fonts.regular,
            textMonthFontFamily: fonts.semiBold,
            textDayHeaderFontFamily: fonts.medium,
          }}
        />
      </ConnectBlurCard>

      {dayAppointments.length > 0 ? (
        <View style={styles.list}>
          {dayAppointments.map((apt) => (
            <ConnectBlurCard key={apt.id} style={styles.aptCard} padding={14}>
              <View style={styles.aptRow}>
                <Text style={styles.aptTitle}>{apt.title}</Text>
                <Text style={styles.aptTime}>
                  {formatTimeRange(apt.startTime, apt.endTime)}
                </Text>
              </View>
              {apt.notes ? (
                <Text style={styles.aptNotes} numberOfLines={2}>
                  {apt.notes}
                </Text>
              ) : null}
            </ConnectBlurCard>
          ))}
        </View>
      ) : null}

      <Pressable onPress={onAddPress} style={styles.addLink}>
        <Text style={styles.addText}>Add appointment +</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  calendar: {
    borderRadius: 20,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
  aptCard: {
    marginBottom: 0,
  },
  aptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  aptTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
  },
  aptTime: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: connectDashboard.textMuted,
  },
  aptNotes: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: connectDashboard.textSecondary,
  },
  addLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  addText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
  },
});
