import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LighthouseLogo } from '@/components/brand/LighthouseLogo';
import { HomeHeaderActions } from '@/components/home/HomeHeaderActions';
import { TabScrollView } from '@/components/TabScrollView';
import { HomeWidgetGrid } from '@/components/widgets/HomeWidgetGrid';
import { WidgetLibrary } from '@/components/widgets/WidgetLibrary';
import { fonts, homeMist } from '@/constants/theme';
import { defaultWidgetsForRole, useWidgetStore } from '@/store/useWidgetStore';
import { useUserStore } from '@/store/useUserStore';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  const libraryRef = useRef<BottomSheetModal>(null);
  const [widgetsHydrated, setWidgetsHydrated] = useState(false);

  const role = useUserStore((s) => s.role);
  const name = useUserStore((s) => s.name || s.displayName || 'there');
  const activeWidgets = useWidgetStore((s) => s.activeWidgets);
  const setActiveWidgets = useWidgetStore((s) => s.setActiveWidgets);

  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);
  const dateLabel = useMemo(() => formatDateLabel(new Date()), []);

  useEffect(() => {
    const unsubFinish = useWidgetStore.persist.onFinishHydration(() => {
      setWidgetsHydrated(true);
    });
    if (useWidgetStore.persist.hasHydrated()) {
      setWidgetsHydrated(true);
    }
    return unsubFinish;
  }, []);

  useEffect(() => {
    if (!widgetsHydrated) return;
    if (activeWidgets.length === 0) {
      setActiveWidgets(defaultWidgetsForRole(role));
    }
  }, [widgetsHydrated, activeWidgets.length, role, setActiveWidgets]);

  const openLibrary = useCallback(() => {
    libraryRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <TabScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <LighthouseLogo iconSize={52} />
              <HomeHeaderActions onPlusPress={openLibrary} />
            </View>

            <View style={styles.greetingBlock}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.greeting}>{name}</Text>
              <Text style={styles.date}>{dateLabel}</Text>
            </View>

            <HomeWidgetGrid />
          </TabScrollView>
        </SafeAreaView>

        <WidgetLibrary ref={libraryRef} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  greetingBlock: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    marginTop: 40,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 40,
    fontFamily: fonts.extraLight,
    color: homeMist.textPrimary,
    lineHeight: 48,
  },
  date: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: homeMist.textMuted,
    marginTop: 4,
  },
});
