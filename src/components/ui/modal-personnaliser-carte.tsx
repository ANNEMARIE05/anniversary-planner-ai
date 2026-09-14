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
import { FondPersoThumb, ModalPaywallCarte } from '@/components/ui/modal-paywall-carte';
import { FormeApercu, PhotoMasquee } from '@/components/ui/photo-masquee';
import { StickerTheme } from '@/components/ui/sticker-theme';
import {
  CARTE_FONDS,
  CARTE_FORMES,
  CARTE_STICKERS,
  CARTE_TEXT_COLORS,
  EMOJIS_CARTE,
  PHOTO_FORMES,
  Radius,
  Spacing,
  STICKER_SLOTS,
  type CarteFormeId,
  type CarteStickerId,
  type CarteThemeId,
  type PhotoFormeId,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pickImageFromLibrary } from '@/lib/pick-image';
import {
  FONDS_PAR_PACK,
  FONDS_PERSO_OFFERTS,
  PRIX_PACK_FCFA,
  peutAjouterFondPerso,
} from '@/lib/quota-cartes';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import type { CartePersonnalisation, Personne } from '@/types/anniversaire';

type Props = {
  visible: boolean;
  personne: Personne;
  message: string;
  onClose: () => void;
  onSave: (carte: CartePersonnalisation) => void;
};

const MAX_STICKERS = 4;
type Onglet = 'fond' | 'stickers' | 'photos' | 'message';

function emptyPhotoSlots(): (string | null)[] {
  return Array.from({ length: STICKER_SLOTS.length }, () => null);
}

function buildInitial(personne: Personne, message: string): CartePersonnalisation {
  const base =
    personne.carte ?? {
      theme: 'pastel' as const,
      messagePerso: message,
      photoUri: personne.photoUri,
      showPhoto: true,
    };
  const photos = base.photoStickers?.length
    ? [...base.photoStickers, ...emptyPhotoSlots()].slice(0, MAX_STICKERS)
    : emptyPhotoSlots();
  return {
    ...base,
    messagePerso: base.messagePerso ?? message,
    photoUri: base.photoUri ?? personne.photoUri,
    carteForme: base.carteForme ?? 'arrondie',
    photoForme: base.photoForme ?? 'cercle',
    photoStickersForme: base.photoStickersForme ?? 'cercle',
    stickers: base.stickers ?? [],
    photoStickers: photos,
    titre: base.titre,
    signature: base.signature ?? '',
    couleurTitre: base.couleurTitre,
    couleurNom: base.couleurNom,
    couleurMessage: base.couleurMessage,
    couleurSignature: base.couleurSignature,
    titreGras: base.titreGras,
    messageGras: base.messageGras,
  };
}

function ColorRow({
  value,
  onChange,
}: {
  value?: string;
  onChange: (color: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.colorRow}>
      {CARTE_TEXT_COLORS.map((c) => {
        const hex = c.hex;
        const on = value === hex;
        return (
          <Pressable
            key={c.id}
            onPress={() => onChange(hex)}
            accessibilityLabel={c.label}
            style={[
              styles.colorDot,
              {
                backgroundColor: hex,
                borderColor: on ? theme.primary : hex === '#FFFFFF' ? theme.border : hex,
              },
              on && styles.colorDotOn,
            ]}
          />
        );
      })}
    </View>
  );
}

