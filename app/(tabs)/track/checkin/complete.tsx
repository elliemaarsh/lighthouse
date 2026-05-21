/*
-- daily_logs table
-- create table daily_logs (
--   id uuid default gen_random_uuid() primary key,
--   user_id uuid references auth.users(id),
--   date date not null,
--   period_status text,
--   temperature numeric,
--   temp_unit text default 'F',
--   mood integer,
--   mood_note text,
--   symptoms text[],
--   notes text,
--   created_at timestamp default now()
-- );
*/

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { PillButton } from '@/components/onboarding/PillButton';
import { useCheckIn } from '@/contexts/CheckInContext';
import { saveDailyLog, getTodayDateString } from '@/lib/dailyLogs';
import { ensureLocalUserId } from '@/lib/localUserId';
import { publishCarryingPartnerSharedLog } from '@/lib/partnerSharedLog';
import { todayCheckInSession } from '@/lib/todayCheckIn';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, spacing, textContrast, typography } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function CheckInCompleteScreen() {
  const { data, reset } = useCheckIn();
  const userId = useUserStore((s) => s.userId);
  const role = useUserStore((s) => s.role);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    const snapshot = { ...data };

    const persist = async () => {
      const uid = userId ?? ensureLocalUserId();
      await saveDailyLog(uid, snapshot);
      const logged = {
        ...snapshot,
        date: getTodayDateString(),
      };
      if (role === 'carrying' || role === 'both') {
        await publishCarryingPartnerSharedLog(logged);
      }
      if (mounted) {
        todayCheckInSession.setLogged(logged);
        reset();
        setSaved(true);
      }
    };

    void persist();

    return () => {
      mounted = false;
    };
  }, [data, reset, role, userId]);

  const goHome = () => {
    router.replace(routes.track);
  };

  const viewSummary = () => {
    router.replace(routes.track);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <GlassSurface variant="card" borderRadius={40} shadow="soft">
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color={colors.textPrimary} />
          </View>
        </GlassSurface>
        <Text style={styles.headline}>Logged.</Text>
        <Text style={styles.subtext}>You showed up for yourself today.</Text>
        {!saved ? (
          <Text style={styles.saving}>Saving your check-in…</Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <PillButton label="View today's summary" variant="ghost" onPress={viewSummary} />
        <PillButton label="Back to home" onPress={goHome} style={styles.primarySpacing} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: fontSizes.displaySm,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: 'center',
    ...textContrast,
  },
  subtext: {
    fontSize: fontSizes.body,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    ...textContrast,
  },
  saving: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginTop: spacing.md,
    ...textContrast,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
  },
  primarySpacing: {
    marginTop: 12,
  },
});
