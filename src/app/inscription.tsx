import { Link, Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { FadeIn } from '@/components/ui/fade-in';
import { SelecteurDate } from '@/components/ui/selecteur-date';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function InscriptionScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const register = useAuthStore((s) => s.register);
  const onboardingDone = useAnniversaireStore((s) => s.onboardingDone);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const today = new Date();
  const [jour, setJour] = useState(today.getDate());
  const [mois, setMois] = useState(today.getMonth() + 1);
  const [annee, setAnnee] = useState(2000);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Redirect href={onboardingDone ? '/(tabs)' : '/onboarding'} />;
  }

  const submit = async () => {
    setError('');
    setLoading(true);
    const result = await register({
      prenom,
      nom,
      email,
      password,
      jourNaissance: jour,
      moisNaissance: mois,
      anneeNaissance: annee,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace(onboardingDone ? '/(tabs)' : '/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top + 12 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={[theme.gradientTop, theme.gradientMid, theme.gradientBottom]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <FadeIn style={{ alignItems: 'center' }}>
          <StickerMascotte expression="joyeux" taille={120} style={{ marginBottom: Spacing.three }} />
          <Text style={[styles.title, { color: theme.text }]}>Créer un compte</Text>
          <Text style={[styles.lead, { color: theme.textSecondary, textAlign: 'center' }]}>
            Votre date de naissance active le réseau social autour des anniversaires.
          </Text>
        </FadeIn>

        <FadeIn delay={80} style={{ gap: Spacing.three, marginTop: Spacing.four }}>
          <ChampTexte label="Prénom" placeholder="Marie" value={prenom} onChangeText={setPrenom} />
          <ChampTexte label="Nom" placeholder="Dupont" value={nom} onChangeText={setNom} />
          <SelecteurDate
            label="Date de naissance"
            hint="Indispensable pour vous connecter aux autres et célébrer ensemble."
            value={{ jour, mois, annee }}
            onChange={(v) => {
              setJour(v.jour);
              setMois(v.mois);
              if (v.annee) setAnnee(v.annee);
            }}
          />
          <ChampTexte
            label="Email"
            placeholder="vous@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <ChampTexte
            label="Mot de passe"
            placeholder="Au moins 6 caractères"
            secureTextEntry
            autoComplete="password-new"
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={[styles.error, { color: theme.primary }]}>{error}</Text> : null}

          <BoutonPrincipal
            label={loading ? 'Création…' : 'Créer mon compte'}
            onPress={submit}
            disabled={loading}
          />

          <Text style={[styles.switch, { color: theme.textSecondary }]}>
            Déjà un compte ?{' '}
            <Link href="/connexion" style={{ color: theme.primary, fontWeight: '700' }}>
              Se connecter
            </Link>
          </Text>
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  lead: { fontSize: 16, lineHeight: 24, marginTop: 6 },
  error: { fontSize: 14, fontWeight: '600' },
  switch: { textAlign: 'center', fontSize: 15, marginTop: 4 },
});
