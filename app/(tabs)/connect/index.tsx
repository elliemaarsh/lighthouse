import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentSheet } from '@/components/connect/AppointmentSheet';
import { ConnectCalendarSection } from '@/components/connect/ConnectCalendarSection';
import { ConnectGlassPill } from '@/components/connect/ConnectGlassPill';
import { ConnectHeroCircle } from '@/components/connect/ConnectHeroCircle';
import { ConnectSharingCard } from '@/components/connect/ConnectSharingCard';
import { ConnectSupportCard } from '@/components/connect/ConnectSupportCard';
import { PulseAlignmentCard } from '@/components/PulseAlignmentCard';
import { routes } from '@/constants/routes';
import { colors, connectDashboard, fonts, textContrast } from '@/constants/theme';
import { useTabBarScrollBehavior } from '@/hooks/useTabBarScrollBehavior';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { fetchAppointments, saveAppointment } from '@/lib/appointments';
import {
  averagePulseScore,
  computeAlignmentScore,
  fetchPulseCheckForWeek,
  hasPulseCheckThisWeek,
  isPulseCheckStale,
} from '@/lib/pulseChecks';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { fetchSharingPrefs, saveSharingPrefs } from '@/lib/sharingPrefs';
import { getWeekStartString } from '@/lib/weekStart';
import type { Appointment, SharingPrefs } from '@/types/connect';
import { useUserStore } from '@/store/useUserStore';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function ConnectIndexScreen() {
  const scrollPadding = useTabBarScrollPadding({ extra: 24 });
  const { onScroll, scrollEventThrottle } = useTabBarScrollBehavior();
  const userId = useUserStore((s) => s.userId);
  const partnerEmail = useUserStore((s) => s.partnerEmail);
  const partnerName = useUserStore((s) => s.partnerName);
  const partnerLinked = useUserStore((s) => s.partnerLinked);
  const lastPulseCheckDate = useUserStore((s) => s.lastPulseCheckDate);
  const setLastPulseCheckDate = useUserStore((s) => s.setLastPulseCheckDate);

  /** Testing: always show Treatment pill (assumes IVF journey) */
  const showTreatment = true;
  const partnerLabel = partnerFirstName(partnerName, partnerEmail);
  const weekStart = getWeekStartString();

  const [selectedDate, setSelectedDate] = useState(todayString());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sharingPrefs, setSharingPrefs] = useState<SharingPrefs>({
    moodShared: false,
    symptomsShared: false,
    cycleShared: false,
  });
  const [userPulse, setUserPulse] = useState<Awaited<
    ReturnType<typeof fetchPulseCheckForWeek>
  > | null>(null);
  const [partnerPulse, setPartnerPulse] = useState<Awaited<
    ReturnType<typeof fetchPulseCheckForWeek>
  > | null>(null);

  const sheetRef = useRef<BottomSheetModal>(null);

  const loadData = useCallback(async () => {
    const [prefs, apts, mine] = await Promise.all([
      fetchSharingPrefs(userId),
      fetchAppointments(userId),
      fetchPulseCheckForWeek(userId),
    ]);
    setSharingPrefs(prefs);
    setAppointments(apts);
    setUserPulse(mine);
    if (mine && mine.weekStart === weekStart) {
      setLastPulseCheckDate(getTodayDateString());
    }
    // Partner pulse requires linked partner user id — stub until partnerships exist
    setPartnerPulse(partnerLinked ? null : null);
  }, [userId, partnerLinked, setLastPulseCheckDate, weekStart]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const checkedInRecently = useMemo(() => {
    if (userPulse) return true;
    if (isPulseCheckStale(lastPulseCheckDate)) return false;
    return hasPulseCheckThisWeek(lastPulseCheckDate);
  }, [userPulse, lastPulseCheckDate]);

  const heroState = useMemo(() => {
    if (userPulse && partnerPulse) return 'aligned' as const;
    if (checkedInRecently) return 'waiting' as const;
    return 'prompt' as const;
  }, [userPulse, partnerPulse, checkedInRecently]);

  const alignmentScore = useMemo(
    () => computeAlignmentScore(userPulse, partnerPulse),
    [userPulse, partnerPulse],
  );

  const userPulseScore = userPulse
    ? averagePulseScore(userPulse.connectionScore, userPulse.capacityScore)
    : null;

  const partnerPulseScore = partnerPulse
    ? averagePulseScore(partnerPulse.connectionScore, partnerPulse.capacityScore)
    : null;

  const handleSharingChange = async (prefs: SharingPrefs) => {
    setSharingPrefs(prefs);
    await saveSharingPrefs(userId, prefs);
  };

  const openSheet = () => {
    sheetRef.current?.present();
  };

  const handleSaveAppointment = async (
    draft: Omit<Appointment, 'id' | 'userId'>,
  ) => {
    await saveAppointment(userId, draft);
    await loadData();
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: scrollPadding },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Connect</Text>
            {showTreatment ? (
              <ConnectGlassPill
                label="Treatment →"
                onPress={() => router.push(routes.connectTreatment)}
              />
            ) : null}
          </View>

          {heroState === 'aligned' && userPulse && alignmentScore != null ? (
            <PulseAlignmentCard
              userScore={userPulseScore ?? alignmentScore}
              partnerScore={partnerPulseScore}
              userNeed={userPulse.currentNeed}
              partnerNeed={partnerPulse?.currentNeed ?? null}
              week={weekStart}
            />
          ) : (
            <ConnectHeroCircle
              state={heroState}
              alignmentScore={alignmentScore}
              partnerLabel={partnerLabel}
              onCheckInAgain={() => router.push(routes.connectPulseCheck)}
            />
          )}

          <View style={styles.cardRow}>
            <ConnectSupportCard />
            <ConnectSharingCard prefs={sharingPrefs} onChange={handleSharingChange} />
          </View>

          <ConnectCalendarSection
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointments={appointments}
            onAddPress={openSheet}
          />
        </ScrollView>
      </SafeAreaView>

      <BottomSheetModalProvider>
        <AppointmentSheet
          ref={sheetRef}
          selectedDate={selectedDate}
          onSave={handleSaveAppointment}
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
    ...textContrast,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
});
