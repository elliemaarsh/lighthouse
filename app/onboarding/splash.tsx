import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { onboardingTheme } from '@/app/onboarding/theme';
import { fonts } from '@/constants/theme';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(Text);

const SPLASH_MS = 3200;
const EASE_IN_OUT = Easing.inOut(Easing.ease);
const EASE_OUT = Easing.out(Easing.ease);

/** Once per app session — splash does not replay on back navigation */
let hasPlayedSplashSession = false;

function topArcPath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
}

const ARCS = [
  { rx: 140, ry: 50, target: 0.5 },
  { rx: 175, ry: 65, target: 0.35 },
  { rx: 215, ry: 82, target: 0.2 },
  { rx: 260, ry: 100, target: 0.1 },
] as const;

export default function SplashScreen() {
  const { width, height } = Dimensions.get('window');
  const cx = width * 0.5;
  const cy = height * 0.62;
  const skipped = useRef(hasPlayedSplashSession);

  const ellipseOpacity = useRef(new Animated.Value(0)).current;
  const arcOpacities = useRef(ARCS.map(() => new Animated.Value(0))).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasPlayedSplashSession || skipped.current) {
      router.replace('/onboarding/welcome');
      return;
    }
    hasPlayedSplashSession = true;

    const arcTimings = [
      { delay: 600, duration: 800 },
      { delay: 900, duration: 800 },
      { delay: 1200, duration: 800 },
      { delay: 1500, duration: 700 },
    ];

    Animated.sequence([
      Animated.parallel([
        Animated.timing(ellipseOpacity, {
          toValue: 1,
          duration: 800,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        ...arcOpacities.map((anim, i) =>
          Animated.timing(anim, {
            toValue: ARCS[i].target,
            duration: arcTimings[i].duration,
            delay: arcTimings[i].delay,
            easing: EASE_OUT,
            useNativeDriver: true,
          }),
        ),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: 500,
          delay: 2200,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(contentFade, {
        toValue: 0,
        duration: 300,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        router.replace('/onboarding/welcome');
      }
    });
  }, [
    arcOpacities,
    contentFade,
    ellipseOpacity,
    skipped,
    wordmarkOpacity,
  ]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.View style={[styles.content, { opacity: contentFade }]}>
        <View style={styles.svgStage} pointerEvents="none">
          <Svg width={width} height={height} style={styles.svg}>
            <AnimatedEllipse
              cx={cx}
              cy={cy}
              rx={120}
              ry={40}
              stroke="rgba(26, 36, 34, 0.12)"
              strokeWidth={20}
              fill="none"
              opacity={ellipseOpacity}
            />
            <AnimatedEllipse
              cx={cx}
              cy={cy}
              rx={120}
              ry={40}
              stroke={onboardingTheme.textPrimary}
              strokeWidth={2.5}
              fill="none"
              opacity={ellipseOpacity}
            />
            {ARCS.map((arc, i) => (
              <AnimatedPath
                key={arc.rx}
                d={topArcPath(cx, cy, arc.rx, arc.ry)}
                stroke="white"
                strokeWidth={1}
                fill="none"
                opacity={arcOpacities[i]}
              />
            ))}
          </Svg>
        </View>

        <AnimatedText
          style={[
            styles.wordmark,
            {
              top: cy + 56,
              opacity: wordmarkOpacity,
            },
          ]}
        >
          LIGHTHOUSE
        </AnimatedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: onboardingTheme.background,
  },
  content: {
    flex: 1,
  },
  svgStage: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wordmark: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 6,
    color: onboardingTheme.textMuted,
    textTransform: 'uppercase',
  },
});
