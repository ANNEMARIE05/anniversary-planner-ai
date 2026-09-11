import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { statutLabel } from '@/lib/labels';
import type { MessageStatut } from '@/types/anniversaire';

type Props = { statut: MessageStatut };

export function BadgeStatut({ statut }: Props) {
  const theme = useTheme();
  const sent = statut === 'envoye';
  const ready = statut === 'pret';
  const color = sent || ready ? theme.success : theme.textSecondary;
  const bg = sent || ready ? `${theme.success}22` : theme.backgroundSelected;
  const mark = sent ? '✓' : ready ? '●' : '○';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 12 }}>{mark}</Text>
      <Text style={[styles.text, { color }]}>{statutLabel(statut)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
