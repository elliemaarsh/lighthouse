import { Stack } from 'expo-router';

import { CheckInProvider } from '@/contexts/CheckInContext';
import { colors } from '@/constants/theme';

export default function CheckInLayout() {
  return (
    <CheckInProvider>
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
    </CheckInProvider>
  );
}
