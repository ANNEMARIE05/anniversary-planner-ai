import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { emojiRelation, labelRelation } from '@/lib/labels';
import type { Personne } from '@/types/anniversaire';

type Props = {
  personne: Personne;
  onPrepare: () => void;
};

export function CarteAnniversaireDuJour({ personne, onPrepare }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.primary,
          shadowColor: theme.primary,
        },
      ]}>
      <Text style={styles.badge}>C’est aujourd’hui</Text>
      <Text style={styles.title}>{personne.prenom} fête son anniversaire</Text>
      <Text style={styles.relation}>
        {emojiRelation(personne.relation)}{' '}
        {labelRelation(personne.relation, personne.relationPersonnalisee)}
      </Text>
      <Text style={styles.quote}>
        Une occasion parfaite de lui rappeler combien elle compte.
      </Text>
      <BoutonPrincipal
        label={personne.statut === 'pret' ? 'Voir mon message' : 'Préparer mon message'}
        iconNode={<AppIcon name="sparkles" size={16} color={theme.primary} />}
        variant="secondary"
        onPress={onPrepare}
        style={{ backgroundColor: '#FFFFFF' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  badge: { color: '#FFF', fontSize: 13, fontWeight: '700', opacity: 0.95, letterSpacing: 0.3 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '800', lineHeight: 30 },
  relation: { color: '#FFE4E4', fontSize: 14, marginBottom: 2 },
  quote: { color: '#FFF', fontSize: 14, lineHeight: 20, opacity: 0.9, marginBottom: 4 },
});
