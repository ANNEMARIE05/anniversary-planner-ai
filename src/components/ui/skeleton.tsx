import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BoneProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Os shimmer réutilisable. */
export function SkeletonBone({ width = '100%', height = 14, radius = Radius.sm, style }: BoneProps) {
  const theme = useTheme();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
  }, [t]);

  const anim = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.45, 1]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.skeletonBase,
        },
        anim,
        style,
      ]}
    />
  );
}

export function SkeletonCartePersonne() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.personne,
        { backgroundColor: theme.cardGradientStart, borderColor: theme.border },
      ]}>
      <SkeletonBone width={52} height={52} radius={26} />
      <View style={styles.personneBody}>
        <SkeletonBone width="62%" height={16} />
        <SkeletonBone width="38%" height={12} />
        <SkeletonBone width="48%" height={12} />
      </View>
    </View>
  );
}

export function SkeletonCarteAnniv() {
  const theme = useTheme();
  return (
    <View style={[styles.anniv, { backgroundColor: theme.skeletonBase }]}>
      <View style={styles.annivRow}>
        <View style={{ flex: 1, gap: 10 }}>
          <SkeletonBone width="34%" height={12} style={{ backgroundColor: theme.skeletonHighlight }} />
          <SkeletonBone width="88%" height={18} style={{ backgroundColor: theme.skeletonHighlight }} />
          <SkeletonBone width="42%" height={12} style={{ backgroundColor: theme.skeletonHighlight }} />
        </View>
        <SkeletonBone width={72} height={72} radius={36} style={{ backgroundColor: theme.skeletonHighlight }} />
      </View>
      <SkeletonBone width="100%" height={40} radius={Radius.pill} style={{ backgroundColor: theme.skeletonHighlight }} />
    </View>
  );
}

export function SkeletonAccueil() {
  return (
    <View style={styles.accueil}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBone width="48%" height={26} />
          <SkeletonBone width="72%" height={14} />
          <SkeletonBone width="40%" height={12} />
        </View>
        <SkeletonBone width={44} height={44} radius={22} />
      </View>
      <SkeletonBone width="100%" height={72} radius={Radius.lg} />
      <SkeletonCarteAnniv />
      <SkeletonBone width="36%" height={18} />
      <SkeletonCartePersonne />
      <SkeletonCartePersonne />
      <SkeletonCartePersonne />
    </View>
  );
}

export function SkeletonListePersonnes({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCartePersonne key={i} />
      ))}
    </View>
  );
}

export function SkeletonCarteMessage() {
  const theme = useTheme();
  return (
    <View style={[styles.messageCard, { backgroundColor: theme.skeletonBase, borderColor: theme.border }]}>
      <SkeletonBone width="42%" height={12} style={{ alignSelf: 'center', backgroundColor: theme.skeletonHighlight }} />
      <SkeletonBone
        width={110}
        height={110}
        radius={55}
        style={{ alignSelf: 'center', marginVertical: Spacing.three, backgroundColor: theme.skeletonHighlight }}
      />
      <SkeletonBone width="55%" height={22} style={{ alignSelf: 'center', backgroundColor: theme.skeletonHighlight }} />
      <SkeletonBone width="88%" height={12} style={{ alignSelf: 'center', backgroundColor: theme.skeletonHighlight }} />
      <SkeletonBone width="78%" height={12} style={{ alignSelf: 'center', backgroundColor: theme.skeletonHighlight }} />
      <SkeletonBone width="64%" height={12} style={{ alignSelf: 'center', backgroundColor: theme.skeletonHighlight }} />
    </View>
  );
}

const styles = StyleSheet.create({
  personne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  personneBody: { flex: 1, gap: 8 },
  anniv: {
    borderRadius: Radius.xl,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  annivRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  accueil: { gap: Spacing.two, paddingBottom: Spacing.two },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  list: { gap: Spacing.two },
  messageCard: {
    aspectRatio: 3 / 4,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
