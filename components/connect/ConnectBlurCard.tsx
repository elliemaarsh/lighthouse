import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';

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
  padding = 16,
  onPress,
}: ConnectBlurCardProps) {
  const shell = (
    <GlassSurface
      variant="card"
      borderRadius={borderRadius}
      shadow="none"
      style={style}
    >
      <View style={[styles.content, { padding }]}>{children}</View>
    </GlassSurface>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{shell}</Pressable>;
  }
  return shell;
}

const styles = StyleSheet.create({
  content: {
    zIndex: 2,
  },
});
