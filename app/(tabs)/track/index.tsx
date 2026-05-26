import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';

import { MedicalExportCard } from '@/components/track/MedicalExportCard';
import { TrackTodayDetailSection } from '@/components/track/TrackTodayDetailSection';
import { TrackWeekStripSection } from '@/components/track/TrackWeekStripSection';
import PartnerTrackScreen from './partner';
import { colors, spacing } from '@/constants/theme';
import {
  fetchDailyLogsInRange,
  type DailyLogEntry,
} from '@/lib/logsInRange';
import {
  buildWeekDayCells,
  getWeekEndString,
} from '@/lib/trackWeekView';
import { getWeekStartString } from '@/lib/weekStart';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useCheckInStore } from '@/store/useCheckInStore';
import { useTrackStore } from '@/store/useTrackStore';
import { useUserStore } from '@/store/useUserStore';

export default function TrackScreen() {
  const role = useUserStore((s) => s.role);
  const userId = useUserStore((s) => s.userId);
  const hasLoggedToday = useTrackStore((s) => s.hasLoggedToday);
  const todayLog = useTrackStore((s) => s.todayLog);
  const hydrateFromRemote = useTrackStore((s) => s.hydrateFromRemote);
  const resetIfNewDay = useTrackStore((s) => s.resetIfNewDay);
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const scrollBottomPad = useTabBarScrollPadding();
  const [weekLogs, setWeekLogs] = useState<DailyLogEntry[]>([]);

  const weekDays = useMemo(
    () => buildWeekDayCells(weekLogs, todayLog, hasLoggedToday),
    [weekLogs, todayLog, hasLoggedToday],
  );

  useFocusEffect(
    useCallback(() => {
      resetIfNewDay();
      const weekStart = getWeekStartString();
      const weekEnd = getWeekEndString(weekStart);

      const load = async () => {
        await hydrateFromRemote(userId);
        const logs = await fetchDailyLogsInRange(userId, weekStart, weekEnd);
        setWeekLogs(logs);
      };

      void load();
      setTabBarHidden(false);
    }, [hydrateFromRemote, resetIfNewDay, setTabBarHidden, userId]),
  );

  if (role === 'non-carrying') {
    return <PartnerTrackScreen />;
  }

  const beginCheckIn = () => {
    useCheckInStore.getState().reset();
    setTabBarHidden(true);
    router.push({
      pathname: '/(tabs)/track/checkin/step1',
      params: { mode: 'new' },
    });
  };

  const editCheckIn = () => {
    setTabBarHidden(true);
    router.push({
      pathname: '/(tabs)/track/checkin/step1',
      params: { mode: 'edit' },
    });
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
        <TrackWeekStripSection
          days={weekDays}
          hasLoggedToday={hasLoggedToday}
          onBeginCheckIn={beginCheckIn}
        />

        <TrackTodayDetailSection
          hasLoggedToday={hasLoggedToday}
          todayLog={todayLog}
          onLogToday={beginCheckIn}
          onEdit={editCheckIn}
        />

        <View style={styles.exportWrap}>
          <MedicalExportCard />
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
  exportWrap: {
    marginTop: spacing.md,
  },
});
