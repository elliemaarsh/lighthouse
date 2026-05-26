import { DEFAULT_CYCLE_DAY, DEFAULT_CYCLE_LENGTH } from '@/lib/cycleDay';
import { useUserStore } from '@/store/useUserStore';

export function useHomeWidgetContext() {
  const role = useUserStore((s) => s.role);
  const name = useUserStore((s) => s.name || s.displayName);
  const partnerName = useUserStore((s) => s.partnerName);
  const journeyType = useUserStore((s) => s.journeyType);

  const isCarrying = role !== 'non-carrying';
  const isIvfJourney = journeyType.some((j) => /ivf|iui/i.test(j));
  const partnerLabel = partnerName?.trim() || 'your partner';

  return {
    role,
    name,
    partnerName: partnerLabel,
    isCarrying,
    isIvfJourney,
    cycleDay: DEFAULT_CYCLE_DAY,
    cycleLength: DEFAULT_CYCLE_LENGTH,
    temperature: 97.8,
    alignmentScore: isCarrying ? 4.3 : 4.7,
    heatLevel: 'medium' as const,
    ivfPhase: 'Stimulation',
    ivfDay: 6,
  };
}
