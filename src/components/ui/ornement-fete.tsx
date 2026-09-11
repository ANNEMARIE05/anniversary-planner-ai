import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
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

type Props = {
  /** Initiale / monogramme (1–2 lettres). */
  letter?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** `crest` = anneaux + lettre, `mark` = motif abstrait sans lettre. */
  variant?: 'crest' | 'mark';
  tone?: 'brand' | 'light' | 'gold';
  animated?: boolean;
};

/**
 * Emblème anniversaire chic : sceau monogramme + anneaux fins + scintillements.
 * Remplace les mascottes cartoon.
 */
export function OrnementFete({
  letter = 'A',
  size = 88,
  style,
  variant = 'crest',
  tone = 'brand',
  animated = true,
}: Props) {
  const theme = useTheme();
  const pulse = useSharedValue(1);
  const spin = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.035, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    spin.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
  }, [animated, pulse, spin]);

  const wrapAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const ringAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const palette =
    tone === 'light'
      ? {
          outer: 'rgba(255,255,255,0.38)',
          mid: 'rgba(255,255,255,0.55)',
          core: ['rgba(255,255,255,0.96)', 'rgba(255,236,232,0.92)'] as const,
          letter: theme.primary,
          spark: '#FFFFFF',
          accent: theme.accentGold,
          border: 'rgba(255,255,255,0.65)',
        }
      : tone === 'gold'
        ? {
            outer: 'rgba(245,185,66,0.38)',
            mid: 'rgba(241,91,98,0.3)',
            core: [theme.accentGold, theme.accentWarm] as const,
            letter: '#FFFFFF',
            spark: theme.accentGold,
            accent: theme.primary,
            border: 'rgba(255,255,255,0.35)',
          }
        : {
            outer: 'rgba(241,91,98,0.24)',
            mid: 'rgba(245,185,66,0.3)',
            core: [theme.primarySoft, '#FFFFFF'] as const,
            letter: theme.primary,
            spark: theme.accentGold,
            accent: theme.primary,
            border: theme.border,
          };

  const mono = (letter || 'A').slice(0, 2).toUpperCase();
  const outer = size;
  const mid = size * 0.78;
  const core = size * 0.58;

  return (
    <Animated.View style={[{ width: outer, height: outer }, wrapAnim, style]}>
      <View
        style={[
          styles.outer,
          { width: outer, height: outer, borderRadius: outer / 2, borderColor: palette.outer },
        ]}
      />

      <Animated.View
        style={[
          styles.mid,
          {
            width: mid,
            height: mid,
            borderRadius: mid / 2,
            borderColor: palette.mid,
            left: (outer - mid) / 2,
            top: (outer - mid) / 2,
          },
          ringAnim,
        ]}>
        <View style={[styles.tick, { backgroundColor: palette.accent, top: 2 }]} />
        <View style={[styles.tick, { backgroundColor: palette.spark, bottom: 2 }]} />
        <View style={[styles.tickH, { backgroundColor: palette.accent, left: 2 }]} />
        <View style={[styles.tickH, { backgroundColor: palette.spark, right: 2 }]} />
      </Animated.View>

      <LinearGradient
        colors={[...palette.core]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[
          styles.core,
          {
            width: core,
            height: core,
            borderRadius: core / 2,
            left: (outer - core) / 2,
            top: (outer - core) / 2,
            borderColor: palette.border,
          },
        ]}>
        {variant === 'crest' ? (
          <Text
            style={[
              styles.letter,
              {
                color: palette.letter,
                fontSize: core * 0.4,
                letterSpacing: mono.length > 1 ? -1 : 0.5,
              },
            ]}>
            {mono}
          </Text>
        ) : (
          <View style={styles.mark}>
            <View
              style={[
                styles.diamond,
                { backgroundColor: palette.accent, width: core * 0.16, height: core * 0.16 },
              ]}
            />
            <View
              style={[
                styles.diamond,
                {
                  backgroundColor: palette.spark,
                  width: core * 0.1,
                  height: core * 0.1,
                  marginTop: core * 0.08,
                  opacity: 0.85,
                },
              ]}
            />
          </View>
        )}
      </LinearGradient>

      <SparkDot
        animated={animated}
        delay={0}
        color={palette.spark}
        size={7}
        style={{ top: size * 0.05, right: size * 0.08 }}
      />
      <SparkDot
        animated={animated}
        delay={450}
        color={palette.accent}
        size={5}
        style={{ bottom: size * 0.1, left: size * 0.06 }}
      />
    </Animated.View>
  );
}

function SparkDot({
  animated,
  delay,
  color,
  size,
  style,
}: {
  animated: boolean;
  delay: number;
  color: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}) {
  const o = useSharedValue(0.25);

  useEffect(() => {
    if (!animated) {
      o.value = 0.55;
      return;
    }
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.95, { duration: 1100 }), withTiming(0.18, { duration: 1100 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
  }, [animated, delay, o]);

  const anim = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <Animated.View style={[styles.sparkA, style, anim]}>
      <View style={[styles.diamond, { backgroundColor: color, width: size, height: size }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  mid: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  tick: {
    position: 'absolute',
    alignSelf: 'center',
    width: 3,
    height: 3,
    borderRadius: 1,
    left: '50%',
    marginLeft: -1.5,
  },
  tickH: {
    position: 'absolute',
    top: '50%',
    marginTop: -1.5,
    width: 3,
    height: 3,
    borderRadius: 1,
  },
  core: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  letter: {
    fontWeight: '300',
    fontStyle: 'italic',
  },
  mark: { alignItems: 'center', justifyContent: 'center' },
  diamond: { transform: [{ rotate: '45deg' }], borderRadius: 1 },
  sparkA: { position: 'absolute' },
});
