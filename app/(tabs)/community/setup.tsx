import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COMMUNITY_SURFACE } from '@/constants/community';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts } from '@/constants/theme';
import {
  communityUsernameError,
  isValidCommunityUsername,
} from '@/lib/communityUsername';
import {
  createCommunityProfile,
  getCommunityUserId,
  isUsernameTaken,
} from '@/lib/community';
import { noFocusRing } from '@/lib/focusRing';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

export default function CommunitySetupScreen() {
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const completeCommunitySetup = useUserStore((s) => s.completeCommunitySetup);
  const hasSetUpCommunity = useUserStore((s) => s.hasSetUpCommunity);

  const [username, setUsername] = useState('');
  const [focused, setFocused] = useState(false);
  const [takenError, setTakenError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
      if (hasSetUpCommunity) {
        router.replace(routes.community);
      }
      return () => setTabBarHidden(false);
    }, [hasSetUpCommunity, setTabBarHidden]),
  );

  const validationError = communityUsernameError(username);
  const valid = isValidCommunityUsername(username);

  const handleEnter = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setTakenError(null);

    const trimmed = username.trim();
    const taken = await isUsernameTaken(trimmed);
    if (taken) {
      setTakenError('This username is taken — try another');
      setSubmitting(false);
      return;
    }

    const userId = getCommunityUserId();
    const { error } = await createCommunityProfile(userId, trimmed);
    if (error) {
      setTakenError(error.message);
      setSubmitting(false);
      return;
    }

    completeCommunitySetup(trimmed);
    setSubmitting(false);
    router.replace(routes.community);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.center}>
            <Text style={styles.wordmark}>LIGHTHOUSE COMMUNITY</Text>

            <Text style={styles.headline}>Before you enter</Text>

            <Text style={styles.body}>
              We ask that you create a username before entering our community forum.
              You don't have to post — you're welcome to simply read and find comfort
              in knowing others are on similar journeys.
            </Text>
            <Text style={styles.body}>
              Your username protects your privacy and helps us maintain a safe,
              respectful space for everyone here. It is not connected to your real name
              or any identifying information.
            </Text>

            <View style={styles.guidelinesShell}>
              {Platform.OS === 'web' ? (
                <View style={[StyleSheet.absoluteFill, styles.guidelinesFallback]} />
              ) : (
                <BlurView
                  blurType="light"
                  blurAmount={16}
                  style={StyleSheet.absoluteFill}
                  reducedTransparencyFallbackColor="rgba(255,255,255,0.55)"
                />
              )}
              <Text style={styles.guidelines}>
                By entering, you agree to keep this space kind, honest, and safe. No
                medical advice, no judgment, no sharing others' stories outside this
                community.
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Choose your username</Text>
              <TextInput
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  setTakenError(null);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. hopeful_journey, quiet_star"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                style={[styles.input, focused && styles.inputFocused]}
              />
              {validationError ? (
                <Text style={styles.error}>{validationError}</Text>
              ) : takenError ? (
                <Text style={styles.error}>{takenError}</Text>
              ) : valid ? (
                <View style={styles.validRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.loggedDot} />
                  <Text style={styles.validText}>Username looks good</Text>
                </View>
              ) : null}

              <Pressable
                onPress={() => void handleEnter()}
                disabled={!valid || submitting}
                style={[
                  styles.enterBtn,
                  (!valid || submitting) && styles.enterBtnDisabled,
                  noFocusRing,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.enterLabel}>Enter the community</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COMMUNITY_SURFACE,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  wordmark: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 4,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 36,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  guidelinesShell: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
    marginTop: 8,
    padding: 16,
  },
  guidelinesFallback: {
    backgroundColor: colors.cardUnselectedBg,
  },
  guidelines: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  inputSection: {
    marginTop: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 54,
    paddingHorizontal: 24,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  inputFocused: {
    borderColor: colors.inputBorderFocused,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.accentRose,
    marginTop: 8,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  validText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.loggedDot,
  },
  enterBtn: {
    marginTop: 24,
    backgroundColor: colors.buttonPrimaryBg,
    borderRadius: 100,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  enterBtnDisabled: {
    opacity: 0.35,
  },
  enterLabel: {
    fontSize: fontSizes.body,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});
