/*
-- partner_logs table
-- create table partner_logs (
--   id uuid default gen_random_uuid() primary key,
--   user_id uuid references auth.users(id),
--   date date not null,
--   sleep_hours numeric,
--   sleep_minutes integer,
--   exercise_active boolean,
--   exercise_minutes integer,
--   exercise_types text[],
--   heat_level text,
--   substances text[],
--   alcohol_drinks integer,
--   stress_level integer,
--   notes text,
--   created_at timestamp default now(),
--   unique (user_id, date)
-- );
*/

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MedicalExportCard } from '@/components/track/MedicalExportCard';
import { PartnerCategoryCard } from '@/components/partner/PartnerCategoryCard';
import { PartnerDailyStreakCard } from '@/components/partner/PartnerDailyStreakCard';
import { PartnerTipCard } from '@/components/partner/PartnerTipCard';
import { PartnerTrainingCard } from '@/components/partner/PartnerTrainingCard';
import { PartnerLogSheet } from '@/components/partner/sheets/PartnerLogSheet';
import { PartnerTodaySummarySection } from '@/components/track/partner/PartnerTodaySummarySection';
import { PartnerWeekTrendsSection } from '@/components/track/partner/PartnerWeekTrendsSection';
import { DEFAULT_PARTNER_DAILY_STREAK } from '@/constants/partner';
import { seedPartnerLogsIfEmpty } from '@/data/seedPartnerLogs';
import {
  countLoggedFromTodayLog,
  hasAnyPartnerLogToday,
  todayLogToPartnerData,
} from '@/lib/partnerLogMappers';
import {
  formatHeatValue,
  formatNotesValue,
  formatSleepValue,
  formatStressValue,
  formatSubstancesValue,
  isCategoryLogged,
} from '@/lib/partnerDisplay';
import { ensureLocalUserId } from '@/lib/localUserId';
import { loadPartnerWeeklyLogs } from '@/lib/partnerWeek';
import { partnerLogSession } from '@/lib/partnerLogSession';
import { savePartnerLog } from '@/lib/partnerLogs';
import { fetchPartnerStreak } from '@/lib/partnerStreak';
import { colors, fonts, spacing, textContrast, typography } from '@/constants/theme';
import type { PartnerCategoryId, PartnerLogData } from '@/types/partnerLog';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { usePartnerLogStore } from '@/store/usePartnerLogStore';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

const TOTAL_CATEGORIES = 6;
const PROGRESS_FILL = '#EDE290';

/** One grid row (card height + gap) so last row clears the tab bar */
const PARTNER_GRID_ROW_EXTRA = 152;

