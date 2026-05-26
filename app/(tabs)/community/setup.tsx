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

import { PillButton } from '@/components/onboarding/PillButton';
import { COMMUNITY_SURFACE } from '@/constants/community';
import { routes } from '@/constants/routes';
import { inputFieldStyle } from '@/constants/surfaces';
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
import { hrefForTab, useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

const USERNAME_VALID_COLOR = '#3A8F6E';

export default function CommunitySetupScreen() {
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const lastTab = useTabBarStore((s) => s.lastTab);
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.navigate(hrefForTab(lastTab));
  };

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
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={[styles.backBtn, noFocusRing]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.center}>
            <Text style={styles.wordmark}>LIGHTHOUSE COMMUNITY</Text>

            <Text style={styles.headline}>Before you enter</Text>

            <Text style={styles.body}>
              We ask that you create a username before entering our community forum.
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
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={USERNAME_VALID_COLOR}
                  />
                  <Text style={styles.validText}>Username looks good</Text>
                </View>
              ) : null}

              {submitting ? (
                <ActivityIndicator color="#27359E" style={styles.enterSpinner} />
              ) : (
                <PillButton
                  label="Enter the community"
                  tier={2}
                  onPress={() => void handleEnter()}
                  disabled={!valid || submitting}
                />
              )}
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
  backBtn: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
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
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  guidelinesShell: {
    alignSelf: 'stretch',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0,
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
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  input: {
    ...inputFieldStyle,
    alignSelf: 'stretch',
    borderRadius: 100,
    height: 54,
    paddingHorizontal: 24,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: inputFieldStyle.borderColor,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.accentRose,
    marginTop: 8,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  validText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: USERNAME_VALID_COLOR,
  },
  enterSpinner: {
    marginTop: 24,
    alignSelf: 'center',
  },
});