function EmojiRow({ onPick }: { onPick: (emoji: string) => void }) {
  const theme = useTheme();
  return (
    <View style={styles.emojiWrap}>
      {EMOJIS_CARTE.map((e) => (
        <Pressable
          key={e}
          onPress={() => onPick(e)}
          style={[styles.emojiChip, { backgroundColor: theme.input, borderColor: theme.border }]}>
          <Text style={styles.emoji}>{e}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ModalPersonnaliserCarte({
  visible,
  personne,
  message,
  onClose,
  onSave,
}: Props) {
  const theme = useTheme();
  const prefs = useAnniversaireStore((s) => s.preferences);
  const acheterFondPerso = useAnniversaireStore((s) => s.acheterFondPerso);
  const ajouterFondPersoUri = useAnniversaireStore((s) => s.ajouterFondPersoUri);
  const [draft, setDraft] = useState<CartePersonnalisation>(() =>
    buildInitial(personne, message),
  );
  const [onglet, setOnglet] = useState<Onglet>('fond');
  const [paywallFond, setPaywallFond] = useState(false);

  useEffect(() => {
    if (visible) {
      setDraft(buildInitial(personne, message));
      setOnglet('fond');
    }
  }, [visible, personne, message]);

  const pickPhoto = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setDraft((d) => ({ ...d, photoUri: uri, showPhoto: true }));
  };

  const selectedStickers = draft.stickers ?? [];
  const photoSlots = draft.photoStickers ?? emptyPhotoSlots();
  const fondsPerso = prefs.fondsPersoUris ?? [];
  const peutAjouterFond = peutAjouterFondPerso(fondsPerso.length, prefs.fondsPersoDebloques);

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

  const applyThemePack = (themeId: Exclude<CarteThemeId, 'perso'>) => {
    setDraft((d) => ({
      ...d,
      theme: themeId,
      fondPersoUri: undefined,
    }));
  };

  const insertEmoji = (field: 'messagePerso' | 'signature', emoji: string) => {
    setDraft((d) => ({
      ...d,
      [field]: `${d[field] ?? ''}${emoji}`,
    }));
  };

  const applyFondPerso = (uri: string) => {
    setDraft((d) => ({
      ...d,
      theme: 'perso',
      fondPersoUri: uri,
    }));
  };

  const demanderNouveauFond = async () => {
    if (!peutAjouterFond) {
      setPaywallFond(true);
      return;
    }
    const uri = await pickImageFromLibrary();
    if (!uri) return;
    ajouterFondPersoUri(uri);
    applyFondPerso(uri);
  };

  const setPhotoSlot = async (index: number) => {
    const uri = await pickImageFromLibrary();
    if (!uri) return;
    setDraft((d) => {
      const next = [...(d.photoStickers ?? emptyPhotoSlots())];
      next[index] = uri;
      return { ...d, photoStickers: next.slice(0, MAX_STICKERS) };
    });
  };

  const clearPhotoSlot = (index: number) => {
    setDraft((d) => {
      const next = [...(d.photoStickers ?? emptyPhotoSlots())];
      next[index] = null;
      return { ...d, photoStickers: next };
    });
  };

  const tabs: { id: Onglet; label: string }[] = [
    { id: 'fond', label: 'Fond' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'photos', label: 'Photos' },
    { id: 'message', label: 'Message' },
  ];

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

          <View style={[styles.tabs, { backgroundColor: theme.input, borderColor: theme.border }]}>
            {tabs.map((t) => {
              const on = onglet === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setOnglet(t.id)}
                  style={[
                    styles.tab,
                    on && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <Text
                    style={{
                      color: on ? theme.primaryDark : theme.textSecondary,
                      fontWeight: on ? '800' : '600',
                      fontSize: 13,
                    }}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <CarteMessageAnniversaire
              prenom={personne.prenom}
              nom={personne.nom}
              message={draft.messagePerso || message}
              photoUri={draft.photoUri || personne.photoUri}
              personalisation={draft}
              compact
            />

            {onglet === 'fond' ? (
              <View style={{ gap: Spacing.two }}>
                <Text style={[styles.label, { color: theme.text }]}>Forme de la carte</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Arrondie, rectangulaire ou angles nets.
                </Text>
                <View style={styles.formeGrid}>
                  {CARTE_FORMES.map((f) => {
                    const on = (draft.carteForme ?? 'arrondie') === f.id;
                    return (
                      <Pressable
                        key={f.id}
                        onPress={() =>
                          setDraft((d) => ({ ...d, carteForme: f.id as CarteFormeId }))
                        }
                        style={[
                          styles.carteFormeChip,
                          {
                            borderColor: on ? theme.primary : theme.border,
                            backgroundColor: on ? theme.primarySoft : theme.input,
                          },
                        ]}>
                        <View
                          style={[
                            styles.carteFormeApercu,
                            {
                              borderRadius: Math.min(f.radius, 18),
                              borderColor: on ? theme.primary : theme.textSecondary,
                              backgroundColor: on ? theme.primary : theme.border,
                            },
                          ]}
                        />
                        <Text
                          style={{
                            color: on ? theme.primaryDark : theme.text,
                            fontWeight: '600',
                            fontSize: 11,
                            textAlign: 'center',
                          }}>
                          {f.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.label, { color: theme.text }]}>Fond de carte</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.themes}>
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
                        <Text style={{ color: theme.text, fontWeight: '600', fontSize: 12 }}>
                          {t.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {fondsPerso.map((uri) => {
                    const on = draft.theme === 'perso' && draft.fondPersoUri === uri;
                    return (
                      <Pressable
                        key={uri}
                        onPress={() => applyFondPerso(uri)}
                        style={[
                          styles.themeChip,
                          {
                            borderColor: on ? theme.primary : theme.border,
                            backgroundColor: on ? theme.primarySoft : theme.input,
                          },
                        ]}>
                        <FondPersoThumb uri={uri} size={92} />
                        <Text style={{ color: theme.text, fontWeight: '600', fontSize: 12 }}>
                          Ma photo
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable
                    onPress={demanderNouveauFond}
                    style={[
                      styles.themeChip,
                      styles.addChip,
                      { borderColor: theme.border, backgroundColor: theme.input },
                    ]}>
                    <AppIcon name="camera" size={22} color={theme.primary} />
                    <Text style={{ color: theme.primaryDark, fontWeight: '700', fontSize: 12 }}>
                      {peutAjouterFond ? 'Ma carte' : `${PRIX_PACK_FCFA} F`}
                    </Text>
                  </Pressable>
                </ScrollView>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  3 fonds Souhait + {FONDS_PERSO_OFFERTS} carte perso offerte. Ensuite :{' '}
                  {PRIX_PACK_FCFA} FCFA pour {FONDS_PAR_PACK} fonds photo.
                </Text>
                {!peutAjouterFond ? (
                  <BoutonPrincipal
                    label={`${PRIX_PACK_FCFA} FCFA — ${FONDS_PAR_PACK} cartes perso`}
                    variant="secondary"
                    onPress={() => setPaywallFond(true)}
                  />
                ) : null}
              </View>
            ) : null}

            {onglet === 'stickers' ? (
              <View style={{ gap: Spacing.two }}>
                <View style={styles.stickerHeader}>
                  <Text style={[styles.label, { color: theme.text }]}>Stickers</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                    {selectedStickers.length}/{MAX_STICKERS}
                  </Text>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Choisissez jusqu’à {MAX_STICKERS} motifs (coins de la carte).
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
              </View>
            ) : null}

            {onglet === 'photos' ? (
              <View style={{ gap: Spacing.two }}>
                <Text style={[styles.label, { color: theme.text }]}>Photos aux coins</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Importez jusqu’à {MAX_STICKERS} photos gratuites pour décorer les 4 coins.
                </Text>
                <View style={styles.photoSlots}>
                  {photoSlots.map((uri, index) => (
                    <View
                      key={`slot-${index}`}
                      style={[
                        styles.photoSlot,
                        { borderColor: theme.border, backgroundColor: theme.input },
                      ]}>
                      {uri ? (
                        <>
                          <Image source={{ uri }} style={styles.slotImg} contentFit="cover" />
                          <Pressable
                            onPress={() => clearPhotoSlot(index)}
                            style={[styles.slotClear, { backgroundColor: theme.primary }]}>
                            <AppIcon name="x" size={12} color="#FFF" />
                          </Pressable>
                        </>
                      ) : (
                        <Pressable onPress={() => setPhotoSlot(index)} style={styles.slotEmpty}>
                          <AppIcon name="camera" size={20} color={theme.primary} />
                          <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '600' }}>
                            Coin {index + 1}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>

                <Text style={[styles.label, { color: theme.text }]}>Forme des photos aux coins</Text>
                <View style={styles.formeGrid}>
                  {PHOTO_FORMES.map((f) => {
                    const on = (draft.photoStickersForme ?? 'cercle') === f.id;
                    return (
                      <Pressable
                        key={`coin-${f.id}`}
                        onPress={() =>
                          setDraft((d) => ({ ...d, photoStickersForme: f.id as PhotoFormeId }))
                        }
                        style={[
                          styles.formeChip,
                          {
                            borderColor: on ? theme.primary : theme.border,
                            backgroundColor: on ? theme.primarySoft : theme.input,
                          },
                        ]}>
                        <FormeApercu
                          forme={f.id}
                          size={28}
                          color={on ? theme.primary : theme.textSecondary}
                        />
                        <Text
                          style={{
                            color: on ? theme.primaryDark : theme.text,
                            fontWeight: '600',
                            fontSize: 11,
                          }}>
                          {f.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.photoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: theme.text, marginBottom: 4 }]}>
                      Photo au centre
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
                  <>
                    <Text style={[styles.label, { color: theme.text }]}>Forme de la photo centrale</Text>
                    <View style={styles.formeGrid}>
                      {PHOTO_FORMES.map((f) => {
                        const on = (draft.photoForme ?? 'cercle') === f.id;
                        return (
                          <Pressable
                            key={`centre-${f.id}`}
                            onPress={() =>
                              setDraft((d) => ({ ...d, photoForme: f.id as PhotoFormeId }))
                            }
                            style={[
                              styles.formeChip,
                              {
                                borderColor: on ? theme.primary : theme.border,
                                backgroundColor: on ? theme.primarySoft : theme.input,
                              },
                            ]}>
                            <FormeApercu
                              forme={f.id}
                              size={28}
                              color={on ? theme.primary : theme.textSecondary}
                            />
                            <Text
                              style={{
                                color: on ? theme.primaryDark : theme.text,
                                fontWeight: '600',
                                fontSize: 11,
                              }}>
                              {f.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    <View style={styles.photoActions}>
                      {draft.photoUri ? (
                        <PhotoMasquee
                          uri={draft.photoUri}
                          size={88}
                          forme={draft.photoForme ?? 'cercle'}
                          borderColor={theme.primary}
                          borderWidth={2}
                        />
                      ) : null}
                      <BoutonPrincipal
                        label={draft.photoUri ? 'Changer la photo' : 'Ajouter une photo'}
                        iconNode={<AppIcon name="camera" size={16} color="#FFF" />}
                        onPress={pickPhoto}
                      />
                    </View>
                  </>
                ) : null}
              </View>
            ) : null}

            {onglet === 'message' ? (
              <View style={{ gap: Spacing.three }}>
                <Text style={[styles.label, { color: theme.text }]}>Titre</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Laissez vide pour le masquer. Rien n’est imposé.
                </Text>
                <TextInput
                  value={draft.titre ?? 'Joyeux anniversaire'}
                  onChangeText={(text) => setDraft((d) => ({ ...d, titre: text }))}
                  placeholder="Joyeux anniversaire"
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.inputSingle,
                    {
                      backgroundColor: theme.input,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                />
                <ColorRow
                  value={draft.couleurTitre}
                  onChange={(couleurTitre) => setDraft((d) => ({ ...d, couleurTitre }))}
                />
                <Pressable
                  onPress={() =>
                    setDraft((d) => ({ ...d, titreGras: d.titreGras === false }))
                  }
                  style={[
                    styles.toggleChip,
                    {
                      borderColor: draft.titreGras !== false ? theme.primary : theme.border,
                      backgroundColor:
                        draft.titreGras !== false ? theme.primarySoft : theme.input,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: draft.titreGras !== false ? '800' : '500',
                    }}>
                    Titre en gras
                  </Text>
                </Pressable>

                <Text style={[styles.label, { color: theme.text }]}>Message</Text>
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
                <EmojiRow onPick={(e) => insertEmoji('messagePerso', e)} />
                <ColorRow
                  value={draft.couleurMessage}
                  onChange={(couleurMessage) => setDraft((d) => ({ ...d, couleurMessage }))}
                />
                <Pressable
                  onPress={() => setDraft((d) => ({ ...d, messageGras: !d.messageGras }))}
                  style={[
                    styles.toggleChip,
                    {
                      borderColor: draft.messageGras ? theme.primary : theme.border,
                      backgroundColor: draft.messageGras ? theme.primarySoft : theme.input,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: draft.messageGras ? '800' : '500',
                    }}>
                    Message en gras
                  </Text>
                </Pressable>

                <Text style={[styles.label, { color: theme.text }]}>Nom</Text>
                <ColorRow
                  value={draft.couleurNom}
                  onChange={(couleurNom) => setDraft((d) => ({ ...d, couleurNom }))}
                />

                <Text style={[styles.label, { color: theme.text }]}>Signature (optionnelle)</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Ajoutez la vôtre si vous voulez. Sinon, rien n’apparaît.
                </Text>
                <TextInput
                  value={draft.signature ?? ''}
                  onChangeText={(text) => setDraft((d) => ({ ...d, signature: text }))}
                  placeholder="Ex. Avec tout mon amour, Marie"
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.inputSingle,
                    {
                      backgroundColor: theme.input,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                />
                <EmojiRow onPick={(e) => insertEmoji('signature', e)} />
                <ColorRow
                  value={draft.couleurSignature}
                  onChange={(couleurSignature) => setDraft((d) => ({ ...d, couleurSignature }))}
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

      <ModalPaywallCarte
        visible={paywallFond}
        mode="fond"
        onClose={() => setPaywallFond(false)}
        onPayer={async () => {
          acheterFondPerso();
          setPaywallFond(false);
          const uri = await pickImageFromLibrary();
          if (!uri) return;
          ajouterFondPersoUri(uri);
          applyFondPerso(uri);
        }}
      />
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
    marginBottom: Spacing.one,
  },
  title: { fontSize: 20, fontWeight: '800' },
  tabs: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    borderWidth: 1,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
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
  addChip: {
    justifyContent: 'center',
    minHeight: 110,
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
  photoSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoSlot: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  slotImg: { width: '100%', height: '100%' },
  slotEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  slotClear: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.three,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  inputSingle: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  toggleChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 2,
  },
  colorDotOn: {
    transform: [{ scale: 1.12 }],
  },
  emojiWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 20 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  photoActions: { gap: Spacing.two, alignItems: 'center' },
  formeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formeChip: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  carteFormeChip: {
    width: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  carteFormeApercu: {
    width: 36,
    height: 48,
    borderWidth: 2,
  },
});
