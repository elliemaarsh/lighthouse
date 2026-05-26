import { StyleSheet, Text, View } from 'react-native';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { PARTNER_TIPS_BY_DAY } from '@/constants/partner';
import { fonts, homeMist } from '@/constants/theme';

export function SpermHealthTipWidget() {
  const tip = PARTNER_TIPS_BY_DAY[new Date().getDay()];

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc rx={56} />
        <Text style={widgetCard.label}>SPERM HEALTH</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tip: {
    fontFamily: fonts.extraLight,
    fontSize: 16,
    color: homeMist.textPrimary,
    lineHeight: 24,
    zIndex: 1,
  },
});
