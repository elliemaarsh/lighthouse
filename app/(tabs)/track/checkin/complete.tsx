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
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { PillButton } from '@/components/onboarding/PillButton';
import {
  clearCheckInCompletionSnapshot,
  stashCheckInCompletionSnapshot,
  takeCheckInCompletionSnapshot,
} from '@/lib/checkInComplete';
import { saveDailyLog, getTodayDateString } from '@/lib/dailyLogs';
import { ensureLocalUserId } from '@/lib/localUserId';
import { publishCarryingPartnerSharedLog } from '@/lib/partnerSharedLog';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, spacing, textContrast, typography } from '@/constants/theme';
import {
  checkInDraftToData,
  useCheckInStore,
} from '@/store/useCheckInStore';
import { useTrackStore } from '@/store/useTrackStore';
import { useUserStore } from '@/store/useUserStore';

export default function CheckInCompleteScreen() {
  const userId = useUserStore((s) => s.userId);
  const role = useUserStore((s) => s.role);
  const setTodayCheckIn = useTrackStore((s) => s.setTodayCheckIn);
  const [saved, setSaved] = useState(false);
  const saveStarted = useRef(false);

  useEffect(() => {
    if (saveStarted.current) return;
    saveStarted.current = true;

    const draft = useCheckInStore.getState();
    const snapshot =
      takeCheckInCompletionSnapshot() ?? stashCheckInCompletionSnapshot(checkInDraftToData(draft));

    console.log('Saving check-in:', {
      periodStatus: snapshot.periodStatus,
      temperature: snapshot.temperature,
      tempUnit: snapshot.tempUnit,
      mood: snapshot.mood,
      symptoms: snapshot.symptoms,
      notes: snapshot.notes,
    });

    let mounted = true;

    const persist = async () => {
      const uid = userId ?? ensureLocalUserId();
      const { error } = await saveDailyLog(uid, snapshot);
      if (error) {
        console.warn('[Lighthouse] check-in save error:', error.message);
      } else {
        console.log('[Lighthouse] check-in saved for', getTodayDateString());
      }

      if (role === 'carrying' || role === 'both') {
        await publishCarryingPartnerSharedLog({
          ...snapshot,
          date: getTodayDateString(),
        });
      }

      if (mounted) {
        setTodayCheckIn(snapshot);
        useCheckInStore.getState().reset();
        clearCheckInCompletionSnapshot();
        setSaved(true);
      }
    };

    void persist();

    return () => {
      mounted = false;
    };
  }, [role, setTodayCheckIn, userId]);

  useEffect(() => {
    if (!saved) return;

    const timer = setTimeout(() => {
      router.dismissTo(routes.track);
    }, 1200);

    return () => clearTimeout(timer);
  }, [saved]);

  const goToTrack = () => {
    router.dismissTo(routes.track);
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
        <PillButton
          label="View today's summary"
          onPress={goToTrack}
          disabled={!saved}
          tier={2}
        />
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
});
