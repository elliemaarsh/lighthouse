import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppGradientBackground } from '@/components/AppGradientBackground';
import { colors } from '@/constants/theme';

export default function TrackLayout() {
  return (
    <View style={styles.root}>
      <AppGradientBackground style={StyleSheet.absoluteFillObject} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.backgroundTransparent },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="checkin" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
