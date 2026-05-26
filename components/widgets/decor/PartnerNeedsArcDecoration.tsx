import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { widgetPalette } from '@/constants/widgetPalette';

type PartnerNeedsArcDecorationProps = {
  height?: number;
};

/** Three soft S-curves across the card — partner needs background */
export function PartnerNeedsArcDecoration({
  height = 140,
}: PartnerNeedsArcDecorationProps) {
  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <Svg width="100%" height={height} viewBox="0 0 320 140" preserveAspectRatio="none">
        <Path
          d="M -12 36 C 48 18 112 52 168 34 S 288 16 332 36"
          stroke={widgetPalette.secondaryStroke}
          strokeWidth={1.5}
          fill="none"
        />
        <Path
          d="M -12 70 C 52 52 118 88 176 68 S 292 48 332 70"
          stroke={widgetPalette.secondaryStroke}
          strokeWidth={1.5}
          fill="none"
        />
        <Path
          d="M -12 104 C 56 86 124 122 184 100 S 296 78 332 104"
          stroke={widgetPalette.secondaryStroke}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
