import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingGlassPillButton } from '@/app/onboarding/components/OnboardingGlassPillButton';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { saveUserProfileToSupabase } from '@/app/onboarding/lib/saveUserProfile';
import { onboardingTheme } from '@/app/onboarding/theme';
import { inputFieldStyle } from '@/constants/surfaces';
import { fontSizes, fonts } from '@/constants/theme';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { useUserStore } from '@/store/useUserStore';

function finishOnboarding() {
  const { completeOnboarding } = useUserStore.getState();
  completeOnboarding();
  router.replace('/(tabs)');
}

export default function InviteScreen() {
  const storedEmail = useUserStore((s) => s.partnerEmail);
  const partnerName = useUserStore((s) => s.partnerName);
  const setPartnerEmail = useUserStore((s) => s.setPartnerEmail);
  const setPartnerLinked = useUserStore((s) => s.setPartnerLinked);
  const partnerLabel = partnerFirstName(partnerName, storedEmail);
  const [email, setEmail] = useState(storedEmail);
  const [saving, setSaving] = useState(false);

  const handleSend = async () => {
    if (saving) return;
    setSaving(true);
    const trimmed = email.trim();
    if (trimmed) {
      setPartnerEmail(trimmed);
      setPartnerLinked(true);
    }
    await saveUserProfileToSupabase();
    setSaving(false);
    finishOnboarding();
  };

  const handleSkip = async () => {
    if (saving) return;
    setSaving(true);
    await saveUserProfileToSupabase();
    setSaving(false);
    finishOnboarding();
  };

  return (
    <OnboardingShell
      headline={
        partnerLabel === 'your partner'
          ? 'Invite your\npartner'
          : `Invite ${partnerLabel}`
      }
      subtext="Connect your accounts to share updates, appointments, and support each other."
      showBack
      onBack={() => router.back()}
      showSkip
      skipLabel="Skip for now"
      onSkip={() => void handleSkip()}
      scrollable
    >
      <View style={styles.inputWrap}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="partner@email.com"
          placeholderTextColor={onboardingTheme.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.sendWrap}>
        <OnboardingGlassPillButton
          label={saving ? 'Saving…' : 'Send Invite'}
          onPress={() => void handleSend()}
          disabled={saving || !email.trim()}
          tone="dark"
        />
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    marginTop: 8,
  },
  input: {
    ...inputFieldStyle,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
  },
  sendWrap: {
    marginTop: 28,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
});
