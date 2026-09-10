import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { BoutonProfil } from '@/components/ui/bouton-profil';
import { CarteAnniversaireDuJour } from '@/components/ui/carte-anniversaire-jour';
import { CartePersonne } from '@/components/ui/carte-personne';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil, isSameDay } from '@/lib/labels';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function AccueilScreen() {
  const theme = useTheme();
  const personnes = useAnniversaireStore((s) => s.personnes);
  const user = useAuthStore((s) => s.user);

  const today = personnes.filter((p) => isSameDay(p.jour, p.mois));
  const upcoming = [...personnes]
    .filter((p) => !isSameDay(p.jour, p.mois))
    .sort((a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois))
    .slice(0, 8);

  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const hello = user?.prenom ? `Bonjour, ${user.prenom}` : 'Bonjour';

  return (
    <Screen tabSafe>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <FadeIn style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.hello, { color: theme.text }]}>{hello}</Text>
            <Text style={[styles.lead, { color: theme.textSecondary }]}>
              Les anniversaires qui comptent pour vous.
            </Text>
            <Text style={[styles.date, { color: theme.primary }]}>{dateLabel}</Text>
          </View>
          <BoutonProfil />
        </FadeIn>

        {today.map((p, i) => (
          <FadeIn key={p.id} delay={60 + i * 40}>
            <CarteAnniversaireDuJour
              personne={p}
              onPrepare={() => router.push(`/message/${p.id}`)}
            />
          </FadeIn>
        ))}

        <FadeIn delay={100} style={styles.actions}>
          <BoutonPrincipal
            label="Ajouter"
            iconNode={<AppIcon name="add" size={18} color="#FFFFFF" />}
            onPress={() => router.push('/ajouter')}
            style={{ flex: 1 }}
          />
          <BoutonPrincipal
            label="Message"
            iconNode={<AppIcon name="sparkles" size={17} color={theme.primary} />}
            variant="secondary"
            onPress={() => router.push('/assistant')}
            style={{ flex: 1 }}
          />
        </FadeIn>

        <FadeIn delay={140}>
          <View style={styles.sectionRow}>
            <Text style={[styles.section, { color: theme.text }]}>À ne pas oublier</Text>
            {upcoming.length > 0 ? (
              <Pressable onPress={() => router.push('/personnes')}>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>Voir tout</Text>
              </Pressable>
            ) : null}
          </View>
        </FadeIn>

        {upcoming.length === 0 && today.length === 0 ? (
          <EmptyState
            emoji="🎂"
            title="Votre calendrier est encore vide"
            subtitle="Ajoutez votre premier anniversaire pour commencer."
            actionLabel="Ajouter une personne"
            onAction={() => router.push('/ajouter')}
          />
        ) : (
          <View style={styles.upcoming}>
            {upcoming.map((p, i) => (
              <FadeIn key={p.id} delay={160 + i * 35}>
                <CartePersonne
                  personne={p}
                  onPress={() => router.push(`/personne/${p.id}`)}
                />
              </FadeIn>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingBottom: Spacing.two },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  lead: { fontSize: 15, lineHeight: 22, marginTop: 2 },
  date: { fontSize: 13, fontWeight: '600', marginTop: 6, textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: 2 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  section: { fontSize: 18, fontWeight: '700' },
  upcoming: { gap: Spacing.two },
});
