import { StyleSheet, Text, View } from 'react-native';

import { PartnerNeedsArcDecoration } from '@/components/widgets/decor/PartnerNeedsArcDecoration';
import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { InsightSparkleIcon } from '@/components/widgets/InsightSparkleIcon';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts, homeMist } from '@/constants/theme';

const ICON_CIRCLE = 'rgba(128, 185, 254, 0.12)';

function partnerDisplayName(raw: string) {
  const name = raw.trim() || 'your partner';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function PartnerNeedsWidget() {
  const { partnerName } = useHomeWidgetContext();
  const name = partnerDisplayName(partnerName);

  return (
    <View style={styles.card}>
      <View style={styles.deco} pointerEvents="none">
        <PartnerNeedsArcDecoration height={140} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <InsightSparkleIcon size={22} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.title}>What {name} needs</Text>
          <WidgetAccentLine width={32} style={styles.accent} />
          <Text style={styles.body}>
            A moment to talk about the upcoming appointment
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeMist.card,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: homeMist.cardBorder,
    shadowColor: homeMist.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
    minHeight: 148,
  },
  deco: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 22,
    paddingBottom: 26,
    zIndex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ICON_CIRCLE,
    borderWidth: 0.5,
    borderColor: 'rgba(128, 185, 254, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontFamily: fonts.extraLight,
    fontSize: 22,
    color: widgetPalette.ink,
    lineHeight: 28,
  },
  accent: {
    marginTop: 6,
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.light,
    fontSize: 15,
    color: homeMist.textMuted,
    lineHeight: 22,
  },
});
