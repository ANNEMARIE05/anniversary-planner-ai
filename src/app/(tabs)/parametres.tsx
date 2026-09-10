import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { FadeIn } from '@/components/ui/fade-in';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
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

  const themes = [
    { id: 'clair' as const, label: 'Clair' },
    { id: 'sombre' as const, label: 'Sombre' },
    { id: 'auto' as const, label: 'Automatique' },
  ];

  const saveProfile = () => {
    updateProfile({ prenom, nom, email });
    setEditing(false);
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
                <View style={styles.rowActions}>
                  <BoutonPrincipal label="Enregistrer" onPress={saveProfile} style={{ flex: 1 }} />
                  <BoutonPrincipal
                    label="Annuler"
                    variant="ghost"
                    onPress={() => {
                      setPrenom(user?.prenom ?? '');
                      setNom(user?.nom ?? '');
                      setEmail(user?.email ?? '');
                      setEditing(false);
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <>
                <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>
                  {user?.prenom} {user?.nom}
                </Text>
                <Text style={{ color: theme.textSecondary }}>{user?.email}</Text>
                <Pressable
                  onPress={() => setEditing(true)}
                  style={[styles.editBtn, { borderColor: theme.border }]}>
                  <AppIcon name="edit" size={16} color={theme.primary} />
                  <Text style={{ color: theme.primary, fontWeight: '700' }}>Modifier mon profil</Text>
                </Pressable>
              </>
            )}
          </Section>
        </FadeIn>

        <FadeIn delay={40}>
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

        <FadeIn delay={80}>
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

        <FadeIn delay={120}>
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

        <FadeIn delay={160}>
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

        <FadeIn delay={200}>
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
});
