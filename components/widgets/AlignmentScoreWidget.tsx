import { StyleSheet, Text, View } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { fonts, homeMist } from '@/constants/theme';

export function AlignmentScoreWidget() {
  const { alignmentScore } = useHomeWidgetContext();

  return (
    <View style={widgetCard.card}>
      <View style={widgetCard.inner}>
        <WidgetCornerArc rx={56} />
        <Text style={widgetCard.label}>ALIGNMENT</Text>
        <Text style={styles.score}>{alignmentScore.toFixed(1)}</Text>
        <WidgetAccentLine width={22} />
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < 4 ? styles.dotFilled : styles.dotEmpty,
              ]}
            />
          ))}
        </View>
        <Text style={styles.sub}>This week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  score: {
    fontFamily: fonts.extraLight,
    fontSize: 44,
    color: homeMist.textPrimary,
    letterSpacing: -1,
    lineHeight: 48,
    zIndex: 1,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    zIndex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFilled: {
    backgroundColor: homeMist.highlight,
  },
  dotEmpty: {
    backgroundColor: homeMist.highlightMuted,
  },
  sub: {
    fontSize: 11,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    marginTop: 8,
    zIndex: 1,
  },
});
