import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { LineArt, type LineArtType } from '@/components/visuals/LineArt';
import { radius } from '@/constants/theme';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  padding?: number;
  art?: LineArtType;
};

export function GlassCard({
  children,
  style,
  borderRadius = radius.card,
  padding = 20,
  art = 'grid',
}: GlassCardProps) {
  return (
    <GlassSurface variant="card" borderRadius={borderRadius} shadow="soft" style={style}>
      <View style={[styles.inner, { padding }]}>
        <LineArt
          type={art}
          width={200}
          height={130}
          tone="light"
          placement="background"
        />
        <View style={styles.content}>{children}</View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    overflow: 'hidden',
    minHeight: 80,
  },
  content: {
    zIndex: 2,
    maxWidth: '85%',
  },
});
