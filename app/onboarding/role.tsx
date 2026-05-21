import { router } from 'expo-router';
import { useState } from 'react';

import { ROLE_OPTIONS } from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { useUserStore, type UserRole } from '@/store/useUserStore';

export default function RoleScreen() {
  const stored = useUserStore((s) => s.role);
  const setRole = useUserStore((s) => s.setRole);
  const [selected, setSelected] = useState<UserRole | null>(stored);

  return (
    <OnboardingShell
      headline={"What's your role\nin this journey?"}
      subtext="This shapes what you track and see."
      progress={{ current: 7, total: 11 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={!selected}
      onContinue={() => {
        if (selected) setRole(selected);
        router.push('/onboarding/goals');
      }}
    >
      {ROLE_OPTIONS.map((option) => (
        <OnboardingGlassCard
          key={option.value}
          title={option.title}
          subtext={option.subtext}
          selected={selected === option.value}
          accentBorderColor={selected === option.value ? option.accent : undefined}
          onPress={() => setSelected(option.value)}
        />
      ))}
    </OnboardingShell>
  );
}
