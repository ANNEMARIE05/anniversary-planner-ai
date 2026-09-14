import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil, formatDateAnniv, isSameDay, labelCountdown, labelRelation } from '@/lib/labels';
import type { Personne } from '@/types/anniversaire';

type Props = {
  personne: Personne;
  onPress?: () => void;
  compact?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CartePersonne({ personne, onPress, compact }: Props) {
  const theme = useTheme();
  const days = daysUntil(personne.jour, personne.mois);
  const today = isSameDay(personne.jour, personne.mois);
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { reduceMotion: ReduceMotion.Never });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { reduceMotion: ReduceMotion.Never });
      }}
      style={[styles.card, compact && styles.compact, anim]}>
      <LinearGradient
        colors={[theme.cardGradientStart, theme.cardGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.inner, { borderColor: theme.border }]}>
        <View style={styles.avatarWrap}>
          <AvatarPersonne prenom={personne.prenom} nom={personne.nom} photoUri={personne.photoUri} />
          {personne.statut === 'envoye' ? (
            <View
              accessibilityLabel="Message déjà envoyé"
              style={[
                styles.sentDot,
                { backgroundColor: theme.success, borderColor: theme.backgroundElement },
              ]}>
              <AppIcon name="check" size={11} color="#FFFFFF" />
            </View>
          ) : null}
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {personne.prenom} {personne.nom}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
            {formatDateAnniv(personne.jour, personne.mois)} ·{' '}
            {labelRelation(personne.relation, personne.relationPersonnalisee)}
          </Text>
        </View>
        <View style={styles.right}>
          {personne.favori ? <Text style={styles.star}>★</Text> : null}
          <Text style={[styles.countdown, { color: theme.primary }]}>
            {today ? "Aujourd'hui" : labelCountdown(days)}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 4,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  compact: { minWidth: 220, marginRight: Spacing.two },
  avatarWrap: {
    position: 'relative',
  },
  sentDot: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  content: {
    flex: 1,
    gap: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    width: '100%',
  },
  meta: {
    fontSize: 13,
    textAlign: 'left',
    width: '100%',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    minWidth: 72,
  },
  countdown: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  star: { fontSize: 14, color: '#F15B62' },
});
