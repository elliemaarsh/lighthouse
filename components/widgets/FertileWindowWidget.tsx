import { StyleSheet, Text, View } from 'react-native';

import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts } from '@/constants/theme';

const DOTS = [
  { opacity: 0.25 },
  { opacity: 0.45 },
  { peak: true as const },
  { opacity: 0.35 },
  { opacity: 0.15 },
] as const;

export function FertileWindowWidget() {
  const { isCarrying, partnerName } = useHomeWidgetContext();

  const mainText = isCarrying
    ? 'You may be fertile today'
    : `${partnerName.charAt(0).toUpperCase()}${partnerName.slice(1)} may be fertile today`;

  return (
    <View style={widgetCard.card}>
      <View style={styles.inner}>
        <WidgetCornerArc />

        <View style={styles.decoAnchor} pointerEvents="none">
          <View style={styles.decoPulseRing} />
          <View style={styles.decoCircle}>
            <View style={styles.decoDot} />
          </View>
        </View>

        <Text style={widgetCard.label}>FERTILE WINDOW</Text>
        <Text style={styles.main}>{mainText}</Text>

        <View style={styles.dots}>
          {DOTS.map((dot, i) =>
            'peak' in dot && dot.peak ? (
              <View key={i} style={styles.peakWrap}>
                <View style={styles.peakGlow} />
                <View style={styles.peakDot} />
              </View>
            ) : (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: `rgba(241, 78, 42, ${
                      'opacity' in dot ? dot.opacity : 0.25
                    })`,
                  },
                ]}
              />
            ),
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 18,
    overflow: 'hidden',
    minHeight: 120,
  },
  decoAnchor: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  decoPulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: widgetPalette.fertileRing,
  },
  decoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: widgetPalette.fertileSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: widgetPalette.fertilePeak,
  },
  main: {
    fontFamily: fonts.extraLight,
    fontSize: 20,
    color: widgetPalette.ink,
    lineHeight: 28,
    marginBottom: 18,
    paddingRight: 48,
    zIndex: 1,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  peakWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peakGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: widgetPalette.fertileGlow,
  },
  peakDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: widgetPalette.fertilePeak,
  },
});
