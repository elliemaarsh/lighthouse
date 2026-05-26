import { router } from 'expo-router';
import { useState } from 'react';

import { RELATIONSHIP_OPTIONS, SOLO_JOURNEY_LABEL } from '@/app/onboarding/constants';
import { OnboardingGlassCard } from '@/app/onboarding/components/OnboardingGlassCard';
import { OnboardingOptionList } from '@/app/onboarding/components/OnboardingOptionList';
import { OnboardingShell } from '@/app/onboarding/components/OnboardingShell';
import { useUserStore } from '@/store/useUserStore';

export default function RelationshipScreen() {
  const stored = useUserStore((s) => s.relationshipStructure);
  const setRelationshipStructure = useUserStore((s) => s.setRelationshipStructure);
  const setPartnerBiologicalSex = useUserStore((s) => s.setPartnerBiologicalSex);
  const [selected, setSelected] = useState<string | null>(stored);

  return (
    <OnboardingShell
      headline={'Tell us about\nyour relationship'}
      progress={{ current: 4 }}
      showBack
      onBack={() => router.back()}
      continueDisabled={false}
      onContinue={() => {
        if (selected) {
          setRelationshipStructure(selected);
          if (selected === SOLO_JOURNEY_LABEL) {
            setPartnerBiologicalSex('no partner');
            router.push('/onboarding/role');
            return;
          }
        }
        router.push('/onboarding/partner-sex');
      }}
    >
      <OnboardingOptionList>
        {RELATIONSHIP_OPTIONS.map((option) => (
          <OnboardingGlassCard
            key={option.title}
            title={option.title}
            subtext={option.subtext}
            selected={selected === option.title}
            onPress={() => setSelected(option.title)}
          />
        ))}
      </OnboardingOptionList>
    </OnboardingShell>
  );
}
