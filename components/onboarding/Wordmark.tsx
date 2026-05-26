import { StyleSheet, View } from 'react-native';

import { LighthouseLogo } from '@/components/brand/LighthouseLogo';

type WordmarkProps = {
  style?: object;
  onLightBackground?: boolean;
};

export function Wordmark({ style, onLightBackground = false }: WordmarkProps) {
  return (
    <View style={[styles.wrap, style]}>
      <LighthouseLogo onLightBackground={onLightBackground} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 60,
  },
});
