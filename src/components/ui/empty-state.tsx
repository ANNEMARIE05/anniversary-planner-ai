import { StyleSheet, Text, View } from 'react-native';

import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { OrnementFete } from '@/components/ui/ornement-fete';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  emoji?: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  /** @deprecated — plus de mascotte, ornement chic à la place */
  mascotte?: boolean;
};

export function EmptyState({ title, subtitle, actionLabel, onAction, mascotte = true }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {mascotte ? <OrnementFete variant="mark" size={72} tone="brand" /> : null}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      {actionLabel && onAction ? (
        <BoutonPrincipal
          label={actionLabel}
          icon="+"
          onPress={onAction}
          style={{ marginTop: 8, alignSelf: 'stretch' }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
