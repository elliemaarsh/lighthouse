import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/constants/theme';

/** Send `/` to the onboarding stack so nested screen navigation works on web. */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding');
  }, [router]);

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