export default function PartnerTrackScreen() {
  const storeReady = useStoreHydrated();
  const role = useUserStore((s) => s.role);
  const userId = useUserStore((s) => s.userId);
  const todayLog = usePartnerLogStore((s) => s.todayLog);
  const weeklyLogs = usePartnerLogStore((s) => s.weeklyLogs);
  const scrollBottomPad = useTabBarScrollPadding({ extra: PARTNER_GRID_ROW_EXTRA });
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const [log, setLog] = useState<PartnerLogData>(() => partnerLogSession.getToday());
  const [streak, setStreak] = useState(DEFAULT_PARTNER_DAILY_STREAK);
  const [activeCategory, setActiveCategory] = useState<PartnerCategoryId | null>(null);
  const sheetRef = useRef<BottomSheetModal>(null);

  const displayLog = todayLog ? todayLogToPartnerData(todayLog) : log;
  const loggedCount = countLoggedFromTodayLog(todayLog);
  const progress = loggedCount / TOTAL_CATEGORIES;
  const showSummary = hasAnyPartnerLogToday(todayLog);
  const showCategoryGrid = loggedCount < TOTAL_CATEGORIES;

  const loadPartnerData = useCallback(async () => {
    if (!storeReady) return;
    const uid = userId || ensureLocalUserId();
    if (!uid) return;

    usePartnerLogStore.getState().resetIfNewDay();

    await seedPartnerLogsIfEmpty(uid);

    const [today, streakDays, week] = await Promise.all([
      partnerLogSession.hydrate(uid),
      fetchPartnerStreak(uid),
      loadPartnerWeeklyLogs(uid),
    ]);

    setLog(today);
    usePartnerLogStore.getState().syncFromPartnerData(today, { keepLoggedAt: true });
    usePartnerLogStore.getState().setWeeklyLogs(week);
    setStreak(streakDays);

  }, [storeReady, userId]);

  useFocusEffect(
    useCallback(() => {
      if (!storeReady) return;
      if (role != null && role !== 'non-carrying') {
        router.replace('/(tabs)/track');
        return;
      }
      void loadPartnerData();
      setTabBarHidden(false);
      return () => setTabBarHidden(false);
    }, [loadPartnerData, role, setTabBarHidden, storeReady]),
  );

  const heat = formatHeatValue(displayLog);
  const substances = formatSubstancesValue(displayLog);
  const trainingOn = displayLog.exerciseActive === true;

  const openCategory = (id: PartnerCategoryId) => {
    setActiveCategory(id);
    setTabBarHidden(true);
    sheetRef.current?.present();
  };

  const closeSheet = () => {
    setActiveCategory(null);
    setTabBarHidden(false);
  };

  const refreshWeekly = async (uid: string) => {
    const week = await loadPartnerWeeklyLogs(uid);
    usePartnerLogStore.getState().setWeeklyLogs(week);
  };

  const handleSaveCategory = async (patch: Partial<PartnerLogData>) => {
    if (!storeReady) return;
    const uid = userId || ensureLocalUserId();
    if (!uid) return;

    const next = { ...partnerLogSession.getToday(), ...patch };
    partnerLogSession.setToday(next);
    setLog(next);
    await savePartnerLog(uid, next);

    usePartnerLogStore.getState().syncFromPartnerData(next);

    await refreshWeekly(uid);
    const streakDays = await fetchPartnerStreak(uid);
    setStreak(streakDays);
  };

  const handleTrainingToggle = (on: boolean) => {
    const current = partnerLogSession.getToday();
    void handleSaveCategory({
      exerciseActive: on,
      exerciseMinutes: on ? (current.exerciseMinutes ?? 30) : null,
      exerciseTypes: on ? current.exerciseTypes : [],
    });
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: scrollBottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          bounces
        >
          <View style={styles.header}>
            <Text style={styles.todayLabel}>TODAY</Text>
            <Text style={styles.headline}>Your health log</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {loggedCount} of {TOTAL_CATEGORIES} logged today
          </Text>

          <View style={styles.heroRow}>
            <PartnerDailyStreakCard streak={streak} />
            <PartnerTrainingCard
              trainingOn={trainingOn}
              onToggle={handleTrainingToggle}
              onOpenDetails={() => openCategory('exercise')}
            />
          </View>

          <View style={styles.tipWrap}>
            <PartnerTipCard />
          </View>

          {showSummary && todayLog ? (
            <PartnerTodaySummarySection
              todayLog={todayLog}
              onOpenCategory={openCategory}
              onEdit={() => openCategory('sleep')}
            />
          ) : null}

          <PartnerWeekTrendsSection weeklyLogs={weeklyLogs} todayLog={todayLog} />

          {showCategoryGrid ? (
            <View style={styles.grid}>
              <PartnerCategoryCard
                category="sleep"
                value={formatSleepValue(displayLog)}
                valueSize={28}
                valueFont="light"
                logged={isCategoryLogged('sleep', displayLog)}
                onPress={() => openCategory('sleep')}
              />
              <PartnerCategoryCard
                category="heat"
                value={heat.text}
                valueColor={heat.color}
                logged={isCategoryLogged('heat', displayLog)}
                onPress={() => openCategory('heat')}
              />
              <PartnerCategoryCard
                category="substances"
                value={substances.text}
                valueColor={substances.color}
                valueSize={15}
                logged={isCategoryLogged('substances', displayLog)}
                onPress={() => openCategory('substances')}
              />
              <PartnerCategoryCard
                category="stress"
                value={formatStressValue(displayLog)}
                logged={isCategoryLogged('stress', displayLog)}
                onPress={() => openCategory('stress')}
              />
              <PartnerCategoryCard
                category="notes"
                value={formatNotesValue(displayLog)}
                valueSize={13}
                valueFont="regular"
                logged={isCategoryLogged('notes', displayLog)}
                onPress={() => openCategory('notes')}
              />
            </View>
          ) : null}

          <View style={styles.exportWrap}>
            <MedicalExportCard />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheetModalProvider>
        <PartnerLogSheet
          ref={sheetRef}
          category={activeCategory}
          log={displayLog}
          onSaveCategory={handleSaveCategory}
          onDismiss={closeSheet}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  todayLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    ...textContrast,
  },
  headline: {
    fontSize: 28,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: colors.textPrimary,
    marginTop: 6,
    ...textContrast,
  },
  progressTrack: {
    height: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(26, 36, 34, 0.08)',
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 100,
    backgroundColor: PROGRESS_FILL,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    ...textContrast,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  tipWrap: {
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    marginTop: 4,
  },
  exportWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
