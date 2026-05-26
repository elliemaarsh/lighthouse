import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { CarryingTrackHome } from '@/app/(tabs)/track/CarryingTrackHome';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';
import { useUserStore, type UserRole } from '@/store/useUserStore';

const TRACK_PLACEHOLDER_BG = '#E8ECEE';

function isNonCarryingRole(role: UserRole | null): boolean {
  return role === 'non-carrying';
}

function TrackPlaceholder() {
  return <View style={styles.placeholder} />;
}

/**
 * Track tab entry — routes by role after persisted user state hydrates.
 * Non-carrying partners use the nested `partner` screen (replace, not push).
 */
export default function TrackScreen() {
  const role = useUserStore((s) => s.role);
  const storeReady = useStoreHydrated();

  console.log('Track tab: role =', role);

  useFocusEffect(
    useCallback(() => {
      if (!storeReady || !isNonCarryingRole(role)) {
        return;
      }
      router.replace('/(tabs)/track/partner');
    }, [role, storeReady]),
  );

  if (!storeReady || role == null) {
    return <TrackPlaceholder />;
  }

  if (isNonCarryingRole(role)) {
    return <TrackPlaceholder />;
  }

  return <CarryingTrackHome />;
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: TRACK_PLACEHOLDER_BG,
  },
});
