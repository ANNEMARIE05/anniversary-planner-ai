import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { CarteMessageAnniversaire } from '@/components/ui/carte-message-anniversaire';
import { StickerTheme } from '@/components/ui/sticker-theme';
import {
  CARTE_FONDS,
  CARTE_STICKERS,
  Radius,
  resolveCarteStickers,
  Spacing,
  STICKERS_PAR_THEME,
  type CarteStickerId,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pickImageFromLibrary } from '@/lib/pick-image';
import type { CartePersonnalisation, Personne } from '@/types/anniversaire';

type Props = {
  visible: boolean;
  personne: Personne;
  message: string;
  onClose: () => void;
  onSave: (carte: CartePersonnalisation) => void;
};

const MAX_STICKERS = 4;

function buildInitial(personne: Personne, message: string): CartePersonnalisation {
  const base =
    personne.carte ?? {
      theme: 'pastel' as const,
      messagePerso: message,
      photoUri: personne.photoUri,
      showPhoto: true,
    };
  return {
    ...base,
    messagePerso: base.messagePerso ?? message,
    stickers: resolveCarteStickers(base.theme, base.stickers),
  };
}

export function ModalPersonnaliserCarte({
  visible,
  personne,
  message,
  onClose,
  onSave,
}: Props) {
  const theme = useTheme();
  const [draft, setDraft] = useState<CartePersonnalisation>(() =>
    buildInitial(personne, message),
  );

  useEffect(() => {
    if (visible) setDraft(buildInitial(personne, message));
  }, [visible, personne, message]);

  const pickPhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setDraft((d) => ({ ...d, photoUri: uri, showPhoto: true }));
  };

  const selectedStickers = draft.stickers ?? [];

  const toggleSticker = (id: CarteStickerId) => {
    setDraft((d) => {
      const current = d.stickers ?? [];
      if (current.includes(id)) {
        return { ...d, stickers: current.filter((s) => s !== id) };
      }
      if (current.length >= MAX_STICKERS) return d;
      return { ...d, stickers: [...current, id] };
    });
  };

  const applyThemePack = (themeId: (typeof CARTE_FONDS)[number]['id']) => {
    setDraft((d) => ({
      ...d,
      theme: themeId,
      stickers: [...STICKERS_PAR_THEME[themeId]],
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.title, { color: theme.text }]}>Personnaliser la carte</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <AppIcon name="x" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <CarteMessageAnniversaire
              prenom={personne.prenom}
              nom={personne.nom}
              message={draft.messagePerso || message}
              photoUri={personne.photoUri}
              personalisation={draft}
              compact
            />

            <Text style={[styles.label, { color: theme.text }]}>Fond de carte</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themes}>
              {CARTE_FONDS.map((t) => {
                const on = draft.theme === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => applyThemePack(t.id)}
                    style={[
                      styles.themeChip,
                      {
                        borderColor: on ? theme.primary : theme.border,
                        backgroundColor: on ? theme.primarySoft : theme.input,
                      },
                    ]}>
                    <Image source={t.image} style={styles.themeThumb} contentFit="cover" />
                    <Text style={{ color: theme.text, fontWeight: '600', fontSize: 12 }}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.stickerHeader}>
              <Text style={[styles.label, { color: theme.text }]}>Stickers</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                {selectedStickers.length}/{MAX_STICKERS}
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: -8 }}>
              Aux couleurs Anniv — choisissez jusqu’à {MAX_STICKERS} motifs.
            </Text>
            <View style={styles.stickerGrid}>
              {CARTE_STICKERS.map((s) => {
                const on = selectedStickers.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleSticker(s.id)}
                    style={[
                      styles.stickerChip,
                      {
                        borderColor: on ? theme.primary : theme.border,
                        backgroundColor: on ? theme.primarySoft : theme.input,
                      },
                    ]}>
                    <StickerTheme id={s.id} size={44} />
                    <Text
                      style={{
                        color: on ? theme.primaryDark : theme.text,
                        fontWeight: '600',
                        fontSize: 12,
                      }}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Message sur la carte</Text>
            <TextInput
              multiline
              value={draft.messagePerso ?? ''}
              onChangeText={(text) => setDraft((d) => ({ ...d, messagePerso: text }))}
              placeholder={message || 'Écrivez votre message…'}
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />

            <View style={styles.photoRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.text, marginBottom: 4 }]}>
                  Photo ronde au centre
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Elle s’affiche au milieu de la carte.
                </Text>
              </View>
              <Switch
                value={draft.showPhoto}
                onValueChange={(v) => setDraft((d) => ({ ...d, showPhoto: v }))}
                trackColor={{ true: theme.primary, false: theme.border }}
              />
            </View>

            {draft.showPhoto ? (
              <View style={styles.photoActions}>
                {draft.photoUri ? (
                  <Image source={{ uri: draft.photoUri }} style={styles.preview} />
                ) : null}
                <BoutonPrincipal
                  label={draft.photoUri ? 'Changer la photo' : 'Ajouter une photo'}
                  iconNode={<AppIcon name="camera" size={16} color="#FFF" />}
                  onPress={pickPhoto}
                />
              </View>
            ) : null}

            <BoutonPrincipal
              label="Enregistrer la carte"
              onPress={() => {
                onSave(draft);
                onClose();
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '94%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  title: { fontSize: 20, fontWeight: '800' },
  body: { gap: Spacing.three, paddingBottom: Spacing.six },
  label: { fontSize: 15, fontWeight: '700' },
  themes: { gap: 10, paddingVertical: 4 },
  themeChip: {
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    marginRight: 8,
    width: 110,
  },
  themeThumb: {
    width: 92,
    height: 70,
    borderRadius: 10,
  },
  stickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stickerChip: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.three,
    minHeight: 100,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  photoActions: { gap: Spacing.two, alignItems: 'center' },
  preview: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#F15B62',
  },
});
