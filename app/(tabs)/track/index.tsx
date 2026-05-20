import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';

import { CheckInSummaryGrid } from '@/components/CheckInSummaryGrid';
import { DataMetricCard } from '@/components/DataMetricCard';
import { GlassCard } from '@/components/GlassCard';
import { PillButton } from '@/components/onboarding/PillButton';
import { routes } from '@/constants/routes';
import PartnerTrackScreen from './partner';
import { colors, fontSizes, fonts, spacing, textContrast, typography } from '@/constants/theme';
import { todayCheckInSession } from '@/lib/todayCheckIn';
import type { TodayLogSummary } from '@/types/checkIn';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

export default function TrackScreen() {
  const role = useUserStore((s) => s.role);
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const scrollBottomPad = useTabBarScrollPadding();
  const [hasLoggedToday, setHasLoggedToday] = useState(
    todayCheckInSession.getHasLoggedToday(),
  );
  const [todayLog, setTodayLog] = useState<TodayLogSummary | null>(
    todayCheckInSession.getTodayLog(),
  );

  useFocusEffect(
    useCallback(() => {
      setHasLoggedToday(todayCheckInSession.getHasLoggedToday());
      setTodayLog(todayCheckInSession.getTodayLog());
      if (role !== 'non-carrying') {
        setTabBarHidden(false);
      }
    }, [role, setTabBarHidden]),
  );

  if (role === 'non-carrying') {
    return <PartnerTrackScreen />;
  }

  const beginCheckIn = () => {
    setTabBarHidden(true);
    router.push(routes.checkinStep1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces
      >
        {!hasLoggedToday ? (
          <>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>How are you today?</Text>

            <GlassCard borderRadius={24} padding={28} art="orbits" style={styles.cardSpacing}>
              <Text style={styles.cardTitle}>Your daily check-in</Text>
              <Text style={styles.cardSub}>Takes about 2 minutes</Text>
              <PillButton
                label="Begin →"
                onPress={beginCheckIn}
                variant="glass"
                style={styles.beginBtn}
              />
            </GlassCard>

            <View style={styles.dataSection}>
              <DataMetricCard
                size="hero"
                label="Last 7 days"
                value="No logs yet"
                subtitle="Complete your first check-in to see patterns"
                art="orbits"
              />
              <DataMetricCard
                label="Cycle day"
                value="—"
                subtitle="Log your period to start tracking"
                art="arcs"
                style={styles.fullWidth}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Today's check-in</Text>

            {todayLog ? <CheckInSummaryGrid log={todayLog} /> : null}

            <Pressable onPress={beginCheckIn} style={styles.editWrap}>
              <Text style={styles.editLink}>Edit today's log</Text>
            </Pressable>
          </>
        )}
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
  greeting: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...textContrast,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: spacing.lg,
    ...textContrast,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  dataSection: {
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    ...textContrast,
  },
  cardSub: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
    ...textContrast,
  },
  beginBtn: {
    marginTop: 4,
  },
  editWrap: {
    marginTop: spacing.md,
    paddingVertical: 12,
  },
  editLink: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    ...textContrast,
  },
});
