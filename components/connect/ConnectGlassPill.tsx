import { Pressable, StyleSheet, Text } from 'react-native';

import { BUTTON_TIER_1 } from '@/constants/buttons';
import { connectDashboard, textContrast } from '@/constants/theme';

type ConnectGlassPillProps = {
  label: string;
  onPress: () => void;
};

export function ConnectGlassPill({ label, onPress }: ConnectGlassPillProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...BUTTON_TIER_1.container,
  },
  label: {
    ...BUTTON_TIER_1.label,
    color: connectDashboard.textPrimary,
    ...textContrast,
  },
});
