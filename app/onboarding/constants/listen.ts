export type ListenVariant = 'carrying' | 'non-carrying';

export const LISTEN_COPY: Record<
  ListenVariant,
  { paragraphs: [string, string]; cta: string }
> = {
  carrying: {
    paragraphs: [
      "This journey can be layered and at times, overwhelming — whether you're just beginning or have been here a while.",
      "Lighthouse is here to be a steady light you can return to. For gentle guidance, tracking, and the reminder that you don't have to carry this alone.",
    ],
    cta: 'Continue',
  },
  'non-carrying': {
    paragraphs: [
      "Supporting someone you love through this journey is its own kind of special. You may not always know what to say, and that's okay.",
      'Lighthouse is here to help you show up with understanding, presence, and a quiet light to guide you both forward.',
    ],
    cta: 'Continue',
  },
};

export function listenRouteForRole(
  role: 'carrying' | 'non-carrying' | 'both' | null,
): '/onboarding/listen-carrying' | '/onboarding/listen-non-carrying' {
  if (role === 'carrying') return '/onboarding/listen-carrying';
  return '/onboarding/listen-non-carrying';
}
