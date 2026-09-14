import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { CarteGuide } from '@/components/ui/carte-guide';
import { CartePersonne } from '@/components/ui/carte-personne';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PastilleQuota } from '@/components/ui/pastille-quota';
import { ONGLET } from '@/lib/guides';
import { daysUntil } from '@/lib/labels';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function AssistantScreen() {
  const theme = useTheme();
  const personnes = [...useAnniversaireStore((s) => s.personnes)].sort(
    (a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois),
  );

  return (
    <Screen title={ONGLET.messages.titre} subtitle={ONGLET.messages.sousTitre} tabSafe>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PastilleQuota />
        <CarteGuide id="messages" title={ONGLET.messages.guideTitre} text={ONGLET.messages.guide} />
        {personnes.length === 0 ? (
          <EmptyState
            title="Personne à qui écrire"
            subtitle="Ajoutez d’abord une date. Le message se prépare ensuite ici, sans être envoyé."
            actionLabel="Ajouter"
            onAction={() => router.push('/ajouter')}
          />
        ) : (
          personnes.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 35, 200)} style={styles.cardWrap}>
              <CartePersonne personne={p} onPress={() => router.push(`/personne/${p.id}`)} />
              <BoutonPrincipal
                label={
                  p.statut === 'envoye'
                    ? 'Voir le message envoyé'
                    : p.statut === 'pret'
                      ? 'Voir le message'
                      : 'Préparer un message'
                }
                iconNode={<AppIcon name="sparkles" size={16} color="#FFFFFF" />}
                onPress={() => router.push(`/message/${p.id}`)}
              />
            </FadeIn>
          ))
        )}
        {personnes.length > 0 ? (
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 4, fontSize: 13, lineHeight: 19 }}>
            Rien n’est envoyé à votre place : vous copiez le texte ou téléchargez la carte.
          </Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingBottom: Spacing.four },
  cardWrap: { gap: 10 },
});
