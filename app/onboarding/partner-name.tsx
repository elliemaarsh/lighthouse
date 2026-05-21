import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function PartnerNameScreen() {
  const stored = useUserStore((s) => s.partnerName);
  const setPartnerName = useUserStore((s) => s.setPartnerName);
  const [name, setLocalName] = useState(stored ?? '');

  const trimmed = name.trim();

  return (
    <OnboardingShell
      headline={"What's your\npartner's first name?"}
      subtext="We'll use this in Connect so messages feel personal."
      progress={{ current: 6, total: 11 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => {
        setPartnerName(trimmed || null);
        router.push('/onboarding/role');
      }}
    >
      <View style={styles.inputWrap}>
        <TextInput
          value={name}
          onChangeText={setLocalName}
          placeholder="Their first name"
          placeholderTextColor={onboardingTheme.textMuted}
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
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
    backgroundColor: onboardingTheme.inputBg,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
    borderWidth: 1,
    borderColor: onboardingTheme.cardBorder,
  },
});
