import { router } from 'expo-router';
import { useState } from 'react';

import {
  BIOLOGICAL_SEX_OPTIONS,
  formatBiologicalSex,
} from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { useUserStore, type BiologicalSex } from '@/store/useUserStore';

export default function BiologicalSexScreen() {
  const stored = useUserStore((s) => s.biologicalSex);
  const setBiologicalSex = useUserStore((s) => s.setBiologicalSex);
  const [selected, setSelected] = useState<BiologicalSex | null>(stored);

  return (
    <OnboardingShell
      headline={'What is your\nbiological sex?'}
      subtext="This helps us show the right tracking features for you."
      progress={{ current: 3 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => {
        if (selected) setBiologicalSex(selected);
        router.push('/onboarding/relationship');
      }}
    >
      {BIOLOGICAL_SEX_OPTIONS.map((option) => (
        <OnboardingGlassCard
          key={option}
          title={formatBiologicalSex(option)}
          selected={selected === option}
          onPress={() => setSelected(option)}
        />
      ))}
    </OnboardingShell>
  );
}
