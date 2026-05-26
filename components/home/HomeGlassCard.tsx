import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';

type HomeGlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

export function HomeGlassCard({
  children,
  style,
  borderRadius = 26,
}: HomeGlassCardProps) {
  return (
    <GlassSurface variant="light" borderRadius={borderRadius} shadow="soft" style={style}>
      {children}
    </GlassSurface>
  );
}

export const homeCardStyles = StyleSheet.create({
  shell: {
    padding: 20,
    overflow: 'hidden',
  },
  shellCompact: {
    padding: 18,
    minHeight: 120,
    overflow: 'hidden',
  },
});
