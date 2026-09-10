import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { emojiRelation, labelRelation } from '@/lib/labels';
import type { RelationId } from '@/types/anniversaire';

type Props = {
  relation: RelationId;
  custom?: string;
};

export function BadgeRelation({ relation, custom }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
      <Text style={styles.emoji}>{emojiRelation(relation)}</Text>
      <Text style={[styles.text, { color: theme.primaryDark }]}>
        {labelRelation(relation, custom)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  emoji: { fontSize: 13 },
  text: { fontSize: 13, fontWeight: '600' },
});
