import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { Colors } from '@/constants/theme';

const LOGO = require('../../assets/images/logo.png');

/** Durée minimale d’affichage du logo (ms), une fois l’image chargée. */
const MIN_VISIBLE_MS = 2200;

type Props = {
  ready: boolean;
  onFinish: () => void;
};

export function AnimatedSplash({ ready, onFinish }: Props) {
  const imageReady = useRef(false);
  const nativeHidden = useRef(false);
  const finished = useRef(false);
  const shownAt = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tryFinish = () => {
    if (finished.current || !ready || !imageReady.current || shownAt.current == null) return;
    if (timer.current) clearTimeout(timer.current);
    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    timer.current = setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      onFinish();
    }, wait);
  };

  const hideNative = () => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    void SplashScreen.hideAsync();
  };

  const markImageReady = () => {
    if (imageReady.current) return;
    imageReady.current = true;
    shownAt.current = Date.now();
    hideNative();
    tryFinish();
  };

  useEffect(() => {
    tryFinish();
  }, [ready]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Filet de sécurité : ne jamais rester bloqué sur le splash natif.
  useEffect(() => {
    const t = setTimeout(() => {
      markImageReady();
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.center}>
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Anniversary Planner AI"
          onLoad={markImageReady}
          onError={markImageReady}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.background,
    zIndex: 999,
    elevation: 999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    width: 300,
    height: 300,
  },
});
