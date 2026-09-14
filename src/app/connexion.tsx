import { Link, Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/app-icon';
import { LogoApp } from '@/components/ui/logo-app';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { FadeIn } from '@/components/ui/fade-in';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SLOGAN_APP } from '@/lib/brand';
import { AUTH } from '@/lib/guides';
import { useAuthStore } from '@/store/auth-store';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function ConnexionScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const onboardingDone = useAnniversaireStore((s) => s.onboardingDone);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Redirect href={onboardingDone ? '/(tabs)' : '/onboarding'} />;
  }

  const submit = async () => {
    setError('');
    setLoading(true);
    const result = await login(email, password);
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
          <LogoApp variant="complet" size={168} style={{ marginBottom: Spacing.two }} />
          <Text style={[styles.slogan, { color: theme.textSecondary }]}>{SLOGAN_APP}</Text>
          <Text style={[styles.title, { color: theme.text }]}>Heureux de vous revoir</Text>
          <Text style={[styles.lead, { color: theme.textSecondary, textAlign: 'center' }]}>
            {AUTH.connexion}
          </Text>
        </FadeIn>

        <FadeIn delay={80} style={{ gap: Spacing.three, marginTop: Spacing.four }}>
          <ChampTexte
            label="Email"
            placeholder="vous@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <View>
            <ChampTexte
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eye}
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <AppIcon name={showPassword ? 'eye-off' : 'eye'} size={18} color={theme.textSecondary} />
            </Pressable>
          </View>

          {error ? <Text style={[styles.error, { color: theme.primary }]}>{error}</Text> : null}

          <BoutonPrincipal label={loading ? 'Connexion…' : 'Se connecter'} onPress={submit} disabled={loading} />

          <Text style={[styles.switch, { color: theme.textSecondary }]}>
            Pas encore de compte ?{' '}
            <Link href="/inscription" style={{ color: theme.primary, fontWeight: '700' }}>
              S’inscrire
            </Link>
          </Text>
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: Spacing.four, paddingTop: Spacing.five },
  slogan: { fontSize: 13, fontFamily: Fonts.medium, marginTop: 2 },
  title: { fontSize: 28, fontFamily: Fonts.extraBold, letterSpacing: -0.8, marginTop: 16, textAlign: 'center' },
  lead: { fontSize: 15, lineHeight: 22, marginTop: 6, fontFamily: Fonts.regular },
  eye: { position: 'absolute', right: 16, top: 42, padding: 4 },
  error: { fontSize: 14, fontWeight: '600' },
  switch: { textAlign: 'center', fontSize: 15, marginTop: 4 },
});
