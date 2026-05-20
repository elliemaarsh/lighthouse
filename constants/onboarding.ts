import type { JourneyType } from '@/store/useUserStore';

export const JOURNEY_OPTIONS: { id: JourneyType; label: string }[] = [
  { id: 'trying-to-conceive', label: 'Trying to conceive' },
  { id: 'ivf', label: 'Going through IVF' },
  { id: 'pregnancy-loss', label: 'Navigating pregnancy loss' },
  { id: 'getting-started', label: 'Just getting started' },
];
