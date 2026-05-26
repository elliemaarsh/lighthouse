import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { DID_YOU_KNOW_BY_DAY } from '@/constants/widgets';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts, homeMist } from '@/constants/theme';

export function DidYouKnowWidget() {
  const fact = DID_YOU_KNOW_BY_DAY[new Date().getDay()];

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc rx={70} />
        <View style={styles.starWrap}>
          <View style={styles.starGlow} />
          <Svg width={22} height={22} viewBox="0 0 20 20">
            <Path
              d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15.5 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z"
              stroke={widgetPalette.secondary}
              strokeWidth={1.2}
              fill="rgba(128, 185, 254, 0.08)"
            />
          </Svg>
        </View>
        <Text style={widgetCard.label}>DID YOU KNOW</Text>
        <Text style={styles.fact}>{fact}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  starWrap: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  starGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(128, 185, 254, 0.12)',
  },
  fact: {
    fontFamily: fonts.extraLight,
    fontSize: 16,
    color: homeMist.textPrimary,
    lineHeight: 24,
    paddingRight: 36,
    zIndex: 1,
  },
});
