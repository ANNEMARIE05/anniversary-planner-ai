import { Redirect, Tabs } from 'expo-router';

import { BarreOnglets } from '@/components/ui/barre-onglets';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user);
  const onboardingDone = useAnniversaireStore((s) => s.onboardingDone);

  if (!user) return <Redirect href="/connexion" />;
  if (!onboardingDone) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <BarreOnglets {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="calendrier" options={{ title: 'Dates' }} />
      <Tabs.Screen name="personnes" options={{ title: 'Proches' }} />
      <Tabs.Screen name="assistant" options={{ title: 'Vœux' }} />
      <Tabs.Screen name="reseau" options={{ title: 'Réseau' }} />
      <Tabs.Screen name="parametres" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
