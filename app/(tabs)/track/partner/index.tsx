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
import {
  countLoggedCategories,
  formatHeatValue,
  formatNotesValue,
  formatSleepValue,
  formatStressValue,
  formatSubstancesValue,
  isCategoryLogged,
} from '@/lib/partnerDisplay';
import { ensureLocalUserId } from '@/lib/localUserId';
import { partnerLogSession } from '@/lib/partnerLogSession';
import { savePartnerLog } from '@/lib/partnerLogs';
import { fetchPartnerStreak } from '@/lib/partnerStreak';
import {
  colors,
  fonts,
  spacing,
  textContrast,
  typography,
} from '@/constants/theme';
import type { PartnerCategoryId, PartnerLogData } from '@/types/partnerLog';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

const TOTAL_CATEGORIES = 6;

/** One grid row (card height + gap) so last row clears the tab bar */
const PARTNER_GRID_ROW_EXTRA = 152;

export default function PartnerTrackScreen() {
  const storeReady = useStoreHydrated();
  const userId = useUserStore((s) => s.userId);
  const scrollBottomPad = useTabBarScrollPadding({ extra: PARTNER_GRID_ROW_EXTRA });
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const [log, setLog] = useState<PartnerLogData>(() => partnerLogSession.getToday());
  const [streak, setStreak] = useState(0);
  const [activeCategory, setActiveCategory] = useState<PartnerCategoryId | null>(null);
  const sheetRef = useRef<BottomSheetModal>(null);

  const loadToday = useCallback(async () => {
    if (!storeReady) return;
    const uid = userId || ensureLocalUserId();
    if (!uid) return;

    const [todayLog, streakDays] = await Promise.all([
      partnerLogSession.hydrate(uid),
      fetchPartnerStreak(uid),
    ]);
    setLog(todayLog);
    setStreak(streakDays);
  }, [storeReady, userId]);

  useFocusEffect(
    useCallback(() => {
      if (!storeReady) return;
      void loadToday();
      setTabBarHidden(false);
      return () => setTabBarHidden(false);
    }, [loadToday, setTabBarHidden, storeReady]),
  );

  const loggedCount = countLoggedCategories(log);
  const progress = loggedCount / TOTAL_CATEGORIES;
  const heat = formatHeatValue(log);
  const substances = formatSubstancesValue(log);
  const trainingOn = log.exerciseActive === true;

  const openCategory = (id: PartnerCategoryId) => {
    setActiveCategory(id);
    setTabBarHidden(true);
    sheetRef.current?.present();
  };

  const closeSheet = () => {
    setActiveCategory(null);
    setTabBarHidden(false);
  };

  const handleSaveCategory = async (patch: Partial<PartnerLogData>) => {
    if (!storeReady) return;
    const uid = userId || ensureLocalUserId();
    if (!uid) return;

    const next = { ...partnerLogSession.getToday(), ...patch };
    partnerLogSession.setToday(next);
    setLog(next);
    await savePartnerLog(uid, next);
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

            <View style={styles.grid}>
              <PartnerCategoryCard
                category="sleep"
                value={formatSleepValue(log)}
                valueSize={28}
                valueFont="light"
                logged={isCategoryLogged('sleep', log)}
                onPress={() => openCategory('sleep')}
              />
              <PartnerCategoryCard
                category="heat"
                value={heat.text}
                valueColor={heat.color}
                logged={isCategoryLogged('heat', log)}
                onPress={() => openCategory('heat')}
              />
              <PartnerCategoryCard
                category="substances"
                value={substances.text}
                valueColor={substances.color}
                valueSize={15}
                logged={isCategoryLogged('substances', log)}
                onPress={() => openCategory('substances')}
              />
              <PartnerCategoryCard
                category="stress"
                value={formatStressValue(log)}
                logged={isCategoryLogged('stress', log)}
                onPress={() => openCategory('stress')}
              />
              <PartnerCategoryCard
                category="notes"
                value={formatNotesValue(log)}
                valueSize={13}
                valueFont="regular"
                logged={isCategoryLogged('notes', log)}
                onPress={() => openCategory('notes')}
              />
            </View>

            <View style={styles.exportWrap}>
              <MedicalExportCard />
            </View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheetModalProvider>
        <PartnerLogSheet
          ref={sheetRef}
          category={activeCategory}
          log={log}
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
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 100,
    backgroundColor: colors.accentLime,
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
  },
  exportWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
