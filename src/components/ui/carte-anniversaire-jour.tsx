import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInRight,
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { iconRelation, labelRelation } from '@/lib/labels';
import type { Personne } from '@/types/anniversaire';

type Props = {
  personne: Personne;
  onPrepare: () => void;
};

function FloatingSpark({
  delay,
  left,
  top,
  size = 6,
}: {
  delay: number;
  left: `${number}%`;
  top: `${number}%`;
  size?: number;
}) {
  const o = useSharedValue(0.15);
  const s = useSharedValue(0.6);
  const y = useSharedValue(0);

  useEffect(() => {
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.95, { duration: 1100 }), withTiming(0.12, { duration: 1100 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    s.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1.3, { duration: 1100 }), withTiming(0.55, { duration: 1100 })),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(6, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
        undefined,
        ReduceMotion.Never,
      ),
    );
  }, [delay, o, s, y]);

  const anim = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateY: y.value }, { scale: s.value }, { rotate: '45deg' }],
  }));

  return (
    <Animated.View
      style={[
        styles.spark,
        { left, top, width: size, height: size, borderRadius: size * 0.2 },
        anim,
      ]}
    />
  );
}

export function CarteAnniversaireDuJour({ personne, onPrepare }: Props) {
  const theme = useTheme();
  const pulse = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    shimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
  }, [glow, pulse, shimmer]);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowOpacity: interpolate(glow.value, [0, 1], [0.2, 0.4]),
  }));

  const shimmerAnim = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.4, 0.7, 1], [0, 0.2, 0.1, 0]),
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-120, 280]) }, { skewX: '-18deg' }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.springify().damping(15).stiffness(120).reduceMotion(ReduceMotion.Never)}
      style={[styles.wrap, { shadowColor: theme.primary }, cardAnim]}>
      <LinearGradient
        colors={[theme.primary, theme.accentWarm, theme.primaryDark]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <FloatingSpark delay={0} left="8%" top="14%" size={7} />
        <FloatingSpark delay={400} left="78%" top="10%" size={5} />
        <FloatingSpark delay={800} left="88%" top="48%" size={6} />
        <FloatingSpark delay={200} left="18%" top="72%" size={5} />

        <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerAnim]} />

        <View style={styles.row}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.badge}>C’est aujourd’hui</Text>
            <Text style={styles.title}>
              Aujourd’hui, on fête {personne.prenom} {personne.nom}
            </Text>
            <View style={styles.relationRow}>
              <AppIcon name={iconRelation(personne.relation)} size={14} color="#FFFFFF" />
              <Text style={styles.relation}>
                {labelRelation(personne.relation, personne.relationPersonnalisee)}
              </Text>
            </View>
          </View>
          <StickerMascotte expression="fete" taille={88} />
        </View>
        <Text style={styles.quote}>
          Une occasion parfaite de lui rappeler combien elle compte.
        </Text>
        <BoutonPrincipal
          label={personne.statut === 'pret' ? 'Voir mon message' : 'Préparer mon message'}
          iconNode={<AppIcon name="message" size={16} color={theme.primary} />}
          variant="secondary"
          onPress={onPrepare}
          style={{ backgroundColor: '#FFFFFF' }}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.xl,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.three,
    gap: Spacing.two,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 70,
    backgroundColor: 'rgba(255,255,255,0.55)',
    zIndex: 1,
  },
  spark: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, zIndex: 3 },
  badge: { color: '#FFF', fontSize: 13, fontWeight: '700', opacity: 0.95, letterSpacing: 0.3 },
  title: { color: '#FFF', fontSize: 20, fontWeight: '800', lineHeight: 26 },
  relationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  relation: { color: '#FFE4E4', fontSize: 14 },
  quote: { color: '#FFF', fontSize: 14, lineHeight: 20, opacity: 0.9, marginBottom: 4, zIndex: 3 },
});
