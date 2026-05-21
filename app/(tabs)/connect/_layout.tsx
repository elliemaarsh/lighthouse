import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';
import { useTabBarStore } from '@/store/useTabBarStore';

export default function ConnectLayout() {
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.backgroundTransparent },
      }}
    >
      <Stack.Screen
        name="index"
        listeners={{
          focus: () => setTabBarHidden(false),
        }}
      />
      <Stack.Screen
        name="pulse-check"
        options={{
          presentation: 'card',
          contentStyle: { backgroundColor: colors.backgroundTransparent },
          animation: 'slide_from_right',
        }}
        listeners={{
          focus: () => setTabBarHidden(true),
          blur: () => setTabBarHidden(false),
        }}
      />
      <Stack.Screen
        name="pulse-preview"
        options={{
          presentation: 'card',
          contentStyle: { backgroundColor: colors.backgroundTransparent },
          animation: 'slide_from_right',
        }}
        listeners={{
          focus: () => setTabBarHidden(true),
          blur: () => setTabBarHidden(false),
        }}
      />
      <Stack.Screen
        name="treatment"
        listeners={{
          focus: () => setTabBarHidden(true),
          blur: () => setTabBarHidden(false),
        }}
      />
    </Stack>
  );
}
