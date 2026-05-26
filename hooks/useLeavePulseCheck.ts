import { useCallback } from 'react';
import { router } from 'expo-router';

import { routes } from '@/constants/routes';

/** Exit partner pulse check-in back to the Connect home screen */
export function useLeavePulseCheck() {
  return useCallback(() => {
    router.dismissTo(routes.connect);
  }, []);
}

/** Back from pulse preview — return to check-in or Connect home */
export function useLeavePulsePreview() {
  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.dismissTo(routes.connect);
  }, []);
}
