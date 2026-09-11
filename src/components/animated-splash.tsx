import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  ReduceMotion,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { Colors, Spacing } from '@/constants/theme';

/** Durée minimale de la séquence chic (ms). */
const MIN_VISIBLE_MS = 2800;

type Props = {
  ready: boolean;
  onFinish: () => void;
};

export function AnimatedSplash({ ready, onFinish }: Props) {
  const finished = useRef(false);
  const nativeHidden = useRef(false);
  const startedAt = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const opacity = useSharedValue(0);
  const mascotScale = useSharedValue(0.72);
  const mascotY = useSharedValue(28);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(14);
  const veil = useSharedValue(0);
  const rootOpacity = useSharedValue(1);

  const hideNative = () => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    void SplashScreen.hideAsync();
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    rootOpacity.value = withTiming(
      0,
      { duration: 480, easing: Easing.out(Easing.cubic) },
      (done) => {
        if (done) runOnJS(onFinish)();
      },
    );
  };

  const scheduleFinish = () => {
    if (finished.current || !ready) return;
    if (timer.current) clearTimeout(timer.current);
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    timer.current = setTimeout(finish, wait);
  };

  useEffect(() => {
    hideNative();
    opacity.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
    mascotScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.Never,
    });
    mascotY.value = withTiming(0, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.Never,
    });
    titleOpacity.value = withDelay(
      380,
      withTiming(1, { duration: 560, easing: Easing.out(Easing.cubic) }),
    );
    titleY.value = withDelay(
      380,
      withTiming(0, { duration: 560, easing: Easing.out(Easing.cubic) }),
    );
    veil.value = withSequence(
      withTiming(0.18, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      withTiming(0.06, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
    );
  }, [mascotScale, mascotY, opacity, titleOpacity, titleY, veil]);

  useEffect(() => {
    scheduleFinish();
  }, [ready]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Filet de sécurité
  useEffect(() => {
    const t = setTimeout(() => {
      hideNative();
      if (!finished.current) finish();
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const rootAnim = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  const contentAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const mascotAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: mascotY.value }, { scale: mascotScale.value }],
  }));

  const titleAnim = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const shimmerAnim = useAnimatedStyle(() => ({
    opacity: interpolate(veil.value, [0, 0.1, 0.18], [0, 0.35, 0.12]),
    transform: [{ translateX: interpolate(veil.value, [0, 0.18], [-80, 160]) }, { skewX: '-18deg' }],
  }));

  return (
    <Animated.View style={[styles.root, rootAnim]} pointerEvents="none" exiting={FadeOut.duration(400)}>
      <LinearGradient
        colors={[Colors.light.gradientTop, Colors.light.gradientMid, Colors.light.gradientBottom]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerAnim]} />

      <Animated.View style={[styles.center, contentAnim]}>
        <Animated.View style={mascotAnim}>
          <StickerMascotte expression="fete" taille={148} />
        </Animated.View>
        <Animated.View style={[styles.copy, titleAnim]}>
          <Text style={styles.brand}>Anniv</Text>
          <Text style={styles.tagline}>Célébrez avec élégance</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.light.background,
    zIndex: 999,
    elevation: 999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: Spacing.four,
  },
  copy: {
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: Colors.light.text,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    letterSpacing: 0.2,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
