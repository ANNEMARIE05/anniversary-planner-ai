import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type Motif = {
  id: number;
  left: `${number}%`;
  top: `${number}%`;
  size: number;
  delay: number;
  duration: number;
  kind: 'diamond' | 'ring' | 'dot' | 'line';
  drift: number;
  tint: 'primary' | 'warm' | 'gold';
};

const MOTIFS: Motif[] = [
  { id: 1, left: '8%', top: '12%', size: 10, delay: 0, duration: 5200, kind: 'diamond', drift: 12, tint: 'gold' },
  { id: 2, left: '84%', top: '18%', size: 28, delay: 400, duration: 6800, kind: 'ring', drift: -10, tint: 'primary' },
  { id: 3, left: '14%', top: '58%', size: 8, delay: 700, duration: 4800, kind: 'dot', drift: 14, tint: 'warm' },
  { id: 4, left: '78%', top: '62%', size: 12, delay: 200, duration: 5400, kind: 'diamond', drift: -12, tint: 'primary' },
  { id: 5, left: '48%', top: '8%', size: 6, delay: 500, duration: 4200, kind: 'dot', drift: 8, tint: 'gold' },
  { id: 6, left: '90%', top: '42%', size: 22, delay: 900, duration: 7200, kind: 'ring', drift: -8, tint: 'warm' },
  { id: 7, left: '6%', top: '38%', size: 36, delay: 300, duration: 5600, kind: 'line', drift: 10, tint: 'primary' },
  { id: 8, left: '70%', top: '82%', size: 9, delay: 600, duration: 5000, kind: 'diamond', drift: -14, tint: 'gold' },
  { id: 9, left: '28%', top: '78%', size: 24, delay: 1000, duration: 6400, kind: 'ring', drift: 9, tint: 'primary' },
  { id: 10, left: '55%', top: '48%', size: 5, delay: 450, duration: 4600, kind: 'dot', drift: -6, tint: 'warm' },
  { id: 11, left: '38%', top: '28%', size: 7, delay: 250, duration: 5800, kind: 'diamond', drift: 11, tint: 'gold' },
  { id: 12, left: '18%', top: '88%', size: 30, delay: 750, duration: 7000, kind: 'line', drift: -7, tint: 'warm' },
];

type Blob = {
  id: number;
  left: `${number}%`;
  top: `${number}%`;
  size: number;
  delay: number;
  duration: number;
  tint: 'primary' | 'warm' | 'gold';
};

const BLOBS: Blob[] = [
  { id: 1, left: '-10%', top: '2%', size: 240, delay: 0, duration: 7600, tint: 'primary' },
  { id: 2, left: '55%', top: '16%', size: 190, delay: 800, duration: 8600, tint: 'warm' },
  { id: 3, left: '8%', top: '60%', size: 210, delay: 400, duration: 8000, tint: 'gold' },
  { id: 4, left: '68%', top: '70%', size: 170, delay: 1100, duration: 7200, tint: 'primary' },
];

/** Fond ambient chic : blobs + géométrie fine (pas de stickers cartoon). */
export function FondAnime() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {BLOBS.map((b) => (
        <BlobView
          key={`blob-${b.id}`}
          blob={b}
          color={
            b.tint === 'warm'
              ? theme.gradientBlobWarm
              : b.tint === 'gold'
                ? theme.gradientBlobGold
                : theme.gradientBlob
          }
        />
      ))}
      {MOTIFS.map((m) => (
        <MotifView
          key={m.id}
          motif={m}
          color={
            m.tint === 'gold' ? theme.accentGold : m.tint === 'warm' ? theme.accentWarm : theme.primary
          }
        />
      ))}
    </View>
  );
}

function BlobView({ blob, color }: { blob: Blob; color: string }) {
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(
      blob.delay,
      withRepeat(
        withSequence(
          withTiming(1.16, { duration: blob.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.94, { duration: blob.duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    x.value = withDelay(
      blob.delay,
      withRepeat(
        withSequence(
          withTiming(16, { duration: blob.duration * 1.1, easing: Easing.inOut(Easing.sin) }),
          withTiming(-10, { duration: blob.duration * 1.1, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    y.value = withDelay(
      blob.delay,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: blob.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(10, { duration: blob.duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    opacity.value = withDelay(
      blob.delay,
      withRepeat(
        withSequence(
          withTiming(0.78, { duration: blob.duration / 2 }),
          withTiming(0.4, { duration: blob.duration / 2 }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
  }, [blob, opacity, scale, x, y]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          left: blob.left,
          top: blob.top,
          width: blob.size,
          height: blob.size,
          borderRadius: blob.size / 2,
          backgroundColor: color,
        },
        anim,
      ]}
    />
  );
}

function MotifView({ motif, color }: { motif: Motif; color: string }) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const opacity = useSharedValue(0.2);
  const rotate = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      motif.delay,
      withRepeat(
        withSequence(
          withTiming(-22, { duration: motif.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: motif.duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
        undefined,
        ReduceMotion.Never,
      ),
    );
    x.value = withDelay(
      motif.delay,
      withRepeat(
        withSequence(
          withTiming(motif.drift, {
            duration: motif.duration * 1.1,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-motif.drift * 0.5, {
            duration: motif.duration * 1.1,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    opacity.value = withDelay(
      motif.delay,
      withRepeat(
        withSequence(
          withTiming(0.48, { duration: motif.duration / 2 }),
          withTiming(0.16, { duration: motif.duration / 2 }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    rotate.value = withRepeat(
      withTiming(motif.kind === 'ring' ? 360 : 18, {
        duration: motif.kind === 'ring' ? 14000 : motif.duration,
        easing: motif.kind === 'ring' ? Easing.linear : Easing.inOut(Easing.sin),
      }),
      -1,
      motif.kind !== 'ring',
      undefined,
      ReduceMotion.Never,
    );
  }, [motif, opacity, rotate, x, y]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { translateX: x.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, { left: motif.left, top: motif.top }, anim]}>
      {motif.kind === 'diamond' ? (
        <View
          style={{
            width: motif.size,
            height: motif.size,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />
      ) : null}
      {motif.kind === 'ring' ? (
        <View
          style={{
            width: motif.size,
            height: motif.size,
            borderRadius: motif.size / 2,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
      ) : null}
      {motif.kind === 'dot' ? (
        <View
          style={{
            width: motif.size,
            height: motif.size,
            borderRadius: motif.size / 2,
            backgroundColor: color,
          }}
        />
      ) : null}
      {motif.kind === 'line' ? (
        <View
          style={{
            width: motif.size,
            height: 1.5,
            borderRadius: 1,
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute' },
  particle: { position: 'absolute' },
});
