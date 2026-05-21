import { Stack } from 'expo-router';

import { onboardingTheme } from '@/app/onboarding/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: onboardingTheme.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" options={{ animation: 'none' }} />
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="name" />
      <Stack.Screen name="birth-date" />
      <Stack.Screen name="biological-sex" />
      <Stack.Screen name="relationship" />
      <Stack.Screen name="partner-sex" />
      <Stack.Screen name="partner-name" />
      <Stack.Screen name="role" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="cycle" />
      <Stack.Screen name="fertility-history" />
      <Stack.Screen
        name="listen-carrying"
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="listen-non-carrying"
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="invite" />
    </Stack>
  );
}
