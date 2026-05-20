import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { OnboardingTypography } from '@/components/onboarding/OnboardingTypography';
import { PillButton } from '@/components/onboarding/PillButton';
import { RoleCard } from '@/components/onboarding/RoleCard';
import { routes } from '@/constants/routes';
import { spacing } from '@/constants/theme';
import { useUserStore, type UserRole } from '@/store/useUserStore';

export default function RoleScreen() {
  const role = useUserStore((s) => s.role);
  const setRole = useUserStore((s) => s.setRole);

  const handleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    router.push(routes.journey);
  };

  return (
    <OnboardingScreen
      showBack
      scrollable
      footer={
        <PillButton
          label="Continue"
          onPress={handleContinue}
          disabled={!role}
          variant="glass"
        />
      }
    >
      <View style={styles.body}>
        <OnboardingTypography variant="headlineRole">
          Which best describes you?
        </OnboardingTypography>
        <RoleCard
          title="I track my cycle"
          description="I log my period, symptoms, mood, and daily check-ins"
          selected={role === 'carrying'}
          onPress={() => handleSelect('carrying')}
        />
        <RoleCard
          title="I support my partner"
          description="My partner tracks their cycle — I follow along and stay informed"
          selected={role === 'non-carrying'}
          onPress={() => handleSelect('non-carrying')}
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
