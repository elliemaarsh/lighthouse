import type { Href } from 'expo-router';

/** Onboarding routes live at the root stack so navigation works on web + native. */
export const routes = {
  home: '/(tabs)' as Href,
  welcome: '/onboarding' as Href,
  name: '/name' as Href,
  role: '/role' as Href,
  journey: '/journey' as Href,
  partner: '/partner' as Href,
  track: '/(tabs)/track' as Href,
  checkinStep1: '/(tabs)/track/checkin/step1' as Href,
  checkinStep2: '/(tabs)/track/checkin/step2' as Href,
  checkinStep3: '/(tabs)/track/checkin/step3' as Href,
  /** Notes step (file: step5.tsx — legacy filename) */
  checkinStep4Notes: '/(tabs)/track/checkin/step5' as Href,
  checkinComplete: '/(tabs)/track/checkin/complete' as Href,
  connect: '/(tabs)/connect' as Href,
  connectPulseCheck: '/(tabs)/connect/pulse-check' as Href,
  connectPulsePreview: '/(tabs)/connect/pulse-preview' as Href,
  connectTreatment: '/(tabs)/connect/treatment' as Href,
  learn: '/(tabs)/learn' as Href,
  learnArticle: '/(tabs)/learn/article' as Href,
  trackExport: '/(tabs)/track/export' as Href,
  settings: '/settings' as Href,
} as const;
