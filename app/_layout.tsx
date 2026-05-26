import 'react-native-gesture-handler';
import '../global.css';

import { Inter_200ExtraLight, Inter_300Light, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FlowerBackground } from '@/components/FlowerBackground';
import { colors } from '@/constants/theme';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { ensureLocalUserId } from '@/lib/localUserId';
import { useTrackStore } from '@/store/useTrackStore';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
  });

  useOnboardingNavigation();

  useEffect(() => {
    ensureLocalUserId();
    useTrackStore.getState().resetIfNewDay();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && Platform.OS !== 'web') {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <FlowerBackground style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.backgroundTransparent },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="name" />
          <Stack.Screen name="role" />
          <Stack.Screen name="journey" />
          <Stack.Screen name="partner" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </FlowerBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
