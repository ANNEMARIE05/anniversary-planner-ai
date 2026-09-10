import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { CartePersonne } from '@/components/ui/carte-personne';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil } from '@/lib/labels';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function AssistantScreen() {
  const theme = useTheme();
  const personnes = [...useAnniversaireStore((s) => s.personnes)].sort(
    (a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois),
  );

  return (
    <Screen title="Messages" subtitle="Préparez un message personnalisé" tabSafe>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {personnes.length === 0 ? (
          <EmptyState
            emoji="💬"
            title="Pas encore de personne"
            subtitle="Ajoutez un anniversaire pour générer un message personnalisé."
            actionLabel="Ajouter"
            onAction={() => router.push('/ajouter')}
          />
        ) : (
          personnes.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 35, 200)} style={styles.cardWrap}>
              <CartePersonne personne={p} onPress={() => router.push(`/personne/${p.id}`)} />
              <BoutonPrincipal
                label="Préparer"
                iconNode={<AppIcon name="sparkles" size={16} color="#FFFFFF" />}
                onPress={() => router.push(`/message/${p.id}`)}
                style={{ marginTop: 8 }}
              />
            </FadeIn>
          ))
        )}
        <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 4, fontSize: 13 }}>
          Les suggestions s’appuient sur le contexte, la relation et le ton choisis.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingBottom: Spacing.four },
  cardWrap: { gap: 0 },
});
