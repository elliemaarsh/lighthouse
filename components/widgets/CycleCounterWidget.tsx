import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { widgetCard } from '@/components/widgets/widgetStyles';
import {
  CYCLE_ACCENT,
  CYCLE_DOT_COUNT,
  DEFAULT_CYCLE_LENGTH,
  cycleFilledDotCount,
  cyclePhaseForDay,
} from '@/lib/cycleDay';
import { fonts, homeMist } from '@/constants/theme';

export type CycleDayCardProps = {
  /** Omit to use home widget context; null or 0 shows empty state */
  day?: number | null;
  cycleLength?: number;
  emptyHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function CycleDayCard({
  day: dayProp,
  cycleLength: lengthProp,
  emptyHint = 'Log your period to start tracking',
  style,
}: CycleDayCardProps = {}) {
  const ctx = useHomeWidgetContext();
  const resolvedDay = dayProp !== undefined ? dayProp : ctx.cycleDay;
  const cycleLength = lengthProp ?? ctx.cycleLength ?? DEFAULT_CYCLE_LENGTH;
  const cycleDay = resolvedDay ?? 0;
  const hasDay = cycleDay > 0;
  const filled = cycleFilledDotCount(cycleDay, cycleLength);
  const phase = cyclePhaseForDay(cycleDay);

  return (
    <View style={[widgetCard.card, style]}>
      <View style={styles.inner}>
        <View style={styles.deco} pointerEvents="none">
          <Svg width="100%" height={100} viewBox="0 0 200 100" preserveAspectRatio="none">
            <Path
              d="M 120 95 C 155 70 185 40 195 10"
              stroke="rgba(39, 53, 158, 0.12)"
              strokeWidth={1.5}
              fill="none"
            />
            <Path
              d="M 130 98 C 165 75 190 48 198 22"
              stroke="rgba(39, 53, 158, 0.08)"
              strokeWidth={1}
              fill="none"
            />
          </Svg>
        </View>

        <View style={styles.topRow}>
          <Text style={widgetCard.label}>CYCLE DAY</Text>
          {hasDay ? (
            <View style={styles.phaseBadge}>
              <View style={styles.phaseDot} />
              <Text style={styles.phaseText}>{phase}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.mainRow}>
          <Text style={styles.dayValue}>{hasDay ? String(cycleDay) : '—'}</Text>
          {hasDay ? (
            <View style={styles.dotsRow}>
              {Array.from({ length: CYCLE_DOT_COUNT }, (_, i) => {
                const active = i < filled;
                return (
                  <View
                    key={i}
                    style={[styles.dot, active ? styles.dotFilled : styles.dotEmpty]}
                  />
                );
              })}
            </View>
          ) : null}
        </View>

        {!hasDay && emptyHint ? (
          <Text style={styles.emptyHint}>{emptyHint}</Text>
        ) : null}
      </View>
    </View>
  );
}

/** Home widget registry entry */
export function CycleCounterWidget() {
  return <CycleDayCard />;
}

const styles = StyleSheet.create({
  inner: {
    padding: 18,
    minHeight: 112,
    overflow: 'hidden',
  },
  deco: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '55%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    zIndex: 1,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CYCLE_ACCENT,
  },
  phaseText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: homeMist.textMuted,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 1,
  },
  dayValue: {
    fontSize: 60,
    fontFamily: fonts.extraLight,
    color: homeMist.textPrimary,
    lineHeight: 64,
    minWidth: 56,
    letterSpacing: -1,
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotFilled: {
    backgroundColor: CYCLE_ACCENT,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(39, 53, 158, 0.35)',
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: homeMist.textMuted,
    marginTop: 8,
    zIndex: 1,
  },
});
