import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TabScrollView } from '@/components/TabScrollView';
import { HomeDashboardHeader } from '@/components/home/HomeDashboardHeader';
import { CycleDayCard } from '@/components/widgets/CycleCounterWidget';
import { HomeGlassCard, homeCardStyles } from '@/components/home/HomeGlassCard';
import { HomeScreenBackground } from '@/components/home/HomeScreenBackground';
import { routes } from '@/constants/routes';
import { fonts, fontSizes, homeDashboard, radius } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { useTrackStore } from '@/store/useTrackStore';
import { useUserStore } from '@/store/useUserStore';

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

function FertileDots() {
  return (
    <View style={styles.fertileDots}>
      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
        <View
          key={d}
          style={[styles.fertileDot, d >= 3 && d <= 5 && styles.fertileDotActive]}
        />
      ))}
    </View>
  );
}

function PartnerWaveform() {
  const heights = [18, 28, 22, 34, 20, 30, 16];
  return (
    <View style={styles.waveform}>
      {heights.map((h, i) => (
        <View key={i} style={[styles.waveBar, { height: h }]} />
      ))}
    </View>
  );
}

export function CarryingHomeDashboard() {
  const scrollPadding = useTabBarScrollPadding({ extra: 16 });
  const displayName = useUserStore((s) => s.displayName);
  const partnerName = useUserStore((s) => s.partnerName);
  const partnerEmail = useUserStore((s) => s.partnerEmail);
  const userId = useUserStore((s) => s.userId);

  const hasLoggedToday = useTrackStore((s) => s.hasLoggedToday);
  const hydrateFromRemote = useTrackStore((s) => s.hydrateFromRemote);
  const resetIfNewDay = useTrackStore((s) => s.resetIfNewDay);

  const partnerLabel = partnerFirstName(partnerName, partnerEmail);
  const firstName = displayName?.trim().split(/\s+/)[0] ?? 'there';

  const { greeting, dateLabel } = useMemo(() => {
    const now = new Date();
    return {
      greeting: `${greetingForHour(now.getHours())}, ${firstName}`,
      dateLabel: formatDateLabel(now),
    };
  }, [firstName]);

  useFocusEffect(
    useCallback(() => {
      resetIfNewDay();
      void hydrateFromRemote(userId);
    }, [hydrateFromRemote, resetIfNewDay, userId]),
  );

  const insightBody = hasLoggedToday
    ? 'Your cycle window is open — keep logging basal temperature this week for clearer patterns.'
    : 'Start today’s check-in to capture mood, symptoms, and temperature in one place.';

  return (
    <HomeScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TabScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <HomeDashboardHeader greeting={greeting} dateLabel={dateLabel} />

          <View style={styles.stack}>
            <HomeGlassCard style={styles.card}>
              <View style={[homeCardStyles.shell, styles.insightRow]}>
                <View style={styles.insightIcon}>
                  <Ionicons name="sparkles" size={18} color={homeDashboard.accentBlue} />
                </View>
                <View style={styles.insightCopy}>
                  <Text style={styles.cardLabel}>Today's insight</Text>
                  <Text style={styles.insightBody}>{insightBody}</Text>
                </View>
              </View>
            </HomeGlassCard>

            <CycleDayCard />

            <View style={styles.splitRow}>
              <HomeGlassCard style={styles.splitCard}>
                <View style={homeCardStyles.shellCompact}>
                  <Text style={styles.cardLabel}>Period</Text>
                  <Text style={styles.statMedium}>4</Text>
                  <Text style={styles.statUnit}>days</Text>
                </View>
              </HomeGlassCard>
              <HomeGlassCard style={styles.splitCard}>
                <View style={homeCardStyles.shellCompact}>
                  <Text style={styles.cardLabel}>Temperature</Text>
                  <Text style={styles.statMedium}>97.8°F</Text>
                  <Ionicons
                    name="trending-up"
                    size={14}
                    color={homeDashboard.accentGold}
                    style={styles.tempTrend}
                  />
                </View>
              </HomeGlassCard>
            </View>

            <HomeGlassCard style={styles.card}>
              <View style={[homeCardStyles.shell, styles.fertileRow]}>
                <View style={styles.fertileCopy}>
                  <Text style={styles.cardLabel}>Fertile window</Text>
                  <Text style={styles.cardTitle}>You may be fertile today</Text>
                  <FertileDots />
                </View>
                <View style={styles.fertileBadge}>
                  <Ionicons name="ellipse" size={28} color={homeDashboard.accentBlue} />
                </View>
              </View>
            </HomeGlassCard>

            <HomeGlassCard style={styles.card}>
              <View style={[homeCardStyles.shell, styles.partnerRow]}>
                <View style={styles.partnerCopy}>
                  <Text style={styles.cardLabel}>What {partnerLabel} needs</Text>
                  <Text style={styles.cardTitle}>
                    A moment to talk about the upcoming appointment
                  </Text>
                </View>
                <PartnerWaveform />
              </View>
            </HomeGlassCard>

            <Pressable onPress={() => router.push(routes.checkinStep1)}>
              <HomeGlassCard style={styles.card}>
                <View style={[homeCardStyles.shell, styles.checkInRow]}>
                  <View style={styles.checkInCopy}>
                    <Text style={styles.checkInTitle}>Begin today's check-in</Text>
                    <Text style={styles.checkInSub}>
                      Track your cycle, mood, and symptoms
                    </Text>
                  </View>
                  <View style={styles.checkInBtn}>
                    <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
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
  card: {
    width: '100%',
  },
  cardLabel: {
    fontSize: fontSizes.micro,
    fontFamily: fonts.regular,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: homeDashboard.textMuted,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: fontSizes.body,
    fontFamily: fonts.light,
    color: homeDashboard.textPrimary,
    lineHeight: 22,
  },
  insightRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 155, 184, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: {
    flex: 1,
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
  statMedium: {
    fontSize: 36,
    fontFamily: fonts.extraLight,
    color: homeDashboard.textPrimary,
    lineHeight: 40,
  },
  statUnit: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: homeDashboard.textSecondary,
    marginTop: 2,
  },
  tempTrend: {
    marginTop: 8,
  },
  fertileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fertileCopy: {
    flex: 1,
    paddingRight: 12,
  },
  fertileDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  fertileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(28, 24, 20, 0.12)',
  },
  fertileDotActive: {
    backgroundColor: homeDashboard.accentOrange,
  },
  fertileBadge: {
    opacity: 0.85,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  partnerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 36,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(107, 155, 184, 0.45)',
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
});
