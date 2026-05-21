import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

import { routes } from '@/constants/routes';
import { isClient } from '@/lib/storage';
import { useUserStore } from '@/store/useUserStore';

function isOnboardingRoute(root: string | undefined) {
  return root === undefined || root === 'onboarding';
}

/**
 * Sends users to onboarding or tabs based on completion state.
 * Waits for persisted state before redirecting returning users.
 */
export function useOnboardingNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);
  const [storeReady, setStoreReady] = useState(
    () => !isClient || useUserStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (!isClient) {
      setStoreReady(true);
      return;
    }

    if (useUserStore.persist.hasHydrated()) {
      setStoreReady(true);
      return;
    }

    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setStoreReady(true);
    });

    useUserStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!storeReady || !navigationState?.key) {
      return;
    }

    const root = segments[0];
    const inOnboarding = isOnboardingRoute(root);
    const inTabs = root === '(tabs)';

    if (hasCompletedOnboarding && inOnboarding) {
      router.replace(routes.home);
      return;
    }

    if (!hasCompletedOnboarding && inTabs) {
      router.replace('/onboarding/splash');
    }
  }, [hasCompletedOnboarding, navigationState?.key, router, segments, storeReady]);
}
