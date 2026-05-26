import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { fonts, typography } from '@/constants/theme';

const LOGO_SOURCE = require('@/assets/images/lighthouse-logo.png');
const LOGO_COLOR = '#34312F';

type LighthouseLogoProps = {
  showWordmark?: boolean;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  /** Override mark and wordmark color (e.g. white on photo backgrounds) */
  color?: string;
  /** @deprecated Kept for API compatibility */
  onLightBackground?: boolean;
};

export function LighthouseLogo({
  showWordmark = true,
  iconSize = 26,
  style,
  color,
}: LighthouseLogoProps) {
  const textColor = color ?? LOGO_COLOR;
  const iconTint = color ?? LOGO_COLOR;

  return (
    <View style={[styles.row, style]}>
      <Image
        source={LOGO_SOURCE}
        style={{ width: iconSize, height: iconSize, tintColor: iconTint }}
        resizeMode="contain"
        accessibilityLabel="Lighthouse"
      />
      {showWordmark ? (
        <Text style={[styles.wordmark, { color: textColor }]}>LIGHTHOUSE</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    ...typography.wordmark,
    fontFamily: fonts.light,
    fontSize: 11,
    letterSpacing: 4,
    color: LOGO_COLOR,
  },
});
