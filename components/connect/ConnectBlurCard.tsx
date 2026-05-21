import { BlurView } from '@react-native-community/blur';
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glass } from '@/constants/glass';
import { connectDashboard } from '@/constants/theme';

type ConnectBlurCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  blurAmount?: number;
  padding?: number;
  onPress?: () => void;
};

export function ConnectBlurCard({
  children,
  style,
  borderRadius = 20,
  blurAmount = 16,
  padding = 16,
  onPress,
}: ConnectBlurCardProps) {
  const shell = (
    <View
      style={[
        styles.shell,
        { borderRadius, borderColor: glass.borderLight },
        style,
      ]}
    >
      {Platform.OS === 'web' ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: glass.fallbackLight },
          ]}
        />
      ) : (
        <BlurView
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          blurType="light"
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={glass.fallbackLight}
        />
      )}
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{shell}</Pressable>;
  }
  return shell;
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    zIndex: 2,
  },
});
