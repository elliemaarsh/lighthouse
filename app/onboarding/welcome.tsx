import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BeginHereSwipeSlider } from '@/app/onboarding/components/BeginHereSwipeSlider';
import { WelcomeGuideMark } from '@/app/onboarding/components/WelcomeGuideMark';
import { LighthouseLogo } from '@/components/brand/LighthouseLogo';
import { fonts, spacing } from '@/constants/theme';

const WELCOME_BG = require('@/assets/images/onboarding-welcome.png');

const welcomeAsset = Image.resolveAssetSource(WELCOME_BG);
/** Native width / height — used to center cover crop on the finger */
const WELCOME_ASPECT = welcomeAsset.width / welcomeAsset.height;

/** Pan within extra cover width — finger sits slightly left in the asset */
const FINGER_PAN_X = 0.14;
/** Nudge cover crop downward */
const PHOTO_SHIFT_Y = 0.028;


export default function OnboardingWelcomeScreen() {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const screenRatio = screenW / screenH;
  let photoW: number;
  let photoH: number;
  if (screenRatio > WELCOME_ASPECT) {
    photoW = screenW;
    photoH = photoW / WELCOME_ASPECT;
  } else {
    photoH = screenH;
    photoW = photoH * WELCOME_ASPECT;
  }

  // Slight scale-up so we can pan horizontally when the finger isn't dead-center in the file
  const minPhotoW = screenW * 1.06;
  if (photoW < minPhotoW) {
    const scale = minPhotoW / photoW;
    photoW = minPhotoW;
    photoH *= scale;
  }

  const bleedX = Math.max(0, photoW - screenW);
  const photoLeft = (screenW - photoW) / 2 + bleedX * FINGER_PAN_X;
  const photoTop = (screenH - photoH) / 2 + screenH * PHOTO_SHIFT_Y;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.photoClip}>
        <Image
          source={WELCOME_BG}
          style={{
            position: 'absolute',
            width: photoW,
            height: photoH,
            left: photoLeft,
            top: photoTop,
          }}
          resizeMode="cover"
        />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <LighthouseLogo color="#1A1A1A" iconSize={33} style={styles.logo} />

        <View style={styles.hero}>
          <WelcomeGuideMark />
          <Text style={styles.headline}>Light For The Uncertain Road</Text>
          <Text style={styles.subtext}>
            An app for couples navigating conception, fertility, and pregnancy loss.
          </Text>
        </View>

        <View style={styles.footer}>
          <BeginHereSwipeSlider />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A2422',
  },
  photoClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: -24,
  },
  headline: {
    fontFamily: fonts.extraLight,
    fontSize: 35,
    lineHeight: 42,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: spacing.md,
  },
  subtext: {
    fontFamily: fonts.light,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
