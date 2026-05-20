import { Tabs } from 'expo-router';

import { FloatingGlassTabBar } from '@/components/FloatingGlassTabBar';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: {
          backgroundColor: colors.backgroundTransparent,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          sceneStyle: { backgroundColor: colors.backgroundTransparent },
        }}
      />
      <Tabs.Screen name="connect" options={{ title: 'Connect' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="community" options={{ title: 'Forum' }} />
    </Tabs>
  );
}
