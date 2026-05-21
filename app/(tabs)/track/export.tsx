import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { colors, fonts, spacing } from '@/constants/theme';
import {
  buildMedicalReportHtml,
  type ReportSections,
} from '@/lib/medicalReport';
import {
  fetchDailyLogsInRange,
  fetchPartnerLogsInRange,
} from '@/lib/logsInRange';
import { noFocusRing } from '@/lib/focusRing';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

type SectionKey = keyof ReportSections;

const SECTION_OPTIONS: { key: SectionKey; label: string }[] = [
  { key: 'cycleSummary', label: 'Cycle summary (period dates, length, regularity)' },
  { key: 'bbtChart', label: 'BBT chart (temperature over time)' },
  { key: 'moodPatterns', label: 'Mood patterns' },
  { key: 'symptomFrequency', label: 'Symptom frequency' },
  { key: 'medicationLog', label: 'Medication/supplement log' },
  { key: 'observations', label: 'Key observations' },
];

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function defaultFromDate(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d;
}

export default function TrackExportScreen() {
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const userId = useUserStore((s) => s.userId);
  const name = useUserStore((s) => s.name);
  const role = useUserStore((s) => s.role);

  const [dateFrom, setDateFrom] = useState(defaultFromDate);
  const [dateTo, setDateTo] = useState(() => new Date());
  const [picker, setPicker] = useState<'from' | 'to' | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sections, setSections] = useState<ReportSections>({
    cycleSummary: true,
    bbtChart: true,
    moodPatterns: true,
    symptomFrequency: true,
    medicationLog: true,
    observations: true,
  });

  const isPartnerTrack = role === 'non-carrying';

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
      return () => setTabBarHidden(false);
    }, [setTabBarHidden]),
  );

  const toggleSection = (key: SectionKey) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatPickerDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const generatePdf = useCallback(async () => {
    setGenerating(true);
    try {
      const from = isoDate(dateFrom);
      const to = isoDate(dateTo);
      const [dailyLogs, partnerLogs] = await Promise.all([
        isPartnerTrack ? Promise.resolve([]) : fetchDailyLogsInRange(userId, from, to),
        isPartnerTrack ? fetchPartnerLogsInRange(userId, from, to) : Promise.resolve([]),
      ]);

      const html = buildMedicalReportHtml({
        userName: name || 'Lighthouse user',
        dateFrom: from,
        dateTo: to,
        generatedAt: new Date().toISOString(),
        isPartnerTrack,
        sections,
        dailyLogs,
        partnerLogs,
      });

      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share your health report',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (err) {
      console.warn('[Lighthouse] PDF export failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [dateFrom, dateTo, isPartnerTrack, name, sections, userId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, noFocusRing]}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Medical Report</Text>
          <Text style={styles.subtitle}>Your data, formatted for clinical use</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionKicker}>DATE RANGE</Text>
        <View style={styles.dateRow}>
          <Pressable
            style={styles.datePill}
            onPress={() => setPicker('from')}
          >
            <Text style={styles.dateLabel}>From</Text>
            <Text style={styles.dateValue}>{formatPickerDate(dateFrom)}</Text>
          </Pressable>
          <Pressable style={styles.datePill} onPress={() => setPicker('to')}>
            <Text style={styles.dateLabel}>To</Text>
            <Text style={styles.dateValue}>{formatPickerDate(dateTo)}</Text>
          </Pressable>
        </View>

        {picker ? (
          <DateTimePicker
            value={picker === 'from' ? dateFrom : dateTo}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={picker === 'from' ? dateTo : new Date()}
            minimumDate={picker === 'to' ? dateFrom : undefined}
            onChange={(_, selected) => {
              if (!selected) {
                setPicker(null);
                return;
              }
              if (picker === 'from') setDateFrom(selected);
              else setDateTo(selected);
              if (Platform.OS !== 'ios') setPicker(null);
            }}
          />
        ) : null}
        {Platform.OS === 'ios' && picker ? (
          <Pressable style={styles.donePicker} onPress={() => setPicker(null)}>
            <Text style={styles.donePickerText}>Done</Text>
          </Pressable>
        ) : null}

        <Text style={[styles.sectionKicker, styles.sectionKickerSpaced]}>
          REPORT CONTENTS
        </Text>
        <View style={styles.previewCard}>
          {isPartnerTrack ? (
            <Text style={styles.partnerNote}>
              Partner track export includes sleep, exercise, stress, substances, and
              notes from your daily log.
            </Text>
          ) : (
            SECTION_OPTIONS.map(({ key, label }) => (
              <Pressable
                key={key}
                style={styles.checkRow}
                onPress={() => toggleSection(key)}
              >
                <View
                  style={[styles.checkbox, sections[key] && styles.checkboxChecked]}
                >
                  {sections[key] ? (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  ) : null}
                </View>
                <Text style={styles.checkLabel}>{label}</Text>
              </Pressable>
            ))
          )}
        </View>

        {generating ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.textMuted} />
            <Text style={styles.loadingText}>Preparing your report...</Text>
          </View>
        ) : (
          <PillButton
            label="Generate PDF"
            onPress={() => void generatePdf()}
            variant="primary"
            style={styles.generateBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  sectionKicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionKickerSpaced: {
    marginTop: 28,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  datePill: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  donePicker: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  donePickerText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.textPrimary,
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  partnerNote: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  loading: {
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  generateBtn: {
    marginTop: 28,
    alignSelf: 'stretch',
  },
});
