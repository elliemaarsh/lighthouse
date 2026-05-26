import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MoodFaceDisplay } from '@/components/MoodFace';
import {
  formatNotesPreview,
  formatPeriodStatus,
  formatSymptomsSummary,
} from '@/lib/checkInDisplay';
import { formatTodayHeader, MOOD_STAIRCASE_HEIGHTS } from '@/lib/trackWeekView';
import type { TodayLog } from '@/store/useTrackStore';
import { lightCardShadow } from '@/constants/glass';
import { fonts } from '@/constants/theme';

const TRACK = {
  muted: '#9BB0AC',
  primary: '#27359E',
  secondary: '#80B9FE',
  ink: '#1A2422',
  primaryGhost: 'rgba(39, 53, 158, 0.2)',
  glow: 'rgba(128, 185, 254, 0.08)',
} as const;

const MOOD_LABELS = ['Low', 'Meh', 'Okay', 'Good', 'Great'] as const;

type TrackTodayDetailSectionProps = {
  hasLoggedToday: boolean;
  todayLog: TodayLog | null;
  onLogToday: () => void;
  onEdit: () => void;
};

function formatTemperature(log: TodayLog): string {
  if (log.temperatureNotMeasured) return "Didn't measure";
  if (log.temperature != null) {
    return `${log.temperature}°${log.tempUnit}`;
  }
  return '—';
}

export function TrackTodayDetailSection({
  hasLoggedToday,
  todayLog,
  onLogToday,
  onEdit,
}: TrackTodayDetailSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.dateHeader}>{formatTodayHeader()}</Text>
        {hasLoggedToday ? (
          <TouchableOpacity onPress={onEdit} hitSlop={8}>
            <Text style={styles.editLink}>Edit log</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!hasLoggedToday || !todayLog ? (
        <Pressable
          style={styles.emptyCard}
          onPress={onLogToday}
          accessibilityRole="button"
          accessibilityLabel="Tap to log today"
        >
          <Text style={styles.plus}>+</Text>
          <Text style={styles.emptyHint}>Tap to log today</Text>
        </Pressable>
      ) : (
        <View style={styles.bento}>
          <MoodHeroCard log={todayLog} />

          <View style={styles.splitRow}>
            <MetricCard label="PERIOD" value={formatPeriodStatus(todayLog.periodStatus)} />
            <MetricCard label="TEMPERATURE" value={formatTemperature(todayLog)} />
          </View>

          <View style={styles.splitRow}>
            <SymptomsCard symptoms={todayLog.symptoms} />
            <NotesCard notes={todayLog.notes} />
          </View>
        </View>
      )}
    </View>
  );
}

function MoodHeroCard({ log }: { log: TodayLog }) {
  const mood = log.mood;
  const hasMood = mood != null && mood >= 1 && mood <= 5;
  const label = hasMood ? MOOD_LABELS[mood - 1] : '—';

  return (
    <View style={styles.moodCard}>
      <View style={styles.moodLeft}>
        <View style={styles.moodGlow} />
        {hasMood ? (
          <MoodFaceDisplay level={mood as 1 | 2 | 3 | 4 | 5} size={64} />
        ) : (
          <Text style={styles.dash}>—</Text>
        )}
      </View>
      <View style={styles.moodRight}>
        <Text style={styles.metricLabel}>MOOD</Text>
        <Text style={styles.moodValue}>{label}</Text>
        {hasMood ? (
          <View style={styles.moodBars}>
            {MOOD_STAIRCASE_HEIGHTS.map((height, i) => {
              const filled = i < mood;
              return (
                <View
                  key={i}
                  style={[
                    styles.moodBar,
                    { height },
                    filled ? styles.moodBarFilled : styles.moodBarEmpty,
                  ]}
                />
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function SymptomsCard({ symptoms }: { symptoms: string[] }) {
  const summary = formatSymptomsSummary(symptoms);
  const display =
    summary.kind === 'dash'
      ? '—'
      : summary.kind === 'none'
        ? 'None'
        : summary.text;

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>SYMPTOMS</Text>
      <Text style={styles.metricValueSmall} numberOfLines={3}>
        {display}
      </Text>
    </View>
  );
}

function NotesCard({ notes }: { notes: string | null }) {
  const preview = formatNotesPreview(notes);
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>NOTES</Text>
      <Text style={styles.notesBody} numberOfLines={4}>
        {preview}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...lightCardShadow,
  },
  plus: {
    fontFamily: fonts.extraLight,
    fontSize: 48,
    color: TRACK.primaryGhost,
    lineHeight: 52,
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: TRACK.muted,
    marginTop: 8,
  },
  bento: {
    gap: 12,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    ...lightCardShadow,
  },
  moodLeft: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TRACK.glow,
  },
  moodRight: {
    flex: 1,
    minWidth: 0,
  },
  moodValue: {
    fontSize: 22,
    fontFamily: fonts.extraLight,
    color: TRACK.ink,
    lineHeight: 28,
    marginBottom: 10,
  },
  moodBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  moodBar: {
    width: 6,
    borderRadius: 3,
  },
  moodBarFilled: {
    backgroundColor: TRACK.secondary,
  },
  moodBarEmpty: {
    backgroundColor: 'rgba(128, 185, 254, 0.15)',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    minWidth: 0,
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
    fontSize: 20,
    fontFamily: fonts.extraLight,
    color: TRACK.ink,
    lineHeight: 26,
  },
  metricValueSmall: {
    fontSize: 15,
    fontFamily: fonts.light,
    color: TRACK.ink,
    lineHeight: 21,
  },
  notesBody: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: TRACK.ink,
    lineHeight: 20,
  },
  dash: {
    fontSize: 28,
    fontFamily: fonts.extraLight,
    color: TRACK.ink,
  },
});
