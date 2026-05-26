import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useCallback } from 'react';

import { colors } from '@/constants/theme';
import { useTabBarStore } from '@/store/useTabBarStore';

export default function CheckInLayout() {
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
      return () => setTabBarHidden(false);
    }, [setTabBarHidden]),
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.backgroundTransparent },
      }}
    >
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step5" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
