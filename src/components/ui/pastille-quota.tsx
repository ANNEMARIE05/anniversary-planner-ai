import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CREDITS_GRATUITS_PAR_JOUR, labelCreditsRestants } from '@/lib/quota-cartes';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export function PastilleQuota() {
  const theme = useTheme();
  const restantes = useAnniversaireStore((s) => s.cartesRestantesAujourdhui());
  const epuise = restantes <= 0;

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: epuise ? theme.primarySoft : theme.input,
          borderColor: epuise ? theme.primary : theme.border,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: epuise ? theme.primaryDark : theme.textSecondary,
            fontFamily: Fonts.semibold,
          },
        ]}>
        {labelCreditsRestants(restantes)}
        {restantes > 0 ? ` · ${CREDITS_GRATUITS_PAR_JOUR}/jour` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
