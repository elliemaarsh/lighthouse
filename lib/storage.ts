import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const USER_STORAGE_KEY = 'lighthouse-user';

/** True when running in the browser or React Native — false during Node SSR. */
export const isClient = typeof window !== 'undefined';

const noopStorage: StateStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

/** AsyncStorage on device; no-op during Expo web SSR (no `window`). */
export function getUserStorage(): StateStorage {
  if (!isClient) {
    return noopStorage;
  }
  return AsyncStorage;
}

export async function clearUserStorage(): Promise<void> {
  if (!isClient) {
    return;
  }
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
}
