import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

export default function TrackLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.backgroundTransparent },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="partner" />
        <Stack.Screen name="export" />
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
