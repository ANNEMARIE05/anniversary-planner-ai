import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const onboardingDone = useAnniversaireStore((s) => s.onboardingDone);

  if (!user) return <Redirect href="/connexion" />;
  if (!onboardingDone) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
