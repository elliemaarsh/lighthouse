import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts, homeMist } from '@/constants/theme';

export function OvulationWidget() {
  const { isCarrying, partnerName } = useHomeWidgetContext();

  const mainText = isCarrying
    ? 'Ovulation likely tomorrow'
    : `${partnerName.charAt(0).toUpperCase()}${partnerName.slice(1)}'s ovulation likely tomorrow`;

  const subtext = isCarrying
    ? 'Your most fertile days are approaching'
    : 'Her most fertile days are approaching';

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc />
        <View style={styles.iconWrap}>
          <Ionicons name="calendar-outline" size={18} color={widgetPalette.primary} />
        </View>
        <Text style={widgetCard.label}>OVULATION</Text>
        <Text style={styles.main}>{mainText}</Text>
        <Text style={styles.sub}>{subtext}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(39, 53, 158, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  main: {
    fontFamily: fonts.extraLight,
    fontSize: 18,
    color: homeMist.textPrimary,
    lineHeight: 26,
    paddingRight: 40,
    zIndex: 1,
  },
  sub: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginTop: 6,
    zIndex: 1,
  },
});
