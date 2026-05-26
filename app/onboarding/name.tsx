import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { onboardingTheme } from '@/app/onboarding/theme';
import { inputFieldStyle } from '@/constants/surfaces';
import { fontSizes, fonts } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function NameScreen() {
  const stored = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const [name, setLocalName] = useState(stored);

  const trimmed = name.trim();
  const canContinue = trimmed.length > 0;

  return (
    <OnboardingShell
      headline={'What should we\ncall you?'}
      progress={{ current: 1 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={!canContinue}
      onContinue={() => {
        setName(trimmed);
        router.push('/onboarding/birth-date');
      }}
    >
      <View style={styles.inputWrap}>
        <TextInput
          value={name}
          onChangeText={setLocalName}
          placeholder="Your name"
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
    ...inputFieldStyle,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: onboardingTheme.textPrimary,
  },
});
