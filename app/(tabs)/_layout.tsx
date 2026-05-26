import { Tabs } from 'expo-router';

import { FloatingGlassTabBar } from '@/components/FloatingGlassTabBar';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <FloatingGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: {
          backgroundColor: colors.backgroundTransparent,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarLabel: 'Track',
          sceneStyle: { backgroundColor: colors.backgroundTransparent },
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Connect',
          tabBarLabel: 'Connect',
          sceneStyle: { backgroundColor: colors.backgroundTransparent },
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarLabel: 'Learn',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarLabel: 'Community',
        }}
      />
    </Tabs>
  );
}
