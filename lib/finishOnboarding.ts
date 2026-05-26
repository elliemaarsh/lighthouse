import { router } from 'expo-router';

import { useUserStore } from '@/store/useUserStore';

/** Mark onboarding complete and reset navigation to the main tab app. */
export function finishOnboarding() {
  const store = useUserStore.getState();
  store.setHasCompletedOnboarding(true);
  store.completeOnboarding();

  // dismissTo replaces the stack when (tabs) isn't in history; avoid dismissAll()
  // which can throw POP_TO_TOP on a shallow onboarding stack.
  router.dismissTo('/(tabs)');
}
