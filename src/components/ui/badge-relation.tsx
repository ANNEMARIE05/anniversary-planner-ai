import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { iconRelation, labelRelation } from '@/lib/labels';
import type { RelationId } from '@/types/anniversaire';

type Props = {
  relation: RelationId;
  custom?: string;
};

export function BadgeRelation({ relation, custom }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
      <AppIcon name={iconRelation(relation)} size={13} color={theme.primary} />
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
  text: { fontSize: 13, fontWeight: '600' },
});
