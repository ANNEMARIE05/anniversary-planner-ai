import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  CREDITS_PAR_PACK,
  FONDS_PAR_PACK,
  PRIX_PACK_FCFA,
} from '@/lib/quota-cartes';

type Mode = 'cartes' | 'fond';

type Props = {
  visible: boolean;
  mode?: Mode;
  onClose: () => void;
  /** Paiement mock réussi */
  onPayer: () => void;
};

export function ModalPaywallCarte({ visible, mode = 'cartes', onClose, onPayer }: Props) {
  const theme = useTheme();
  const isFond = mode === 'fond';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
          <Pressable onPress={onClose} style={styles.close} hitSlop={12}>
            <AppIcon name="x" size={20} color={theme.textSecondary} />
          </Pressable>

          <StickerMascotte expression="fete" taille={112} />

          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.extraBold }]}>
            {isFond ? 'Ajouter vos cartes' : 'Quota du jour atteint'}
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: Fonts.regular }]}>
            {isFond
              ? `Votre première carte perso est offerte. Ensuite, ${PRIX_PACK_FCFA} FCFA débloquent ${FONDS_PAR_PACK} nouveaux fonds photo.`
              : `Vous avez utilisé vos souhaits gratuits. Pour ${PRIX_PACK_FCFA} FCFA, rechargez ${CREDITS_PAR_PACK} messages ou cartes.`}
          </Text>

          <View style={[styles.priceBox, { backgroundColor: theme.primarySoft, borderColor: theme.border }]}>
            <Text style={[styles.price, { color: theme.primaryDark, fontFamily: Fonts.extraBold }]}>
              {PRIX_PACK_FCFA} FCFA
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center', fontFamily: Fonts.medium }}>
              {isFond ? `${FONDS_PAR_PACK} cartes perso` : `${CREDITS_PAR_PACK} souhaits`}
            </Text>
          </View>

          <BoutonPrincipal
            label={
              isFond
                ? `Payer ${PRIX_PACK_FCFA} FCFA — ${FONDS_PAR_PACK} cartes`
                : `Payer ${PRIX_PACK_FCFA} FCFA — ${CREDITS_PAR_PACK} souhaits`
            }
            onPress={onPayer}
          />
          <BoutonPrincipal label="Plus tard" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

/** Aperçu miniature d’un fond perso (photo importée). */
export function FondPersoThumb({ uri, size = 70 }: { uri: string; size?: number }) {
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size * 0.76, borderRadius: 10 }}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  close: { position: 'absolute', top: 16, right: 16, zIndex: 2 },
  title: { fontSize: 22, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  priceBox: {
    width: '100%',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  price: { fontSize: 28 },
});
