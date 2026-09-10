import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user);
  const onboardingDone = useAnniversaireStore((s) => s.onboardingDone);
  const scheme = useColorScheme();
  const themePref = useAnniversaireStore((s) => s.preferences.theme);

  if (!user) return <Redirect href="/connexion" />;
  if (!onboardingDone) return <Redirect href="/onboarding" />;

  const resolved =
    themePref === 'clair'
      ? 'light'
      : themePref === 'sombre'
        ? 'dark'
        : themePref === 'auto' && scheme === 'dark'
          ? 'dark'
          : 'light';
  const colors = Colors[resolved];

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      indicatorColor={colors.primarySoft}
      rippleColor={colors.primarySoft}
      tintColor={colors.primary}
      // Sans `default`, Android laisse les icônes inactives quasi invisibles (Material 3).
      iconColor={{
        default: colors.navMuted,
        selected: colors.primary,
      }}
      labelStyle={{
        default: { color: colors.navMuted },
        selected: { color: colors.primary },
      }}
      labelVisibilityMode="labeled"
      disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendrier">
        <NativeTabs.Trigger.Label>Calendrier</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'calendar', selected: 'calendar' }}
          md="event"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="personnes">
        <NativeTabs.Trigger.Label>Personnes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.2', selected: 'person.2.fill' }}
          md="group"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="assistant">
        <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bubble.left', selected: 'bubble.left.fill' }}
          md="chat_bubble_outline"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="parametres">
        <NativeTabs.Trigger.Label>Réglages</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'slider.horizontal.3', selected: 'slider.horizontal.3' }}
          md="tune"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
