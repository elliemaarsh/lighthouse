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

import { colors, fontSizes, fonts, textContrast, typography } from '@/constants/theme';

const TICK_WIDTH = 11;
const TICK_HEIGHT = 44;

type DialRulerPickerProps = {
  value: number | null;
  values: number[];
  onChange: (value: number) => void;
  unitLabel: string;
  formatValue?: (value: number) => string;
  defaultValue?: number;
  disabled?: boolean;
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

export function DialRulerPicker({
  value,
  values,
  onChange,
  unitLabel,
  formatValue = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1)),
  defaultValue,
  disabled = false,
}: DialRulerPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const sidePad = screenWidth / 2 - TICK_WIDTH / 2;
  const fallback = defaultValue ?? values[Math.floor(values.length / 2)] ?? values[0];
  const display = value ?? fallback;

  const scrollToValue = useCallback(
    (target: number, animated: boolean) => {
      const idx = nearestIndex(values, target);
      scrollRef.current?.scrollTo({
        x: idx * TICK_WIDTH,
        animated,
      });
    },
    [values],
  );

  useEffect(() => {
    scrollToValue(display, false);
  }, [display, scrollToValue]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled) return;
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.min(values.length - 1, Math.max(0, Math.round(x / TICK_WIDTH)));
    onChange(values[idx]);
  };

  const majorEvery = useMemo(() => Math.max(1, Math.floor(values.length / 12)), [values.length]);

  return (
    <View style={[styles.wrap, disabled && styles.wrapDisabled]} pointerEvents={disabled ? 'none' : 'auto'}>
      <Text style={styles.value}>{formatValue(display)}</Text>
      <Text style={styles.unitLabel}>{unitLabel}</Text>

      <View style={styles.rulerOuter}>
        <View style={styles.centerTick} />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_WIDTH}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: sidePad }}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
        >
          {values.map((v, i) => {
            const isMajor = i % majorEvery === 0;
            return (
              <View key={`${v}-${i}`} style={styles.tickSlot}>
                <View style={[styles.tick, isMajor && styles.tickMajor]} />
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
    color: colors.textPrimary,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    ...textContrast,
  },
  unitLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 28,
    letterSpacing: 0.5,
    ...textContrast,
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
    backgroundColor: colors.accentLime,
    borderRadius: 1,
    zIndex: 2,
  },
  tickSlot: {
    width: TICK_WIDTH,
    height: TICK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tick: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 1,
  },
  tickMajor: {
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
});
