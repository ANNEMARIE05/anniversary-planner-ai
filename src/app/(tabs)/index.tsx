import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { BoutonProfil } from '@/components/ui/bouton-profil';
import { CarteAnniversaireDuJour } from '@/components/ui/carte-anniversaire-jour';
import { CartePersonne } from '@/components/ui/carte-personne';
import { CarteGuide } from '@/components/ui/carte-guide';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { IconBulle } from '@/components/ui/icon-bulle';
import { SkeletonAccueil } from '@/components/ui/skeleton';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { sontExemples } from '@/data/mock-personnes';
import { useTheme } from '@/hooks/use-theme';
import { ONGLET } from '@/lib/guides';
import { daysUntil, formatDateAnniv, isSameDay, labelCountdown } from '@/lib/labels';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import { useReseauStore } from '@/store/reseau-store';

export default function AccueilScreen() {
  const theme = useTheme();
  const hydrated = useAnniversaireStore((s) => s.hydrated);
  const personnes = useAnniversaireStore((s) => s.personnes);
  const chargerExemples = useAnniversaireStore((s) => s.chargerExemples);
  const user = useAuthStore((s) => s.user);
  const utilisateurs = useReseauStore((s) => s.utilisateurs);
  const connexions = useReseauStore((s) => s.connexions);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      setReady(false);
      return;
    }
    const t = setTimeout(() => setReady(true), 520);
    return () => clearTimeout(t);
  }, [hydrated]);

  const amis = utilisateurs.filter((u) =>
    connexions.some((c) => c.userId === u.id && c.statut === 'connecte'),
  );
  const demandesCount = connexions.filter((c) => c.statut === 'recu').length;

  const today = personnes.filter((p) => isSameDay(p.jour, p.mois));
  const upcoming = [...personnes]
    .filter((p) => !isSameDay(p.jour, p.mois))
    .sort((a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois))
    .slice(0, 8);

  const amisProches = [...amis]
    .sort((a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois))
    .slice(0, 3);

  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const hello = user?.prenom ? `Hey ${user.prenom}` : 'Hey';
  const exemplesSeulement = sontExemples(personnes);
  const calendrierVide = upcoming.length === 0 && today.length === 0;

  return (
    <Screen tabSafe>
      {!ready ? (
        <SkeletonAccueil />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <FadeIn style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={[styles.hello, { color: theme.text, fontFamily: Fonts.extraBold }]}>{hello}</Text>
              <Text style={[styles.lead, { color: theme.textSecondary }]}>
                {ONGLET.accueil.sousTitre}
              </Text>
              <Text style={[styles.date, { color: theme.primary }]}>{dateLabel}</Text>
            </View>
            <BoutonProfil />
          </FadeIn>

          {exemplesSeulement ? (
            <FadeIn delay={20}>
              <CarteGuide id="exemples" title="Exemples" text={ONGLET.accueil.exemples} />
            </FadeIn>
          ) : !calendrierVide ? (
            <FadeIn delay={20}>
              <CarteGuide
                id="accueil"
                title={ONGLET.accueil.guideTitre}
                text={ONGLET.accueil.guide}
                actionLabel={ONGLET.accueil.action}
                onAction={() => router.push('/ajouter')}
              />
            </FadeIn>
          ) : null}

          {personnes.length > 0 ? (
            <FadeIn delay={40}>
              <Pressable onPress={() => router.push('/reseau' as never)}>
                <LinearGradient
                  colors={[theme.cardGradientStart, theme.cardGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.networkCard, { borderColor: theme.border }]}>
                  <IconBulle name="users" size={44} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.networkTitle, { color: theme.text }]}>Réseau</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
                      Invitez, puis ajoutez leur date
                      {amis.length > 0
                        ? ` · ${amis.length} ami${amis.length > 1 ? 's' : ''}`
                        : ''}
                      {demandesCount > 0
                        ? ` · ${demandesCount} invitation${demandesCount > 1 ? 's' : ''}`
                        : ''}
                    </Text>
                  </View>
                  <AppIcon name="chevron-right" size={18} color={theme.primary} />
                </LinearGradient>
              </Pressable>
            </FadeIn>
          ) : null}

          {today.map((p, i) => (
            <FadeIn key={p.id} delay={60 + i * 40}>
              <CarteAnniversaireDuJour
                personne={p}
                showMascotte={i === 0}
                onPrepare={() => router.push(`/message/${p.id}`)}
              />
            </FadeIn>
          ))}

          {amisProches.length > 0 ? (
            <FadeIn delay={90}>
              <View style={styles.sectionRow}>
                <Text style={[styles.section, { color: theme.text }]}>Amis du réseau</Text>
                <Pressable onPress={() => router.push('/reseau' as never)}>
                  <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>Voir</Text>
                </Pressable>
              </View>
              <View style={styles.amisRow}>
                {amisProches.map((u) => (
                  <LinearGradient
                    key={u.id}
                    colors={[theme.cardGradientStart, theme.cardGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.amiChip, { borderColor: theme.border }]}>
                    <AvatarPersonne prenom={u.prenom} nom={u.nom} photoUri={u.photoUri} size={40} />
                    <View style={styles.amiText}>
                      <Text style={[styles.amiName, { color: theme.text }]} numberOfLines={1}>
                        {u.prenom}
                      </Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 11 }} numberOfLines={1}>
                        {labelCountdown(daysUntil(u.jour, u.mois))}
                      </Text>
                      <Text
                        style={{ color: theme.primary, fontSize: 11, fontWeight: '600' }}
                        numberOfLines={1}>
                        {formatDateAnniv(u.jour, u.mois)}
                      </Text>
                    </View>
                  </LinearGradient>
                ))}
              </View>
            </FadeIn>
          ) : null}

          <FadeIn delay={100} style={styles.actions}>
            <BoutonPrincipal
              label="Ajouter"
              iconNode={<AppIcon name="add" size={18} color="#FFFFFF" />}
              onPress={() => router.push('/ajouter')}
              style={{ flex: 1 }}
            />
            <BoutonPrincipal
              label="Préparer"
              iconNode={<AppIcon name="sparkles" size={17} color={theme.primary} />}
              variant="secondary"
              onPress={() => router.push('/assistant')}
              style={{ flex: 1 }}
            />
          </FadeIn>

          {!calendrierVide ? (
            <FadeIn delay={140}>
              <View style={styles.sectionRow}>
                <Text style={[styles.section, { color: theme.text }]}>À ne pas oublier</Text>
                {upcoming.length > 0 ? (
                  <Pressable onPress={() => router.push('/personnes')}>
                    <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
                      Voir tout
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </FadeIn>
          ) : null}

          {calendrierVide ? (
            <EmptyState
              title="Rien à venir pour l’instant"
              subtitle="Ajoutez une première date : elle apparaîtra ici, au calendrier et dans Personnes."
              actionLabel="Ajouter une personne"
              onAction={() => router.push('/ajouter')}
              secondaryLabel="Voir des exemples"
              onSecondary={chargerExemples}
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
      )}
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
  hello: { fontSize: 28, letterSpacing: -0.8 },
  lead: { fontSize: 14, lineHeight: 20, marginTop: 2 },
  date: { fontSize: 13, fontWeight: '600', marginTop: 6, textTransform: 'capitalize' },
  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.two + 4,
  },
  networkTitle: { fontSize: 16, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: 2 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  section: { fontSize: 18, fontWeight: '700' },
  upcoming: { gap: Spacing.two },
  amisRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  amiChip: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.two,
    alignItems: 'center',
    gap: Spacing.two,
  },
  amiText: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  amiName: { fontSize: 13, fontWeight: '700', textAlign: 'left', width: '100%' },
});
