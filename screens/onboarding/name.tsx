import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { OnboardingTypography } from '@/components/onboarding/OnboardingTypography';
import { PillButton } from '@/components/onboarding/PillButton';
import { PillTextInput } from '@/components/onboarding/PillTextInput';
import { routes } from '@/constants/routes';
import { spacing } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function NameScreen() {
  const displayName = useUserStore((s) => s.displayName);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const [name, setName] = useState(displayName);

  const trimmed = name.trim();
  const canContinue = trimmed.length > 0;

  const handleContinue = () => {
    setDisplayName(trimmed);
    router.push(routes.role);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <OnboardingScreen
        showBack
        scrollable
        footer={
          <PillButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
          />
        }
      >
        <View style={styles.body}>
          <OnboardingTypography variant="headlineName">
            What should we call you?
          </OnboardingTypography>
          <PillTextInput
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={canContinue ? handleContinue : undefined}
          />
        </View>
      </OnboardingScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
