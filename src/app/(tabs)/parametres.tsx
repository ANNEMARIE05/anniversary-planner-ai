import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { FadeIn } from '@/components/ui/fade-in';
import { IconBulle } from '@/components/ui/icon-bulle';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateAnniv } from '@/lib/labels';
import { pickImageFromLibrary } from '@/lib/pick-image';
import { partageService } from '@/services/partageService';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function ParametresScreen() {
  const theme = useTheme();
  const preferences = useAnniversaireStore((s) => s.preferences);
  const updatePreferences = useAnniversaireStore((s) => s.updatePreferences);
  const clearData = useAnniversaireStore((s) => s.clearData);
  const exportData = useAnniversaireStore((s) => s.exportData);
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const [editing, setEditing] = useState(false);
  const [prenom, setPrenom] = useState(user?.prenom ?? '');
  const [nom, setNom] = useState(user?.nom ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [jour, setJour] = useState(user?.jourNaissance ? String(user.jourNaissance) : '');
  const [mois, setMois] = useState(user?.moisNaissance ? String(user.moisNaissance) : '');
  const [annee, setAnnee] = useState(user?.anneeNaissance ? String(user.anneeNaissance) : '');
  const [bio, setBio] = useState(user?.bio ?? '');

  useEffect(() => {
    setPrenom(user?.prenom ?? '');
    setNom(user?.nom ?? '');
    setEmail(user?.email ?? '');
    setJour(user?.jourNaissance ? String(user.jourNaissance) : '');
    setMois(user?.moisNaissance ? String(user.moisNaissance) : '');
    setAnnee(user?.anneeNaissance ? String(user.anneeNaissance) : '');
    setBio(user?.bio ?? '');
  }, [user]);

  const themes = [
    { id: 'clair' as const, label: 'Clair' },
    { id: 'sombre' as const, label: 'Sombre' },
  ];

  const saveProfile = () => {
    const j = Number(jour);
    const m = Number(mois);
    if (!j || j < 1 || j > 31 || !m || m < 1 || m > 12) {
      Alert.alert('Date invalide', 'Indiquez un jour (1-31) et un mois (1-12) valides.');
      return;
    }
    updateProfile({
      prenom,
      nom,
      email,
      jourNaissance: j,
      moisNaissance: m,
      anneeNaissance: annee ? Number(annee) : undefined,
      bio: bio.trim() || undefined,
    });
    setEditing(false);
  };

  const changePhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) updateProfile({ photoUri: uri });
  };

  const doLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/connexion');
        },
      },
    ]);
  };

  return (
    <Screen title="Paramètres" subtitle="Compte et préférences" tabSafe showProfile={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.two, paddingBottom: Spacing.three }}>
        <FadeIn>
          <Section title="Compte" theme={theme}>
            <View style={styles.profileHeader}>
              <Pressable onPress={changePhoto} style={styles.avatarWrap}>
                {user ? (
                  <AvatarPersonne
                    prenom={user.prenom}
                    nom={user.nom}
                    photoUri={user.photoUri}
                    size={72}
                  />
                ) : null}
                <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                  <AppIcon name="camera" size={12} color="#FFF" />
                </View>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>
                  {user?.prenom} {user?.nom}
                </Text>
                <Text style={{ color: theme.textSecondary }}>{user?.email}</Text>
                {user?.jourNaissance && user?.moisNaissance ? (
                  <Text style={{ color: theme.primary, fontWeight: '600', marginTop: 4, fontSize: 13 }}>
                    🎂 {formatDateAnniv(user.jourNaissance, user.moisNaissance)}
                  </Text>
                ) : (
                  <Text style={{ color: theme.textSecondary, marginTop: 4, fontSize: 13 }}>
                    Date de naissance manquante
                  </Text>
                )}
              </View>
            </View>

            {editing ? (
              <View style={{ gap: Spacing.two }}>
                <ChampTexte label="Prénom" value={prenom} onChangeText={setPrenom} />
                <ChampTexte label="Nom" value={nom} onChangeText={setNom} />
                <ChampTexte
                  label="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={{ color: theme.text, fontWeight: '600' }}>Date de naissance</Text>
                <View style={styles.dateRow}>
                  <View style={{ flex: 1 }}>
                    <ChampTexte placeholder="Jour" keyboardType="number-pad" maxLength={2} value={jour} onChangeText={setJour} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ChampTexte placeholder="Mois" keyboardType="number-pad" maxLength={2} value={mois} onChangeText={setMois} />
                  </View>
                  <View style={{ flex: 1.2 }}>
                    <ChampTexte placeholder="Année" keyboardType="number-pad" maxLength={4} value={annee} onChangeText={setAnnee} />
                  </View>
                </View>
                <ChampTexte
                  label="Bio"
                  placeholder="Quelques mots sur vous…"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                />
                <View style={styles.rowActions}>
                  <BoutonPrincipal label="Enregistrer" onPress={saveProfile} style={{ flex: 1 }} />
                  <BoutonPrincipal
                    label="Annuler"
                    variant="ghost"
                    onPress={() => setEditing(false)}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setEditing(true)}
                style={[styles.editBtn, { borderColor: theme.border }]}>
                <AppIcon name="edit" size={16} color={theme.primary} />
                <Text style={{ color: theme.primary, fontWeight: '700' }}>Modifier mon profil</Text>
              </Pressable>
            )}
          </Section>
        </FadeIn>

        <FadeIn delay={40}>
          <Pressable
            onPress={() => router.push('/reseau' as never)}
            style={[styles.networkLink, { backgroundColor: theme.primarySoft, borderColor: theme.border }]}>
            <IconBulle name="users" size={42} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: '800' }}>Mon réseau social</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                Connexions basées sur vos dates de naissance
              </Text>
            </View>
            <AppIcon name="chevron-right" size={18} color={theme.primary} />
          </Pressable>
        </FadeIn>

        <FadeIn delay={60}>
          <Section title="Notifications" theme={theme}>
            <Row
              label="Notifications activées"
              theme={theme}
              right={
                <Switch
                  value={preferences.notificationsActivees}
                  onValueChange={(v) => updatePreferences({ notificationsActivees: v })}
                  trackColor={{ true: theme.primary, false: theme.border }}
                />
              }
            />
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              Heure par défaut : {preferences.heureDefaut}
            </Text>
          </Section>
        </FadeIn>

        <FadeIn delay={100}>
          <Section title="Messages" theme={theme}>
            <Row
              label="Emojis dans les messages"
              theme={theme}
              right={
                <Switch
                  value={preferences.emojis}
                  onValueChange={(v) => updatePreferences({ emojis: v })}
                  trackColor={{ true: theme.primary, false: theme.border }}
                />
              }
            />
          </Section>
        </FadeIn>

        <FadeIn delay={140}>
          <Section title="Apparence" theme={theme}>
            <View style={styles.rowWrap}>
              {themes.map((t) => {
                const active = preferences.theme === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => updatePreferences({ theme: t.id })}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? theme.primary : theme.backgroundSelected,
                      },
                    ]}>
                    <Text style={{ color: active ? '#FFF' : theme.text, fontWeight: '600' }}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Section>
        </FadeIn>

        <FadeIn delay={180}>
          <Section title="Données" theme={theme}>
            <BoutonPrincipal
              label="Exporter mes données"
              variant="secondary"
              onPress={() => partageService.partagerMessage(exportData(), 'Export Anniversary Planner')}
            />
            <BoutonPrincipal
              label="Effacer les données locales"
              variant="ghost"
              onPress={() =>
                Alert.alert('Effacer ?', 'Toutes les personnes et messages locaux seront supprimés.', [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Effacer', style: 'destructive', onPress: clearData },
                ])
              }
            />
          </Section>
        </FadeIn>

        <FadeIn delay={220}>
          <BoutonPrincipal
            label="Se déconnecter"
            iconNode={<AppIcon name="logout" size={18} color={theme.primary} />}
            variant="secondary"
            onPress={doLogout}
          />
        </FadeIn>

        <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 12 }}>
          Anniversary Planner · v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.section, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  label,
  right,
  theme,
}: {
  label: string;
  right: React.ReactNode;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: theme.text, fontSize: 15, flex: 1 }}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.pill },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  rowActions: { flexDirection: 'row', gap: 8 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  avatarWrap: { position: 'relative' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: { flexDirection: 'row', gap: Spacing.two },
  networkLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
});
