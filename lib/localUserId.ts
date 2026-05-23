import { isClient } from '@/lib/storage';
import { useUserStore } from '@/store/useUserStore';

function generateLocalUserId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Stable per-install id for Supabase rows and local check-in storage (no auth yet). */
export function ensureLocalUserId(): string {
  const existing = useUserStore.getState().userId;
  if (existing) return existing;

  // Creating an id before rehydration can orphan AsyncStorage logs when the real userId loads.
  if (isClient && !useUserStore.persist.hasHydrated()) {
    console.warn(
      '[Lighthouse] ensureLocalUserId called before store hydration — wait for useStoreHydrated()',
    );
    return existing ?? '';
  }

  const id = generateLocalUserId();
  useUserStore.getState().setUserId(id);
  return id;
}
