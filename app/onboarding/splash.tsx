import { Redirect } from 'expo-router';

/** Legacy route — initial onboarding is the welcome screen */
export default function SplashRedirect() {
  return <Redirect href="/onboarding/welcome" />;
}
