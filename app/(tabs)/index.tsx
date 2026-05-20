import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DataMetricCard } from '@/components/DataMetricCard';
import { GlassSurface } from '@/components/GlassSurface';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, radius, spacing, textContrast, typography } from '@/constants/theme';
import { todayCheckInSession } from '@/lib/todayCheckIn';
import { useUserStore } from '@/store/useUserStore';

export default function HomeScreen() {
  const displayName = useUserStore((s) => s.displayName);
  const partnerLinked = useUserStore((s) => s.partnerLinked);
  const hasLoggedToday = todayCheckInSession.getHasLoggedToday();
  const todayLog = todayCheckInSession.getTodayLog();
  const nameLabel = displayName?.trim() ? displayName.trim() : 'Your';

  const moodValue =
    todayLog?.mood != null
      ? `${['', 'Low', 'Meh', 'Okay', 'Good', 'Great'][todayLog.mood]} · ${todayLog.mood}/5`
      : hasLoggedToday
        ? '—'
        : 'Not logged';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.dashboardTitle}>{nameLabel}'s Dashboard</Text>
          </View>
          <GlassSurface variant="pill" borderRadius={radius.pill} shadow="soft">
            <View style={styles.avatar} />
          </GlassSurface>
        </View>

        <View style={styles.grid}>
          <DataMetricCard
            size="hero"
            label="Today"
            value={hasLoggedToday ? 'Logged' : 'No log yet'}
            subtitle={moodValue}
            art="orbits"
            style={styles.hero}
            footer={
              !hasLoggedToday ? (
                <Pressable
                  onPress={() => router.push(routes.checkinStep1)}
                  style={styles.cardLinkWrap}
                >
                  <Text style={styles.cardLink}>Log your day →</Text>
                </Pressable>
              ) : null
            }
          />
          <View style={styles.row}>
            <DataMetricCard
              label="Cycle day"
              value="—"
              subtitle="Start tracking"
              art="arcs"
              style={styles.cell}
            />
            <DataMetricCard
              label="Partner"
              value={partnerLinked ? 'Connected' : 'Pending'}
              subtitle={partnerLinked ? 'Linked' : 'Invite to link'}
              art="timeline"
              style={styles.cell}
            />
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
    paddingBottom: spacing.tabBarInset,
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
