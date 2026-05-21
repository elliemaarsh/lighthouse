import type { PulseCheckDraft } from '@/types/pulseCheck';

let draft: PulseCheckDraft | null = null;

export const pulseDraftSession = {
  get: () => draft,
  set: (value: PulseCheckDraft) => {
    draft = value;
  },
  clear: () => {
    draft = null;
  },
};
