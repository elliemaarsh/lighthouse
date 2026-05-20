import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { OnboardingTypography } from '@/components/onboarding/OnboardingTypography';
import { PillButton } from '@/components/onboarding/PillButton';
import { PillTextInput } from '@/components/onboarding/PillTextInput';
import { routes } from '@/constants/routes';
import { spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function PartnerInviteScreen() {
  const partnerEmail = useUserStore((s) => s.partnerEmail);
  const setPartnerEmail = useUserStore((s) => s.setPartnerEmail);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [email, setEmail] = useState(partnerEmail);

  const finishOnboarding = (sentInvite: boolean) => {
    if (sentInvite && email.trim()) {
      setPartnerEmail(email.trim());
      // TODO: Send partner invite via Supabase when backend is wired
    }
    completeOnboarding();
    router.replace(routes.home);
  };

  return (
    <OnboardingScreen showBack scrollable>
      <View style={styles.body}>
        <OnboardingTypography variant="headlineRole">
          Invite your partner
        </OnboardingTypography>
        <OnboardingTypography variant="subtext" style={styles.subtext}>
          Send them a link to connect your accounts. You can always do this later.
        </OnboardingTypography>
        <PillTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Partner's email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <View style={styles.actions}>
          <PillButton
            label="Send Invite"
            onPress={() => finishOnboarding(true)}
          />
          <PillButton
            label="Skip for now"
            variant="ghost"
            onPress={() => finishOnboarding(false)}
          />
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingBottom: spacing.footer,
  },
  subtext: {
    marginTop: 0,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.lg,
  },
  actions: {
    gap: 12,
  },
});
