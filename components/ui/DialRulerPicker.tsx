import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, fontSizes, fonts, typography } from '@/constants/theme';

const TICK_WIDTH_DENSE = 11;
const TICK_HEIGHT = 44;
const DISCRETE_MAX_VALUES = 7;

type DialRulerPickerProps = {
  value: number | null;
  values: number[];
  onChange: (value: number) => void;
  unitLabel: string;
  formatValue?: (value: number) => string;
  defaultValue?: number;
  disabled?: boolean;
  /** Shown in the large value slot when `value` is null */
  placeholderDisplay?: string;
  /** @deprecated Both palettes use the flat light-blue surface */
  palette?: 'gradient' | 'mist';
};

function nearestIndex(values: number[], target: number): number {
  let best = 0;
  let bestDiff = Infinity;
  values.forEach((v, i) => {
    const diff = Math.abs(v - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

function tickWidthForCount(count: number, screenWidth: number): number {
  if (count > DISCRETE_MAX_VALUES) return TICK_WIDTH_DENSE;
  const usable = Math.max(screenWidth - 64, 200);
  return Math.min(64, Math.max(48, usable / Math.max(count - 1, 1)));
}

export function DialRulerPicker({
  value,
  values,
  onChange,
  unitLabel,
  formatValue = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1)),
  defaultValue,
  disabled = false,
  placeholderDisplay,
  palette: _palette = 'gradient',
}: DialRulerPickerProps) {
  const paletteColors = {
    value: colors.textPrimary,
    muted: colors.textMuted,
    accent: colors.textPrimary,
    tick: 'rgba(26, 36, 34, 0.2)',
    tickMajor: 'rgba(26, 36, 34, 0.38)',
  };
  const scrollRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const tickWidth = tickWidthForCount(values.length, screenWidth);
  const isDiscrete = values.length <= DISCRETE_MAX_VALUES;
  const sidePad = screenWidth / 2 - tickWidth / 2;
  const fallback = defaultValue ?? values[Math.floor(values.length / 2)] ?? values[0];
  const display = value ?? fallback;

  const snapOffsets = useMemo(
    () => values.map((_, i) => i * tickWidth),
    [values.length, tickWidth],
  );

  const scrollToValue = useCallback(
    (target: number, animated: boolean) => {
      const idx = nearestIndex(values, target);
      scrollRef.current?.scrollTo({
        x: idx * tickWidth,
        animated,
      });
    },
    [values, tickWidth],
  );

  useEffect(() => {
    scrollToValue(display, false);
  }, [display, scrollToValue]);

  const indexFromOffset = (x: number) =>
    Math.min(values.length - 1, Math.max(0, Math.round(x / tickWidth)));

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled) return;
    const idx = indexFromOffset(e.nativeEvent.contentOffset.x);
    onChange(values[idx]);
    scrollRef.current?.scrollTo({ x: idx * tickWidth, animated: true });
  };

  const majorEvery = isDiscrete ? 1 : Math.max(1, Math.floor(values.length / 12));

  const valueText =
    value == null && placeholderDisplay != null
      ? placeholderDisplay
      : formatValue(display);

  return (
    <View style={[styles.wrap, disabled && styles.wrapDisabled]} pointerEvents={disabled ? 'none' : 'auto'}>
      <Text
        style={[
          styles.value,
          { color: paletteColors.value },
          value == null && placeholderDisplay != null && styles.valuePlaceholder,
        ]}
      >
        {valueText}
      </Text>
      <Text
        style={[
          styles.unitLabel,
          { color: paletteColors.muted },
        ]}
      >
        {unitLabel}
      </Text>

      <View style={styles.rulerOuter}>
        <View
          style={[styles.centerTick, { backgroundColor: paletteColors.accent }]}
        />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToOffsets={isDiscrete ? snapOffsets : undefined}
          snapToInterval={isDiscrete ? undefined : tickWidth}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: sidePad }}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
        >
          {values.map((v, i) => {
            const isMajor = i % majorEvery === 0;
            return (
              <View key={`${v}-${i}`} style={[styles.tickSlot, { width: tickWidth }]}>
                <View
                  style={[
                    styles.tick,
                    { backgroundColor: paletteColors.tick },
                    isMajor && { backgroundColor: paletteColors.tickMajor, height: 22 },
                  ]}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  wrapDisabled: {
    opacity: 0.4,
  },
  value: {
    fontSize: 72,
    fontFamily: typography.display.fontFamily,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  valuePlaceholder: {
    fontSize: 56,
    opacity: 0.45,
    letterSpacing: 2,
  },
  unitLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    marginTop: 4,
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  rulerOuter: {
    width: '100%',
    height: TICK_HEIGHT + 8,
    justifyContent: 'flex-end',
  },
  centerTick: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: 2,
    height: 36,
    borderRadius: 1,
    zIndex: 2,
  },
  tickSlot: {
    height: TICK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tick: {
    width: 1,
    height: 14,
    borderRadius: 1,
  },
});
