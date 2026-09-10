import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { statutLabel } from '@/lib/labels';
import type { MessageStatut } from '@/types/anniversaire';

type Props = { statut: MessageStatut };

export function BadgeStatut({ statut }: Props) {
  const theme = useTheme();
  const ready = statut !== 'a_preparer';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: ready ? `${theme.success}22` : theme.backgroundSelected,
        },
      ]}>
      <Text style={{ fontSize: 12 }}>{ready ? '✓' : '○'}</Text>
      <Text style={[styles.text, { color: ready ? theme.success : theme.textSecondary }]}>
        {statutLabel(statut)}
      </Text>
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
