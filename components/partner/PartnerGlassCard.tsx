import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { radius } from '@/constants/theme';

type PartnerGlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  padding?: number;
  onPress?: () => void;
  selected?: boolean;
};

/** Partner / Track tiles — same liquid glass as the rest of the app */
export function PartnerGlassCard({
  children,
  style,
  borderRadius = radius.card,
  padding = 18,
  onPress,
  selected = false,
}: PartnerGlassCardProps) {
  const shell = (
    <GlassSurface
      variant={selected ? 'selected' : 'card'}
      borderRadius={borderRadius}
      shadow="soft"
      style={[styles.shell, style]}
    >
      <View style={[styles.content, { padding }]}>{children}</View>
    </GlassSurface>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, noFocusRing]}>
        {shell}
      </Pressable>
    );
  }

  return shell;
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  content: {
    zIndex: 2,
  },
  pressed: {
    opacity: 0.94,
  },
});
