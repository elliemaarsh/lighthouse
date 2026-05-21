import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DataMetricCard } from '@/components/DataMetricCard';
import { GlassSurface } from '@/components/GlassSurface';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, radius, spacing, textContrast, typography } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { cycleDayFromPartnerLog } from '@/lib/cycleDay';
import { partnerFeelingFromLog } from '@/lib/partnerFeeling';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { partnerPossessiveLabel, partnerPronouns } from '@/lib/partnerPronouns';
import { fetchPartnerDailyCheckIn } from '@/lib/partnerSharedLog';
import { fetchPartnerLogForToday } from '@/lib/partnerLogs';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';
import type { PartnerLogData } from '@/types/partnerLog';
import type { TodayLogSummary } from '@/types/checkIn';

export function NonCarryingHomeContent() {
  const scrollPadding = useTabBarScrollPadding();
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);

  const displayName = useUserStore((s) => s.displayName);
  const userId = useUserStore((s) => s.userId);
  const partnerUserId = useUserStore((s) => s.partnerUserId);
  const partnerName = useUserStore((s) => s.partnerName);
  const partnerEmail = useUserStore((s) => s.partnerEmail);
  const partnerBiologicalSex = useUserStore((s) => s.partnerBiologicalSex);

  const partnerLabel = partnerFirstName(partnerName, partnerEmail);
  const pronouns = partnerPronouns(
    partnerBiologicalSex === 'no partner' ? null : partnerBiologicalSex,
  );
  const cycleLabel = `${partnerPossessiveLabel(partnerName)} Cycle Day`;

  const [partnerDaily, setPartnerDaily] = useState<TodayLogSummary | null>(null);
  const [myPartnerLog, setMyPartnerLog] = useState<PartnerLogData | null>(null);

  const load = useCallback(async () => {
    const [daily, mine] = await Promise.all([
      fetchPartnerDailyCheckIn(partnerUserId),
      fetchPartnerLogForToday(userId),
    ]);
    setPartnerDaily(daily);
    setMyPartnerLog(mine.data);
  }, [partnerUserId, userId]);

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(false);
      void load();
    }, [load, setTabBarHidden]),
  );

  const nameLabel = displayName?.trim() ? displayName.trim() : 'Your';
  const cycle = cycleDayFromPartnerLog(partnerDaily, partnerLabel);
  const feeling = partnerFeelingFromLog(partnerDaily, pronouns);

  const loggedCategories =
    myPartnerLog &&
    (myPartnerLog.sleepHours != null ||
      myPartnerLog.heatLevel != null ||
      myPartnerLog.stressLevel != null ||
      myPartnerLog.exerciseActive != null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.dashboardTitle}>{nameLabel}'s Dashboard</Text>
          </View>
          <Pressable
            onPress={() => router.push(routes.settings)}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <GlassSurface variant="pill" borderRadius={radius.pill} shadow="soft">
              <View style={styles.avatar} />
            </GlassSurface>
          </Pressable>
        </View>

        <View style={styles.grid}>
          <DataMetricCard
            size="hero"
            label="Your health log"
            value={loggedCategories ? 'In progress' : 'Not started'}
            subtitle={loggedCategories ? 'Tap Track to update' : 'Sleep, stress & more'}
            art="orbits"
            style={styles.hero}
            footer={
              <Pressable
                onPress={() => router.push(routes.track)}
                style={styles.cardLinkWrap}
              >
                <Text style={styles.cardLink}>Log your day →</Text>
              </Pressable>
            }
          />
          <View style={styles.row}>
            <DataMetricCard
              label={cycleLabel}
              value={cycle.value}
              subtitle={cycle.subtitle}
              art="arcs"
              style={styles.cell}
            />
            <Pressable
              style={styles.cellPressable}
              onPress={
                feeling.isEmpty
                  ? () => router.push(routes.connect)
                  : undefined
              }
              disabled={!feeling.isEmpty}
            >
              <DataMetricCard
                label={pronouns.feelingPhrase}
                value={feeling.value}
                subtitle={feeling.subtitle}
                art="timeline"
                style={styles.cellFill}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  scroll: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greeting: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...textContrast,
  },
  dashboardTitle: {
    fontSize: 28,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: colors.textPrimary,
    marginTop: 6,
    ...textContrast,
  },
  avatar: {
    width: 44,
    height: 44,
  },
  grid: {
    gap: 14,
  },
  hero: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  cell: {
    flex: 1,
  },
  cellPressable: {
    flex: 1,
    minWidth: 0,
  },
  cellFill: {
    width: '100%',
  },
  cardLinkWrap: {
    marginTop: 12,
  },
  cardLink: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    ...textContrast,
  },
});
