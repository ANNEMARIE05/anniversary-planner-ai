import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoutonProfil } from '@/components/ui/bouton-profil';
import { FondAnime } from '@/components/ui/fond-anime';
import { Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
  tabSafe?: boolean;
  right?: React.ReactNode;
  showProfile?: boolean;
  gradient?: boolean;
};

export function Screen({
  title,
  subtitle,
  tabSafe,
  right,
  showProfile,
  gradient = true,
  style,
  children,
  ...rest
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const profileVisible = showProfile ?? !!(tabSafe && title);
  const showHeader = !!(title || subtitle || right || profileVisible);

  const bottomPad = tabSafe ? Spacing.two : insets.bottom + Spacing.one;

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
      {gradient ? (
        <>
          <LinearGradient
            colors={[theme.gradientTop, theme.gradientMid, theme.gradientBottom]}
            locations={[0, 0.42, 1]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[theme.gradientBlob, 'transparent', theme.gradientBlobWarm]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0.15 }}
            end={{ x: 1, y: 0.9 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <FondAnime />
        </>
      ) : null}
      <View style={styles.inner}>
        {showHeader ? (
          <View style={styles.header}>
            <View style={styles.headerText}>
              {title ? (
                <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.extraBold }]}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.regular }]}>
                  {subtitle}
                </Text>
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
  title: { fontSize: 30, letterSpacing: -0.8 },
  subtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
});
