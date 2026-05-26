import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabScrollView } from '@/components/TabScrollView';
import { HomeDashboardHeader } from '@/components/home/HomeDashboardHeader';
import { HomeGlassCard, homeCardStyles } from '@/components/home/HomeGlassCard';
import { HomeScreenBackground } from '@/components/home/HomeScreenBackground';
import { routes } from '@/constants/routes';
import { fonts, fontSizes, homeDashboard, radius } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { cycleDayFromPartnerLog } from '@/lib/cycleDay';
import { partnerFeelingFromLog } from '@/lib/partnerFeeling';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { partnerPossessiveLabel, partnerPronouns } from '@/lib/partnerPronouns';
import { fetchPartnerDailyCheckIn } from '@/lib/partnerSharedLog';
import { partnerLogSession } from '@/lib/partnerLogSession';
import { useUserStore } from '@/store/useUserStore';
import type { PartnerLogData } from '@/types/partnerLog';
import type { TodayLogSummary } from '@/types/checkIn';

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function NonCarryingHomeDashboard() {
  const scrollPadding = useTabBarScrollPadding({ extra: 16 });

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
  const cycleCardLabel = partnerPossessiveLabel(partnerName);

  const [partnerDaily, setPartnerDaily] = useState<TodayLogSummary | null>(null);
  const [myPartnerLog, setMyPartnerLog] = useState<PartnerLogData | null>(null);

  const firstName = displayName?.trim().split(/\s+/)[0] ?? 'there';

  const { greeting, dateLabel } = useMemo(() => {
    const now = new Date();
    return {
      greeting: `${greetingForHour(now.getHours())}, ${firstName}`,
      dateLabel: formatDateLabel(now),
    };
  }, [firstName]);

  const load = useCallback(async () => {
    const [daily, mine] = await Promise.all([
      fetchPartnerDailyCheckIn(partnerUserId),
      partnerLogSession.hydrate(userId),
    ]);
    setPartnerDaily(daily);
    setMyPartnerLog(mine);
  }, [partnerUserId, userId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const cycle = cycleDayFromPartnerLog(partnerDaily, partnerLabel);
  const feeling = partnerFeelingFromLog(partnerDaily, pronouns);

  const loggedCategories =
    myPartnerLog != null &&
    (myPartnerLog.sleepHours != null ||
      myPartnerLog.heatLevel != null ||
      myPartnerLog.stressLevel != null ||
      myPartnerLog.exerciseActive != null ||
      myPartnerLog.substances.length > 0 ||
      myPartnerLog.notes.trim().length > 0);

  return (
    <HomeScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TabScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <HomeDashboardHeader greeting={greeting} dateLabel={dateLabel} />

          <View style={styles.stack}>
            <HomeGlassCard>
              <View style={homeCardStyles.shell}>
                <Text style={styles.cardLabel}>Today's insight</Text>
                <Text style={styles.insightBody}>
                  {partnerDaily
                    ? `You're synced with ${partnerLabel}'s check-in today. A small note of support can go a long way.`
                    : `When ${partnerLabel} logs today, you'll see how they're doing here.`}
                </Text>
              </View>
            </HomeGlassCard>

            <View style={styles.splitRow}>
              <HomeGlassCard style={styles.splitCard}>
                <View style={homeCardStyles.shellCompact}>
                  <Text style={styles.cardLabel}>{cycleCardLabel} cycle</Text>
                  <Text style={styles.statMedium}>{cycle.value}</Text>
                  <Text style={styles.statUnit}>{cycle.subtitle}</Text>
                </View>
              </HomeGlassCard>
              <Pressable
                style={styles.splitCard}
                onPress={feeling.isEmpty ? () => router.push(routes.connect) : undefined}
                disabled={!feeling.isEmpty}
              >
                <HomeGlassCard style={styles.splitFill}>
                  <View style={homeCardStyles.shellCompact}>
                    <Text style={styles.cardLabel}>{pronouns.feelingPhrase}</Text>
                    <Text style={styles.statMedium} numberOfLines={2}>
                      {feeling.value}
                    </Text>
                    <Text style={styles.statUnit} numberOfLines={2}>
                      {feeling.subtitle}
                    </Text>
                  </View>
                </HomeGlassCard>
              </Pressable>
            </View>

            <HomeGlassCard>
              <View style={homeCardStyles.shell}>
                <Text style={styles.cardLabel}>Your health log</Text>
                <Text style={styles.statMedium}>
                  {loggedCategories ? 'In progress' : 'Not started'}
                </Text>
                <Text style={styles.statUnit}>
                  {loggedCategories ? 'Tap Track to update' : 'Sleep, stress & more'}
                </Text>
              </View>
            </HomeGlassCard>

            <Pressable onPress={() => router.push(routes.track)}>
              <HomeGlassCard>
                <View style={[homeCardStyles.shell, styles.checkInRow]}>
                  <View style={styles.checkInCopy}>
                    <Text style={styles.checkInTitle}>Log your day</Text>
                    <Text style={styles.checkInSub}>
                      Track sleep, stress, and how you're showing up
                    </Text>
                  </View>
                  <View style={styles.checkInBtn}>
                    <Text style={styles.checkInBtnText}>→</Text>
                  </View>
                </View>
              </HomeGlassCard>
            </Pressable>
          </View>
        </TabScrollView>
      </SafeAreaView>
    </HomeScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 22,
  },
  stack: {
    gap: 14,
  },
  cardLabel: {
    fontSize: fontSizes.micro,
    fontFamily: fonts.regular,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: homeDashboard.textMuted,
    marginBottom: 6,
  },
  insightBody: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: homeDashboard.textSecondary,
    lineHeight: 20,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 14,
  },
  splitCard: {
    flex: 1,
  },
  splitFill: {
    flex: 1,
    width: '100%',
  },
  statMedium: {
    fontSize: 28,
    fontFamily: fonts.extraLight,
    color: homeDashboard.textPrimary,
    lineHeight: 34,
  },
  statUnit: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: homeDashboard.textSecondary,
    marginTop: 4,
  },
  checkInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkInCopy: {
    flex: 1,
    paddingRight: 16,
  },
  checkInTitle: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.light,
    color: homeDashboard.textPrimary,
  },
  checkInSub: {
    marginTop: 4,
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: homeDashboard.textSecondary,
  },
  checkInBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: homeDashboard.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInBtnText: {
    fontSize: 22,
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
});
