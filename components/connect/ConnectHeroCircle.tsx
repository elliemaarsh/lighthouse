import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppBlurView } from '@/components/AppBlurView';
import { routes } from '@/constants/routes';
import { alignmentMessage } from '@/lib/pulseChecks';
import { colors, connectDashboard, fontSizes, fonts, homeMist, textContrast } from '@/constants/theme';

type ConnectHeroCircleProps = {
  state: 'prompt' | 'waiting' | 'aligned';
  alignmentScore?: number | null;
  partnerLabel?: string;
  onCheckInAgain?: () => void;
};

function ScoreDots({ score }: { score: number }) {
  const filled = Math.round(Math.max(1, Math.min(5, score)));
  return (
    <View style={styles.dotsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[styles.dot, n <= filled ? styles.dotFilled : styles.dotEmpty]}
        />
      ))}
    </View>
  );
}

const PROMPT_PULSE_MS = 2600;

export function ConnectHeroCircle({
  state,
  alignmentScore,
  partnerLabel = 'your partner',
  onCheckInAgain,
}: ConnectHeroCircleProps) {
  const waitDotPulse = useRef(new Animated.Value(1)).current;
  const promptPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'waiting') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(waitDotPulse, {
          toValue: 1.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waitDotPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, waitDotPulse]);

  useEffect(() => {
    if (state !== 'prompt') {
      promptPulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(promptPulse, {
          toValue: 1,
          duration: PROMPT_PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(promptPulse, {
          toValue: 0,
          duration: PROMPT_PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, promptPulse]);

  const glowStyle = {
    opacity: promptPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.22, 0.5],
    }),
    transform: [
      {
        scale: promptPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.07],
        }),
      },
    ],
  };

  const circlePulseStyle = {
    transform: [
      {
        scale: promptPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.018],
        }),
      },
    ],
  };

  const borderGlowStyle = {
    opacity: promptPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.85],
    }),
  };

  return (
    <View style={styles.heroWrap}>
      {state === 'prompt' ? (
        <>
          <Animated.View style={[styles.glowOuter, glowStyle]} pointerEvents="none" />
          <Animated.View style={[styles.glowMid, glowStyle]} pointerEvents="none" />
        </>
      ) : null}

      <Animated.View style={[styles.outer, state === 'prompt' && circlePulseStyle]}>
        <AppBlurView
          blurType="light"
          blurAmount={24}
          style={StyleSheet.absoluteFill}
          reducedTransparencyFallbackColor="#FFFFFF"
        />
        <Animated.View
          style={[styles.borderRing, state === 'prompt' && borderGlowStyle]}
        />
        <Svg width={280} height={280} style={styles.decorSvg} pointerEvents="none">
          <Circle
            cx={220}
            cy={58}
            r={36}
            stroke={connectDashboard.decoration}
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={248}
            cy={48}
            r={22}
            stroke={connectDashboard.decoration}
            strokeWidth={1}
            fill="none"
          />
        </Svg>

        <View style={styles.inner}>
          {state === 'prompt' ? (
            <>
              <Text style={styles.kicker}>WEEKLY PULSE</Text>
              <Text style={styles.question}>How are we{'\n'}doing?</Text>
              <Text style={styles.sub}>Takes 30 seconds</Text>
              <Pressable
                style={styles.darkBtn}
                onPress={() => router.push(routes.connectPulseCheck)}
              >
                <Text style={styles.darkBtnText}>Check in →</Text>
              </Pressable>
            </>
          ) : null}

          {state === 'waiting' ? (
            <>
              <Ionicons name="checkmark-circle" size={28} color={connectDashboard.sage} />
              <Text style={styles.waitTitle}>You've checked in</Text>
              <Text style={styles.sub}>Waiting for {partnerLabel} to answer…</Text>
              <Animated.View
                style={[styles.waitDot, { transform: [{ scale: waitDotPulse }] }]}
              />
            </>
          ) : null}

          {state === 'aligned' && alignmentScore != null ? (
            <>
              <Text style={styles.kicker}>ALIGNMENT</Text>
              <Text style={styles.score}>
                {alignmentScore}
                <Text style={styles.scoreOf}> / 5</Text>
              </Text>
              <ScoreDots score={alignmentScore} />
              <Text style={styles.alignMsg}>{alignmentMessage(alignmentScore)}</Text>
              {onCheckInAgain ? (
                <Pressable onPress={onCheckInAgain}>
                  <Text style={styles.ghostLink}>Check in again</Text>
                </Pressable>
              ) : null}
            </>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 308,
    height: 308,
    borderRadius: 154,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
  },
  glowMid: {
    position: 'absolute',
    width: 292,
    height: 292,
    borderRadius: 146,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  outer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: homeMist.cardBorder,
  },
  borderRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: homeMist.cardBorder,
  },
  decorSvg: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    zIndex: 2,
  },
  kicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: connectDashboard.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
    ...textContrast,
  },
  question: {
    fontSize: 26,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    ...textContrast,
  },
  sub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    textAlign: 'center',
    marginTop: 8,
    ...textContrast,
  },
  darkBtn: {
    marginTop: 16,
    backgroundColor: connectDashboard.buttonBg,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.cardSelectedBorder,
  },
  darkBtnText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: connectDashboard.buttonText,
  },
  waitTitle: {
    fontSize: fontSizes.body,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    ...textContrast,
  },
  waitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: connectDashboard.sage,
    marginTop: 14,
  },
  score: {
    fontSize: 52,
    fontFamily: fonts.light,
    color: connectDashboard.textPrimary,
    lineHeight: 56,
    ...textContrast,
  },
  scoreOf: {
    fontSize: 22,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: connectDashboard.textPrimary,
  },
  dotEmpty: {
    backgroundColor: homeMist.dotEmpty,
  },
  alignMsg: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    textAlign: 'center',
    maxWidth: 200,
    marginTop: 8,
    ...textContrast,
  },
  ghostLink: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: connectDashboard.textMuted,
    marginTop: 12,
  },
});
