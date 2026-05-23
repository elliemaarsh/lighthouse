import { useEffect, useState } from 'react';

import { isClient } from '@/lib/storage';
import { useUserStore } from '@/store/useUserStore';

/** True once persisted Zustand state (e.g. userId) has been restored from AsyncStorage. */
export function useStoreHydrated(): boolean {
  const [ready, setReady] = useState(
    () => !isClient || useUserStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (!isClient) {
      setReady(true);
      return;
    }

    if (useUserStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }

    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setReady(true);
    });

    void useUserStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  return ready;
}
