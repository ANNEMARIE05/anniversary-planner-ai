import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { CarteGuide } from '@/components/ui/carte-guide';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import {
  ModalConfirmation,
  type ConfirmationDialog,
} from '@/components/ui/modal-confirmation';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ONGLET } from '@/lib/guides';
import { daysUntil, formatDateAnniv, isSameDay, labelCountdown } from '@/lib/labels';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import { useReseauStore } from '@/store/reseau-store';
import type { UtilisateurReseau } from '@/types/reseau';

type TabId = 'decouvrir' | 'invitations' | 'amis';

export default function ReseauScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const addPersonne = useAnniversaireStore((s) => s.addPersonne);
  const personnes = useAnniversaireStore((s) => s.personnes);
  const utilisateurs = useReseauStore((s) => s.utilisateurs);
  const connexions = useReseauStore((s) => s.connexions);
  const envoyerDemande = useReseauStore((s) => s.envoyerDemande);
  const accepterDemande = useReseauStore((s) => s.accepterDemande);
  const refuserDemande = useReseauStore((s) => s.refuserDemande);
  const retirerConnexion = useReseauStore((s) => s.retirerConnexion);
  const statutPour = useReseauStore((s) => s.statutPour);
  const [tab, setTab] = useState<TabId>('decouvrir');
  const [dialog, setDialog] = useState<ConfirmationDialog | null>(null);

  const hasBirthday = user?.jourNaissance != null && user?.moisNaissance != null;

  const sameDayUsers = useMemo(() => {
    if (!hasBirthday) return [];
    return utilisateurs.filter(
      (u) => u.jour === user!.jourNaissance && u.mois === user!.moisNaissance,
    );
  }, [hasBirthday, user, utilisateurs]);

  const aDecouvrir = useMemo(() => {
    return [...utilisateurs]
      .filter((u) => {
        const s = statutPour(u.id);
        return s === 'aucune' || s === 'en_attente';
      })
      .sort((a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois));
  }, [utilisateurs, connexions, statutPour]);

  const amis = useMemo(
    () =>
      utilisateurs.filter((u) =>
        connexions.some((c) => c.userId === u.id && c.statut === 'connecte'),
      ),
    [utilisateurs, connexions],
  );

  const invitations = useMemo(
    () =>
      utilisateurs.filter((u) =>
        connexions.some((c) => c.userId === u.id && c.statut === 'recu'),
      ),
    [utilisateurs, connexions],
  );

  const list = tab === 'amis' ? amis : tab === 'invitations' ? invitations : aDecouvrir;

  const dejaDansCalendrier = (u: UtilisateurReseau) =>
    personnes.some(
      (p) =>
        p.prenom.toLowerCase() === u.prenom.toLowerCase() &&
        p.nom.toLowerCase() === u.nom.toLowerCase() &&
        p.jour === u.jour &&
        p.mois === u.mois,
    );

  const ajouterAuCalendrier = (u: UtilisateurReseau) => {
    if (dejaDansCalendrier(u)) {
      setDialog({
        title: 'Déjà ajouté',
        message: `${u.prenom} est déjà dans votre calendrier.`,
      });
      return;
    }
    addPersonne({
      prenom: u.prenom,
      nom: u.nom,
      jour: u.jour,
      mois: u.mois,
      annee: u.annee,
      relation: 'ami_proche',
      destination: 'whatsapp_prive',
      contexte: 'amis',
      description: `Via le réseau · ${u.ville}${u.bio ? ` — ${u.bio}` : ''}`,
      styles: ['chaleureux', 'festif'],
      ton: 'amical',
      longueur: 'moyen',
      rappels: { j7: true, j3: true, j1: true, j0: true, heure: '09:00' },
      photoUri: u.photoUri,
    });
    setDialog({
      title: 'Ajouté',
      message: `${u.prenom} est maintenant dans vos anniversaires.`,
    });
  };

  const proposerInvitation = (u: UtilisateurReseau) => {
    setDialog({
      title: 'Envoyer une invitation ?',
      message: `Vous proposez à ${u.prenom} de rejoindre votre cercle. La personne devra accepter avant que vous soyez amis.`,
      confirmLabel: 'Envoyer',
      onConfirm: () => {
        envoyerDemande(u.id);
        setDialog({
          title: 'Invitation envoyée',
          message: `En attente de la réponse de ${u.prenom}. Vous la verrez dans « Mes amis » une fois acceptée.`,
        });
      },
    });
  };

  const accepterInvitation = (u: UtilisateurReseau) => {
    accepterDemande(u.id);
    setTab('amis');
    setDialog({
      title: 'Vous êtes connectés',
      message: `${u.prenom} fait partie de vos amis. Vous pouvez maintenant ajouter sa date à votre calendrier.`,
    });
  };

  const tabHint =
    tab === 'decouvrir'
      ? 'Envoyez une invitation. Ils devront accepter avant de devenir amis.'
      : tab === 'invitations'
        ? 'Acceptez pour devenir amis, ou refusez.'
        : 'Une fois amis, vous pouvez ajouter leur date à votre calendrier.';

  return (
    <Screen title={ONGLET.reseau.titre} subtitle={ONGLET.reseau.sousTitre} tabSafe showProfile={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <CarteGuide id="reseau" title={ONGLET.reseau.guideTitre} text={ONGLET.reseau.guide} />

        {!hasBirthday ? (
          <FadeIn>
            <View
              style={[
                styles.hero,
                { backgroundColor: theme.primarySoft, borderColor: theme.border },
              ]}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={[styles.heroTitle, { color: theme.text }]}>Date de naissance</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19 }}>
                  Indiquez-la dans Profil pour utiliser le réseau.
                </Text>
                <BoutonPrincipal
                  label="Compléter mon profil"
                  variant="secondary"
                  onPress={() => router.push('/parametres')}
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </FadeIn>
        ) : null}

        {sameDayUsers.length > 0 ? (
          <FadeIn delay={40}>
            <View style={[styles.banner, { backgroundColor: theme.primary }]}>
              <AppIcon name="cake" size={22} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Même jour d’anniversaire</Text>
                <Text style={styles.bannerText}>
                  {sameDayUsers.map((u) => u.prenom).join(', ')}{' '}
                  {sameDayUsers.length > 1 ? 'fêtent' : 'fête'} le même jour que vous.
                </Text>
              </View>
            </View>
          </FadeIn>
        ) : null}

        <View style={styles.tabs}>
          {(
            [
              { id: 'decouvrir' as const, label: 'À découvrir', icon: 'search' as const },
              {
                id: 'invitations' as const,
                label: `Invitations${invitations.length ? ` (${invitations.length})` : ''}`,
                icon: 'bell' as const,
              },
              {
                id: 'amis' as const,
                label: `Mes amis${amis.length ? ` (${amis.length})` : ''}`,
                icon: 'heart' as const,
              },
            ] as const
          ).map((t) => {
            const on = tab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: on ? theme.primary : theme.backgroundElement,
                    borderColor: on ? theme.primary : theme.border,
                  },
                ]}>
                <AppIcon name={t.icon} size={14} color={on ? '#FFF' : theme.primary} />
                <Text
                  style={{ color: on ? '#FFF' : theme.text, fontWeight: '700', fontSize: 12 }}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
          {tabHint}
        </Text>

        {list.length === 0 ? (
          <EmptyState
            title={
              tab === 'amis'
                ? 'Pas encore d’amis'
                : tab === 'invitations'
                  ? 'Aucune invitation'
                  : 'Personne à découvrir'
            }
            subtitle={
              tab === 'amis'
                ? 'Invitez des personnes dans « À découvrir », puis attendez qu’elles acceptent.'
                : tab === 'invitations'
                  ? 'Quand quelqu’un vous invite, la demande apparaît ici pour accepter ou refuser.'
                  : 'Tous les profils sont déjà connectés ou en attente.'
            }
          />
        ) : (
          list.map((u, i) => {
            const statut = statutPour(u.id);
            const today = isSameDay(u.jour, u.mois);
            const inCal = dejaDansCalendrier(u);
            return (
              <FadeIn key={u.id} delay={Math.min(i * 35, 200)}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: today ? theme.primary : theme.border,
                    },
                  ]}>
                  <View style={styles.cardTop}>
                    <AvatarPersonne
                      prenom={u.prenom}
                      nom={u.nom}
                      photoUri={u.photoUri}
                      size={52}
                    />
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={[styles.name, { color: theme.text }]}>
                        {u.prenom} {u.nom}
                      </Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                        {formatDateAnniv(u.jour, u.mois)} ·{' '}
                        {labelCountdown(daysUntil(u.jour, u.mois))}
                        {u.ville ? ` · ${u.ville}` : ''}
                      </Text>
                      <Text
                        style={{ color: theme.textSecondary, fontSize: 12 }}
                        numberOfLines={2}>
                        {u.bio}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    {statut === 'aucune' ? (
                      <Pressable
                        onPress={() => proposerInvitation(u)}
                        style={[styles.textBtn, { backgroundColor: theme.primary }]}>
                        <AppIcon name="link" size={14} color="#FFF" />
                        <Text style={styles.textBtnLabel}>Inviter</Text>
                      </Pressable>
                    ) : null}

                    {statut === 'en_attente' ? (
                      <View
                        style={[
                          styles.textBtn,
                          { backgroundColor: theme.primarySoft, borderColor: theme.border, borderWidth: 1 },
                        ]}>
                        <AppIcon name="bell" size={14} color={theme.primary} />
                        <Text style={[styles.textBtnLabel, { color: theme.primary }]}>
                          Invitation envoyée — en attente
                        </Text>
                      </View>
                    ) : null}

                    {statut === 'recu' ? (
                      <>
                        <Pressable
                          onPress={() => accepterInvitation(u)}
                          style={[styles.textBtn, { backgroundColor: theme.success, flex: 1 }]}>
                          <AppIcon name="check" size={14} color="#FFF" />
                          <Text style={styles.textBtnLabel}>Accepter</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            refuserDemande(u.id);
                            setDialog({
                              title: 'Invitation refusée',
                              message: `La demande de ${u.prenom} a été refusée.`,
                            });
                          }}
                          style={[
                            styles.textBtn,
                            {
                              backgroundColor: theme.primarySoft,
                              flex: 1,
                              borderWidth: 1,
                              borderColor: theme.border,
                            },
                          ]}>
                          <AppIcon name="x" size={14} color={theme.primary} />
                          <Text style={[styles.textBtnLabel, { color: theme.primary }]}>
                            Refuser
                          </Text>
                        </Pressable>
                      </>
                    ) : null}

                    {statut === 'connecte' ? (
                      <>
                        <Pressable
                          onPress={() => ajouterAuCalendrier(u)}
                          style={[
                            styles.textBtn,
                            {
                              backgroundColor: inCal ? theme.primarySoft : theme.primary,
                              flex: 1,
                            },
                          ]}>
                          <AppIcon
                            name={inCal ? 'check' : 'calendar'}
                            size={14}
                            color={inCal ? theme.primary : '#FFF'}
                          />
                          <Text
                            style={[
                              styles.textBtnLabel,
                              { color: inCal ? theme.primary : '#FFF' },
                            ]}>
                            {inCal ? 'Déjà dans mon calendrier' : 'Ajouter au calendrier'}
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setDialog({
                              title: 'Retirer cet ami ?',
                              message: `Vous ne serez plus connecté(e) avec ${u.prenom}.`,
                              confirmLabel: 'Retirer',
                              destructive: true,
                              onConfirm: () => retirerConnexion(u.id),
                            });
                          }}
                          style={[
                            styles.iconOnly,
                            { backgroundColor: theme.input, borderColor: theme.border },
                          ]}>
                          <AppIcon name="x" size={16} color={theme.textSecondary} />
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                </View>
              </FadeIn>
            );
          })
        )}
      </ScrollView>

      <ModalConfirmation
        visible={!!dialog}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        destructive={dialog?.destructive}
        onClose={() => setDialog(null)}
        onConfirm={dialog?.onConfirm}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingBottom: Spacing.four },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.three,
  },
  heroTitle: { fontSize: 17, fontWeight: '800' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  bannerTitle: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  bannerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  tabs: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: { fontSize: 16, fontWeight: '700' },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  textBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
  },
  textBtnLabel: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  iconOnly: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
