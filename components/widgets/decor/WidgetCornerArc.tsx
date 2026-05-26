import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

import { widgetPalette } from '@/constants/widgetPalette';

type WidgetCornerArcProps = {
  /** Bottom-right corner offset */
  bottom?: number;
  right?: number;
  rx?: number;
  style?: StyleProp<ViewStyle>;
};

/** Soft semicircle accent — bottom-right of widget cards */
export function WidgetCornerArc({
  bottom = -20,
  right = -20,
  rx = 80,
  style,
}: WidgetCornerArcProps) {
  const size = rx * 2;
  return (
    <View
      style={[styles.wrap, { bottom, right, width: size, height: size }, style]}
      pointerEvents="none"
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Ellipse
          cx={rx}
          cy={rx}
          rx={rx}
          ry={rx}
          stroke={widgetPalette.secondaryStrokeSoft}
          strokeWidth={1}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
});
