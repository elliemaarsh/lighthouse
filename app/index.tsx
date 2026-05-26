import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/constants/theme';
import { isClient } from '@/lib/storage';
import { useUserStore } from '@/store/useUserStore';

export default function Index() {
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

  if (!storeReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.backgroundTransparent,
        }}
      >
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
