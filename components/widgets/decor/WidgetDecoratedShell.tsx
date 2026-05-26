import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { WidgetShell } from '@/components/widgets/WidgetShell';

type WidgetDecoratedShellProps = {
  label: string;
  children: ReactNode;
  onPress?: () => void;
  arcRx?: number;
  style?: StyleProp<ViewStyle>;
};

/** Standard home widget card with corner arc decoration */
export function WidgetDecoratedShell({
  label,
  children,
  onPress,
  arcRx = 60,
  style,
}: WidgetDecoratedShellProps) {
  return (
    <WidgetShell label={label} onPress={onPress} style={[styles.shell, style]}>
      <WidgetCornerArc rx={arcRx} />
      {children}
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
  },
});
