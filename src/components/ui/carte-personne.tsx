import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BadgeRelation } from '@/components/ui/badge-relation';
import { BadgeStatut } from '@/components/ui/badge-statut';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil, formatDateAnniv, labelCountdown } from '@/lib/labels';
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
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
        compact && styles.compact,
        anim,
      ]}>
      <AvatarPersonne prenom={personne.prenom} nom={personne.nom} photoUri={personne.photoUri} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]}>
          {personne.prenom} {personne.nom}
        </Text>
        <BadgeRelation relation={personne.relation} custom={personne.relationPersonnalisee} />
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {formatDateAnniv(personne.jour, personne.mois)} · {labelCountdown(days)}
        </Text>
        {!compact ? <BadgeStatut statut={personne.statut} /> : null}
      </View>
      {personne.favori ? <Text style={styles.star}>★</Text> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  compact: { minWidth: 220, marginRight: Spacing.two },
  content: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 13 },
  star: { position: 'absolute', top: 12, right: 14, fontSize: 14, color: '#F15B62' },
});
