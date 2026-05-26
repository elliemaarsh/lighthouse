import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { routes } from '@/constants/routes';
import { isClient } from '@/lib/storage';
import { pulseDraftSession } from '@/lib/pulseDraft';
import { useTrackStore } from '@/store/useTrackStore';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

/** Dev-only: wipe persisted + in-memory app state and return to onboarding. */
export async function resetAppForDev(): Promise<void> {
  useUserStore.getState().resetOnboarding();
  useTabBarStore.getState().setHidden(false);
  useTrackStore.getState().clearTodayCheckIn();
  pulseDraftSession.clear();

  if (isClient) {
    await useUserStore.persist.clearStorage();
    await AsyncStorage.clear();
  }

  router.replace(routes.welcome);
}
