import { router } from 'expo-router';
import { useState } from 'react';

import {
  BIOLOGICAL_SEX_OPTIONS,
  formatBiologicalSex,
} from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { useUserStore, type BiologicalSex } from '@/store/useUserStore';

export default function PartnerSexScreen() {
  const stored = useUserStore((s) => s.partnerBiologicalSex);
  const setPartnerBiologicalSex = useUserStore((s) => s.setPartnerBiologicalSex);
  const initial =
    stored && stored !== 'no partner' ? (stored as BiologicalSex) : null;
  const [selected, setSelected] = useState<BiologicalSex | null>(initial);

  return (
    <OnboardingShell
      headline={"What is your\npartner's biological sex?"}
      progress={{ current: 5 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => {
        if (selected) setPartnerBiologicalSex(selected);
        router.push('/onboarding/partner-name');
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
