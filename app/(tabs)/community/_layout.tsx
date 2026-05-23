import { Stack } from 'expo-router';

import { COMMUNITY_SURFACE } from '@/constants/community';
import { useUserStore } from '@/store/useUserStore';

export default function CommunityLayout() {
  const hasSetUpCommunity = useUserStore((s) => s.hasSetUpCommunity);

  return (
    <Stack
      initialRouteName={hasSetUpCommunity ? 'index' : 'setup'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="setup"
        options={{
          contentStyle: { backgroundColor: COMMUNITY_SURFACE },
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="index"
        options={{ contentStyle: { backgroundColor: COMMUNITY_SURFACE } }}
      />
      <Stack.Screen
        name="post"
        options={{ contentStyle: { backgroundColor: COMMUNITY_SURFACE } }}
      />
      <Stack.Screen
        name="new-post"
        options={{ contentStyle: { backgroundColor: COMMUNITY_SURFACE } }}
      />
    </Stack>
  );
}
