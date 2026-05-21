import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingGlassPillButton } from '@/app/onboarding/components/OnboardingGlassPillButton';
import type { ListenVariant } from '@/app/onboarding/constants/listen';
import { LISTEN_COPY } from '@/app/onboarding/constants/listen';
import { AppGradientBackground } from '@/components/AppGradientBackground';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fonts } from '@/constants/theme';

const EASE_IN_OUT = Easing.inOut(Easing.ease);
const EASE_OUT = Easing.out(Easing.ease);

/** Text animation timings (ms) — slower than initial spec for a more deliberate reveal */
const TIMING = {
  listenIn: 900,
  listenRecessDelay: 1200,
  listenRecess: 350,
  bodyDelay: 1550,
  bodyIn: 1100,
  buttonDelay: 3600,
  buttonIn: 900,
  ctaReady: 4500,
} as const;

type ListenTransitionScreenProps = {
  variant: ListenVariant;
};

export function ListenTransitionScreen({ variant }: ListenTransitionScreenProps) {
  const copy = LISTEN_COPY[variant];

  const listenOpacity = useRef(new Animated.Value(0)).current;
  const listenScale = useRef(new Animated.Value(1)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyTranslate = useRef(new Animated.Value(12)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(listenOpacity, {
        toValue: 1,
        duration: TIMING.listenIn,
        easing: EASE_IN_OUT,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(TIMING.listenRecessDelay),
        Animated.parallel([
          Animated.timing(listenOpacity, {
            toValue: 0.18,
            duration: TIMING.listenRecess,
            easing: EASE_IN_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(listenScale, {
            toValue: 0.96,
            duration: TIMING.listenRecess,
            easing: EASE_IN_OUT,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(TIMING.bodyDelay),
        Animated.parallel([
          Animated.timing(bodyOpacity, {
            toValue: 1,
            duration: TIMING.bodyIn,
            easing: EASE_OUT,
            useNativeDriver: true,
          }),
          Animated.timing(bodyTranslate, {
            toValue: 0,
            duration: TIMING.bodyIn,
            easing: EASE_OUT,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(TIMING.buttonDelay),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: TIMING.buttonIn,
          easing: EASE_OUT,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const readyTimer = setTimeout(() => setCtaReady(true), TIMING.ctaReady);
    return () => clearTimeout(readyTimer);
  }, [bodyOpacity, bodyTranslate, buttonOpacity, listenOpacity, listenScale]);

  return (
    <AppGradientBackground style={styles.root}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Animated.Text
            style={[
              styles.listen,
              {
                opacity: listenOpacity,
                transform: [{ scale: listenScale }],
              },
            ]}
          >
            Listen.
          </Animated.Text>

          <Animated.View
            style={{
              opacity: bodyOpacity,
              transform: [{ translateY: bodyTranslate }],
            }}
          >
            <View style={styles.bodyBlock}>
              {copy.paragraphs.map((paragraph, index) => (
                <Text key={index} style={styles.body}>
                  {paragraph}
                </Text>
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.buttonWrap, { opacity: buttonOpacity }]}>
            <OnboardingGlassPillButton
              label={copy.cta}
              onPress={() => router.push('/onboarding/invite')}
              disabled={!ctaReady}
              tone="light"
              style={styles.button}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </AppGradientBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 28,
  },
  listen: {
    fontSize: 42,
    fontFamily: fonts.semiBold,
    color: onboardingTheme.textPrimary,
    textAlign: 'center',
  },
  bodyBlock: {
    gap: 20,
    maxWidth: 320,
    alignSelf: 'center',
  },
  body: {
    fontSize: 20,
    fontFamily: fonts.light,
    color: onboardingTheme.textSecondary,
    lineHeight: 32,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
  },
});
