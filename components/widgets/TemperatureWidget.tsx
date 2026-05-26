import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts, homeMist } from '@/constants/theme';

export function TemperatureWidget() {
  const { temperature } = useHomeWidgetContext();

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc rx={64} />
        <Text style={widgetCard.label}>TEMPERATURE</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{temperature.toFixed(1)}</Text>
          <Text style={styles.unit}>°F</Text>
        </View>
        <WidgetAccentLine width={24} />
        <View style={styles.trendRow}>
          <Ionicons name="trending-down" size={14} color={widgetPalette.secondary} />
          <Text style={styles.trend}>0.1° lower</Text>
        </View>
        <View style={styles.sparklineWrap}>
          <Svg width="100%" height={32} viewBox="0 0 180 32" preserveAspectRatio="none">
            <Path
              d="M 0,18 C 20,10 40,22 60,16 C 80,10 100,20 120,14 C 140,8 160,16 180,12"
              stroke={widgetPalette.secondary}
              strokeWidth={1.5}
              fill="none"
              opacity={0.75}
            />
            <Path
              d="M 0,22 C 30,18 60,24 90,20 S 150,16 180,20"
              stroke={widgetPalette.accentLine}
              strokeWidth={1}
              fill="none"
              opacity={0.2}
            />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    zIndex: 1,
  },
  value: {
    fontFamily: fonts.extraLight,
    fontSize: 40,
    color: homeMist.textPrimary,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 15,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginLeft: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  trend: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginLeft: 4,
  },
  sparklineWrap: {
    marginTop: 12,
    width: '100%',
    height: 32,
    zIndex: 1,
  },
});
