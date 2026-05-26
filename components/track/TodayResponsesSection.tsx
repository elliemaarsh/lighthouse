import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DataMetricCard } from '@/components/DataMetricCard';
import { MoodFaceDisplay } from '@/components/MoodFace';
import {
  formatMoodLabel,
  formatNotesPreview,
  formatPeriodStatus,
  formatSymptomsSummary,
} from '@/lib/checkInDisplay';
import type { TodayLog } from '@/store/useTrackStore';
import { SURFACE } from '@/constants/surfaces';
import { fonts } from '@/constants/theme';

type TodayResponsesSectionProps = {
  log: TodayLog;
  onEdit: () => void;
};

function formatTemperature(log: TodayLog): string {
  if (log.temperatureNotMeasured) return "Didn't measure";
  if (log.temperature != null) {
    return `${log.temperature}°${log.tempUnit}`;
  }
  return '—';
}

export function TodayResponsesSection({ log, onEdit }: TodayResponsesSectionProps) {
  const moodLabel = formatMoodLabel(log.mood);
  const symptoms = formatSymptomsSummary(log.symptoms);
  const notesText = formatNotesPreview(log.notes);

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        <DataMetricCard
          size="hero"
          label="MOOD"
          value="—"
          art="orbits"
          style={styles.hero}
          hideValue={log.mood != null && log.mood >= 1 && log.mood <= 5}
          footer={
            log.mood != null && log.mood >= 1 && log.mood <= 5 ? (
              <View style={styles.moodFooter}>
                <MoodFaceDisplay level={log.mood as 1 | 2 | 3 | 4 | 5} />
                {moodLabel ? <Text style={styles.moodCaption}>{moodLabel}</Text> : null}
              </View>
            ) : (
              <Text style={styles.dash}>—</Text>
            )
          }
        />

        <View style={styles.row}>
          <DataMetricCard
            label="PERIOD"
            value={formatPeriodStatus(log.periodStatus)}
            art="arcs"
            style={styles.cell}
            footer={
              log.periodStatus ? (
                <View style={styles.periodLine} />
              ) : null
            }
          />
          <DataMetricCard
            label="TEMPERATURE"
            value={formatTemperature(log)}
            art="pulse"
            style={styles.cell}
          />
        </View>

        <View style={styles.row}>
          <DataMetricCard
            label="SYMPTOMS"
            value={symptoms.kind === 'count' ? symptoms.text : '—'}
            art="wave"
            style={styles.cell}
            hideValue={symptoms.kind !== 'count'}
            footer={
              symptoms.kind !== 'count' ? (
                <Text
                  style={[
                    symptoms.kind === 'single' ? styles.valueBody : styles.muted,
                  ]}
                >
                  {symptoms.text}
                </Text>
              ) : null
            }
          />
          <DataMetricCard
            label="NOTES"
            value=""
            art="timeline"
            style={styles.cell}
            hideValue
            footer={
              notesText === 'No notes' ? (
                <Text style={styles.muted}>{notesText}</Text>
              ) : (
                <Text style={styles.notesBody} numberOfLines={3}>
                  {notesText}
                </Text>
              )
            }
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.6}
        style={styles.editLink}
        accessibilityRole="button"
        accessibilityLabel="Edit log"
      >
        <Text style={styles.editLinkText}>Edit log</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 0,
  },
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
  cell: {
    flex: 1,
  },
  moodFooter: {
    marginTop: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  moodCaption: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
  },
  dash: {
    fontSize: 22,
    fontFamily: fonts.extraLight,
    color: '#1A2422',
    marginTop: 4,
  },
  valueLarge: {
    fontSize: 22,
    fontFamily: fonts.extraLight,
    color: '#1A2422',
    marginTop: 4,
  },
  valueBody: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: '#1A2422',
    marginTop: 4,
    lineHeight: 18,
  },
  notesBody: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: '#1A2422',
    lineHeight: 18,
    marginTop: 4,
  },
  muted: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
    marginTop: 4,
  },
  periodLine: {
    height: 2,
    width: 32,
    borderRadius: 1,
    backgroundColor: '#F14E2A',
    marginTop: 8,
  },
  editLink: {
    alignSelf: 'flex-start',
    paddingTop: 8,
    paddingBottom: 24,
  },
  editLinkText: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: SURFACE.labelMuted,
  },
});
