import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BadgeRelation } from '@/components/ui/badge-relation';
import { BadgeStatut } from '@/components/ui/badge-statut';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { FadeIn } from '@/components/ui/fade-in';
import { SelecteurOptions } from '@/components/ui/selecteur-options';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  daysUntil,
  formatDateAnniv,
  labelContexte,
  labelCountdown,
  labelDestination,
  labelsStyles,
} from '@/lib/labels';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import { RELATIONS, type RelationId } from '@/types/anniversaire';
import { pickImageFromLibrary } from '@/lib/pick-image';

export default function PersonneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const personne = useAnniversaireStore((s) => s.personnes.find((p) => p.id === id));
  const toggleFavori = useAnniversaireStore((s) => s.toggleFavori);
  const removePersonne = useAnniversaireStore((s) => s.removePersonne);
  const updatePersonne = useAnniversaireStore((s) => s.updatePersonne);

  const [editing, setEditing] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [jourText, setJourText] = useState('');
  const [moisText, setMoisText] = useState('');
  const [anneeText, setAnneeText] = useState('');
  const [description, setDescription] = useState('');
  const [relation, setRelation] = useState<RelationId>('ami_proche');

  useEffect(() => {
    if (!personne) return;
    setPrenom(personne.prenom);
    setNom(personne.nom);
    setJourText(String(personne.jour));
    setMoisText(String(personne.mois));
    setAnneeText(personne.annee ? String(personne.annee) : '');
    setDescription(personne.description);
    setRelation(personne.relation);
  }, [personne]);

  if (!personne) {
    return (
      <Screen title="Introuvable">
        <Text style={{ color: theme.textSecondary }}>Cette personne n’existe plus.</Text>
        <BoutonPrincipal label="Retour" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </Screen>
    );
  }

  const days = daysUntil(personne.jour, personne.mois);

  const saveEdit = () => {
    const jour = Number(jourText);
    const mois = Number(moisText);
    if (!prenom.trim()) {
      Alert.alert('Prénom requis', 'Indiquez au moins un prénom.');
      return;
    }
    if (!(jour >= 1 && jour <= 31 && mois >= 1 && mois <= 12)) {
      Alert.alert('Date invalide', 'Jour (1-31) et mois (1-12) sont requis.');
      return;
    }
    updatePersonne(personne.id, {
      prenom: prenom.trim(),
      nom: nom.trim(),
      jour,
      mois,
      annee: anneeText.trim() ? Number(anneeText) : undefined,
      description: description.trim(),
      relation,
    });
    setEditing(false);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>‹ Retour</Text>
          </Pressable>
          {!editing ? (
            <Pressable
              onPress={() => setEditing(true)}
              style={[styles.editChip, { backgroundColor: theme.primarySoft }]}>
              <AppIcon name="edit" size={15} color={theme.primary} />
              <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>Modifier</Text>
            </Pressable>
          ) : null}
        </View>

        {editing ? (
          <FadeIn style={{ gap: Spacing.two }}>
            <Text style={[styles.editTitle, { color: theme.text }]}>Modifier les informations</Text>
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <AvatarPersonne prenom={prenom || 'A'} nom={nom || 'P'} size={84} />
            </View>
            <ChampTexte label="Prénom" value={prenom} onChangeText={setPrenom} />
            <ChampTexte label="Nom" value={nom} onChangeText={setNom} />
            <ChampTexte
              label="Jour"
              keyboardType="number-pad"
              maxLength={2}
              value={jourText}
              onChangeText={(v) => setJourText(v.replace(/[^\d]/g, '').slice(0, 2))}
            />
            <ChampTexte
              label="Mois (1-12)"
              keyboardType="number-pad"
              maxLength={2}
              value={moisText}
              onChangeText={(v) => setMoisText(v.replace(/[^\d]/g, '').slice(0, 2))}
            />
            <ChampTexte
              label="Année (facultatif)"
              keyboardType="number-pad"
              maxLength={4}
              value={anneeText}
              onChangeText={(v) => setAnneeText(v.replace(/[^\d]/g, '').slice(0, 4))}
            />
            <Text style={{ color: theme.text, fontWeight: '600', marginTop: 4 }}>Relation</Text>
            <SelecteurOptions
              options={RELATIONS}
              value={relation}
              onChange={(rid) => setRelation(rid as RelationId)}
            />
            <ChampTexte
              label="À propos"
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <BoutonPrincipal label="Enregistrer" onPress={saveEdit} />
            <BoutonPrincipal label="Annuler" variant="ghost" onPress={() => setEditing(false)} />
          </FadeIn>
        ) : (
          <>
            <FadeIn style={styles.hero}>
              <Pressable
                onPress={async () => {
                  const uri = await pickImageFromLibrary();
                  if (uri) updatePersonne(personne.id, { photoUri: uri });
                }}
                style={styles.avatarPress}>
                <AvatarPersonne
                  prenom={personne.prenom}
                  nom={personne.nom}
                  photoUri={personne.photoUri}
                  size={88}
                />
                <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                  <AppIcon name="camera" size={12} color="#FFF" />
                </View>
              </Pressable>
              <Text style={[styles.name, { color: theme.text }]}>
                {personne.prenom} {personne.nom}
              </Text>
              <BadgeRelation relation={personne.relation} custom={personne.relationPersonnalisee} />
              <Text style={{ color: theme.textSecondary, marginTop: 2 }}>
                {formatDateAnniv(personne.jour, personne.mois)} · {labelCountdown(days)}
              </Text>
              <BadgeStatut statut={personne.statut} />
            </FadeIn>

            <FadeIn delay={60}>
              <Card theme={theme} title="Informations">
                <Info label="Destination" value={labelDestination(personne.destination)} theme={theme} />
                <Info label="Contexte" value={labelContexte(personne.contexte)} theme={theme} />
                <Info label="Style" value={labelsStyles(personne.styles) || '—'} theme={theme} />
                <Info label="Ton" value={personne.ton} theme={theme} />
              </Card>
            </FadeIn>

            {personne.description ? (
              <FadeIn delay={90}>
                <Card theme={theme} title="À propos">
                  <Text style={{ color: theme.text, lineHeight: 22 }}>{personne.description}</Text>
                </Card>
              </FadeIn>
            ) : null}

            <FadeIn delay={120}>
              <Card theme={theme} title="Message">
                {personne.messageActuel ? (
                  <Text style={{ color: theme.text, lineHeight: 24 }}>{personne.messageActuel}</Text>
                ) : (
                  <Text style={{ color: theme.textSecondary }}>Aucun message préparé pour le moment.</Text>
                )}
                <BoutonPrincipal
                  label={personne.statut === 'pret' ? 'Voir / régénérer' : 'Générer un message'}
                  iconNode={<AppIcon name="sparkles" size={16} color="#FFFFFF" />}
                  onPress={() => router.push(`/message/${personne.id}`)}
                  style={{ marginTop: 10 }}
                />
              </Card>
            </FadeIn>

            <FadeIn delay={150} style={styles.actions}>
              <BoutonPrincipal
                label={personne.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                iconNode={<AppIcon name="star" size={16} color={theme.primary} />}
                variant="secondary"
                onPress={() => toggleFavori(personne.id)}
              />
              <BoutonPrincipal
                label="Supprimer"
                variant="ghost"
                onPress={() =>
                  Alert.alert('Supprimer ?', `Retirer ${personne.prenom} de vos anniversaires ?`, [
                    { text: 'Annuler', style: 'cancel' },
                    {
                      text: 'Supprimer',
                      style: 'destructive',
                      onPress: () => {
                        removePersonne(personne.id);
                        router.back();
                      },
                    },
                  ])
                }
              />
            </FadeIn>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function Card({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Info({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: theme.text, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.two, paddingBottom: Spacing.four },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  editTitle: { fontSize: 24, fontWeight: '800' },
  hero: { alignItems: 'center', gap: 6, paddingVertical: Spacing.one },
  avatarPress: { position: 'relative', marginBottom: 4 },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 26, fontWeight: '800' },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  actions: { gap: Spacing.two },
});
