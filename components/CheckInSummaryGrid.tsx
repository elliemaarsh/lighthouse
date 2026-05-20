import { StyleSheet, View } from 'react-native';

import { DataMetricCard } from '@/components/DataMetricCard';
import type { TodayLogSummary } from '@/types/checkIn';

function formatPeriod(status: string | null) {
  if (!status) return '—';
  return status.replace(/_/g, ' ');
}

function formatTemp(log: TodayLogSummary) {
  if (log.temperature != null) {
    return `${log.temperature}°${log.tempUnit}`;
  }
  if (log.temperatureNotMeasured) return "Didn't measure";
  return '—';
}

function formatMood(mood: number | null) {
  if (mood == null) return '—';
  const labels = ['', 'Low', 'Meh', 'Okay', 'Good', 'Great'];
  return `${labels[mood] ?? mood} · ${mood}/5`;
}

function formatSymptoms(symptoms: string[]) {
  if (!symptoms.length) return '—';
  if (symptoms.length === 1) return symptoms[0];
  return `${symptoms.length} logged`;
}

function formatNotes(notes: string) {
  if (!notes.trim()) return 'No notes';
  const trimmed = notes.trim();
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
}

type CheckInSummaryGridProps = {
  log: TodayLogSummary;
};

export function CheckInSummaryGrid({ log }: CheckInSummaryGridProps) {
  return (
    <View style={styles.grid}>
      <DataMetricCard
        size="hero"
        label="Mood"
        value={formatMood(log.mood)}
        subtitle={log.moodNote.trim() || undefined}
        art="orbits"
        style={styles.hero}
      />
      <View style={styles.row}>
        <DataMetricCard
          label="Period"
          value={formatPeriod(log.periodStatus)}
          art="arcs"
          style={styles.cellLeft}
        />
        <DataMetricCard
          label="Temperature"
          value={formatTemp(log)}
          art="pulse"
          style={styles.cellRight}
        />
      </View>
      <View style={styles.row}>
        <DataMetricCard
          label="Symptoms"
          value={formatSymptoms(log.symptoms)}
          subtitle={
            log.symptoms.length > 1 ? log.symptoms.slice(0, 2).join(', ') : undefined
          }
          art="wave"
          style={styles.cellLeft}
        />
        <DataMetricCard
          label="Notes"
          value={formatNotes(log.notes)}
          art="timeline"
          style={styles.cellRight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  hero: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cellLeft: {
    flex: 1,
  },
  cellRight: {
    flex: 1,
  },
});
