import { Platform, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoutonProfil } from '@/components/ui/bouton-profil';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
  tabSafe?: boolean;
  right?: React.ReactNode;
  /** Affiche l’icône profil (défaut : oui sur les onglets avec titre). */
  showProfile?: boolean;
};

export function Screen({
  title,
  subtitle,
  tabSafe,
  right,
  showProfile,
  style,
  children,
  ...rest
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Sur Accueil (sans titre), le profil est dans le contenu — évite une rangée orpheline trop haute.
  const profileVisible = showProfile ?? !!(tabSafe && title);
  const showHeader = !!(title || subtitle || right || profileVisible);

  // NativeTabs gère déjà l’inset bas sur iOS/Android ; seul le web (tabs absolute) en a besoin.
  const bottomPad = tabSafe
    ? Platform.OS === 'web'
      ? BottomTabInset
      : 0
    : insets.bottom + Spacing.one;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + Spacing.one,
          paddingBottom: bottomPad,
        },
        style,
      ]}
      {...rest}>
      <View style={styles.inner}>
        {showHeader ? (
          <View style={styles.header}>
            <View style={styles.headerText}>
              {title ? <Text style={[styles.title, { color: theme.text }]}>{title}</Text> : null}
              {subtitle ? (
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
              ) : null}
            </View>
            <View style={styles.headerActions}>
              {right}
              {profileVisible ? <BoutonProfil /> : null}
            </View>
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 15, marginTop: 4, lineHeight: 21 },
});
