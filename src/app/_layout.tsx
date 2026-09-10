import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { AnimatedSplash } from '@/components/animated-splash';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.error,
    strict: false,
  });
}

export default function RootLayout() {
  const hydrated = useAnniversaireStore((s) => s.hydrated);
  const setHydrated = useAnniversaireStore((s) => s.setHydrated);
  const [authReady, setAuthReady] = useState(() => useAuthStore.persist.hasHydrated());
  const [splashDone, setSplashDone] = useState(false);

  const ready = hydrated && authReady;

  useEffect(() => {
    const unsubApp = useAnniversaireStore.persist.onFinishHydration(() => setHydrated(true));
    const unsubAuth = useAuthStore.persist.onFinishHydration(() => setAuthReady(true));
    if (useAnniversaireStore.persist.hasHydrated()) setHydrated(true);
    if (useAuthStore.persist.hasHydrated()) setAuthReady(true);
    const t = setTimeout(() => {
      setHydrated(true);
      setAuthReady(true);
    }, 800);
    return () => {
      unsubApp?.();
      unsubAuth?.();
      clearTimeout(t);
    };
  }, [setHydrated]);

  // Le splash natif reste visible jusqu’à onLayout de AnimatedSplash (logo déjà peint).

  const onSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.light.background },
          animation: 'fade_from_bottom',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="connexion" options={{ animation: 'fade' }} />
        <Stack.Screen name="inscription" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ajouter" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="personne/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="message/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>

      {!splashDone ? <AnimatedSplash ready={ready} onFinish={onSplashFinish} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
});
