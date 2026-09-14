import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ConfirmationDialog = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
};

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export function ModalConfirmation({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Annuler',
  destructive,
  onClose,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const hasChoice = Boolean(onConfirm);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
          <Pressable onPress={onClose} style={styles.close} hitSlop={12}>
            <AppIcon name="x" size={20} color={theme.textSecondary} />
          </Pressable>

          <View
            style={[
              styles.iconWrap,
              { backgroundColor: destructive ? `${theme.primary}18` : theme.primarySoft },
            ]}>
            <AppIcon
              name={destructive ? 'x' : hasChoice ? 'bell' : 'check'}
              size={22}
              color={theme.primary}
            />
          </View>

          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.extraBold }]}>
            {title}
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: Fonts.regular }]}>
            {message}
          </Text>

          {hasChoice ? (
            <>
              <BoutonPrincipal
                label={confirmLabel}
                onPress={() => {
                  onClose();
                  onConfirm?.();
                }}
              />
              <BoutonPrincipal label={cancelLabel} variant="ghost" onPress={onClose} />
            </>
          ) : (
            <BoutonPrincipal label={confirmLabel} onPress={onClose} />
          )}
        </View>
      </View>
    </Modal>
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
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: { fontSize: 22, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
