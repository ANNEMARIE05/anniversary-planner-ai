import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GuideId } from '@/lib/guides';
import { useAnniversaireStore } from '@/store/anniversaire-store';

import { BoutonPrincipal } from './bouton-principal';

type Props = {
  id: GuideId;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Carte de première visite, même langage sur tous les onglets. Disparaît après « Compris ». */
export function CarteGuide({ id, title, text, actionLabel, onAction }: Props) {
  const theme = useTheme();
  const vu = useAnniversaireStore((s) => s.guidesVus[id]);
  const marquerGuideVu = useAnniversaireStore((s) => s.marquerGuideVu);

  if (vu) return null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.primarySoft, borderColor: theme.border },
      ]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>{text}</Text>
      <View style={styles.actions}>
        {actionLabel && onAction ? (
          <BoutonPrincipal
            label={actionLabel}
            onPress={() => {
              marquerGuideVu(id);
              onAction();
            }}
            style={styles.btn}
          />
        ) : null}
        <Pressable
          onPress={() => marquerGuideVu(id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Masquer cette aide"
          style={[
            styles.dismiss,
            actionLabel ? styles.dismissBeside : styles.dismissAlone,
          ]}>
          <Text style={[styles.dismissLabel, { color: theme.primary }]}>Compris</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: '800' },
  text: { fontSize: 14, lineHeight: 20 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 4,
  },
  btn: { flex: 1, minHeight: 44 },
  dismiss: { paddingVertical: 10, paddingHorizontal: 4 },
  dismissBeside: { flexShrink: 0 },
  dismissAlone: { alignSelf: 'flex-start' },
  dismissLabel: { fontSize: 14, fontWeight: '700' },
});
