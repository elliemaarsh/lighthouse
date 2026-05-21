import { Stack } from 'expo-router';

import { LEARN_BACKGROUND } from '@/constants/learn';

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: LEARN_BACKGROUND },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="article" />
    </Stack>
  );
}
