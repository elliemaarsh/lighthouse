import { BlurView } from '@react-native-community/blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { glass } from '@/constants/glass';
import { connectDashboard, fontSizes, fonts, textContrast } from '@/constants/theme';

type ConnectGlassPillProps = {
  label: string;
  onPress: () => void;
};

export function ConnectGlassPill({ label, onPress }: ConnectGlassPillProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <BlurView
        blurType="light"
        blurAmount={20}
        style={StyleSheet.absoluteFill}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"
      />
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: glass.borderLightStrong,
  },
  inner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
    ...textContrast,
  },
});
