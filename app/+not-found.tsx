import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { colors, fontSizes } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text style={{ fontSize: fontSizes.h2, color: colors.textPrimary }}>
          This screen does not exist.
        </Text>
        <Link href="/" style={{ marginTop: 16 }}>
          <Text style={{ fontSize: fontSizes.body, color: colors.cobalt }}>
            Go to Home
          </Text>
        </Link>
      </View>
    </>
  );
}
