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
  { id: 1, left: '10%', top: '14%', size: 9, delay: 0, duration: 6200, kind: 'diamond', drift: 10, tint: 'gold' },
  { id: 2, left: '86%', top: '20%', size: 22, delay: 500, duration: 7600, kind: 'ring', drift: -8, tint: 'primary' },
  { id: 3, left: '16%', top: '68%', size: 7, delay: 800, duration: 5400, kind: 'dot', drift: 10, tint: 'warm' },
  { id: 4, left: '78%', top: '72%', size: 10, delay: 300, duration: 6400, kind: 'diamond', drift: -10, tint: 'gold' },
  { id: 5, left: '48%', top: '10%', size: 5, delay: 600, duration: 5000, kind: 'dot', drift: 6, tint: 'primary' },
  { id: 6, left: '70%', top: '44%', size: 18, delay: 900, duration: 8000, kind: 'ring', drift: -6, tint: 'warm' },
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
  { id: 1, left: '-8%', top: '4%', size: 200, delay: 0, duration: 8600, tint: 'primary' },
  { id: 2, left: '62%', top: '58%', size: 170, delay: 700, duration: 9200, tint: 'gold' },
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
