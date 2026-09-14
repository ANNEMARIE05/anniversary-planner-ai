import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BadgeRelation } from '@/components/ui/badge-relation';
import { BadgeStatut } from '@/components/ui/badge-statut';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import {
  CarteMessageAnniversaire,
  type CarteCaptureHandle,
} from '@/components/ui/carte-message-anniversaire';
import { IconBulle } from '@/components/ui/icon-bulle';
import { LoaderIA } from '@/components/ui/loader-ia';
import {
  ModalConfirmation,
  type ConfirmationDialog,
} from '@/components/ui/modal-confirmation';
import { ModalPersonnaliserCarte } from '@/components/ui/modal-personnaliser-carte';
import { ModalPaywallCarte } from '@/components/ui/modal-paywall-carte';
import { SkeletonCarteMessage } from '@/components/ui/skeleton';
import { Radius, Spacing, EMOJIS_CARTE } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MESSAGE } from '@/lib/guides';
import { labelDestination, labelsStyles } from '@/lib/labels';
import { PastilleQuota } from '@/components/ui/pastille-quota';
import { PRIX_PACK_FCFA } from '@/lib/quota-cartes';
import { telechargerCarte } from '@/lib/telecharger-carte';
import { iaService, type GenerationProgress } from '@/services/iaService';
import { partageService } from '@/services/partageService';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import type { CartePersonnalisation, MessageGenere } from '@/types/anniversaire';

const MODIFS = [
  { id: 'plus_naturel', label: 'Rends-le plus naturel' },
  { id: 'plus_court', label: 'Rends-le plus court' },
  { id: 'plus_emotion', label: 'Ajoute plus d’émotion' },
  { id: 'plus_spirituel', label: 'Ajoute une touche spirituelle' },
  { id: 'plus_humour', label: 'Ajoute de l’humour' },
  { id: 'sans_emojis', label: 'Supprime les emojis' },
];

export default function MessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const personne = useAnniversaireStore((s) => s.personnes.find((p) => p.id === id));
  const setMessage = useAnniversaireStore((s) => s.setMessage);
  const setStatut = useAnniversaireStore((s) => s.setStatut);
  const updatePersonne = useAnniversaireStore((s) => s.updatePersonne);
  const withEmojis = useAnniversaireStore((s) => s.preferences.emojis);
  const consommerCarte = useAnniversaireStore((s) => s.consommerCarte);
  const acheterPackCartes = useAnniversaireStore((s) => s.acheterPackCartes);
  const peutGenererCarteAujourdhui = useAnniversaireStore((s) => s.peutGenererCarteAujourdhui);

  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<GenerationProgress[]>([]);
  const [variants, setVariants] = useState<MessageGenere[]>(personne?.messages ?? []);
  const [active, setActive] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(personne?.messageActuel ?? '');
  const [copied, setCopied] = useState(false);
  const [showMods, setShowMods] = useState(false);
  const [showCarteEditor, setShowCarteEditor] = useState(false);
  const [showPaywallCartes, setShowPaywallCartes] = useState(false);
  const [dialog, setDialog] = useState<ConfirmationDialog | null>(null);
  const [downloading, setDownloading] = useState(false);
  const carteRef = useRef<CarteCaptureHandle>(null);

  const restantes = useAnniversaireStore((s) => s.cartesRestantesAujourdhui());

  if (!personne) {
    return (
      <Screen title="Introuvable">
        <BoutonPrincipal label="Retour" onPress={() => router.back()} />
      </Screen>
    );
  }

  const currentText = editing ? draftText : variants[active]?.texte ?? draftText;

  const ouvrirPaywall = () => setShowPaywallCartes(true);

  const generer = async () => {
    if (!peutGenererCarteAujourdhui()) {
      ouvrirPaywall();
      return;
    }
    setLoading(true);
    setSteps([]);
    const messages = await iaService.genererMessage(personne, setSteps, { withEmojis });
    if (!consommerCarte()) {
      setLoading(false);
      ouvrirPaywall();
      return;
    }
    setVariants(messages);
    setActive(0);
    setDraftText(messages[0]?.texte ?? '');
    setMessage(personne.id, messages, messages[0]?.texte);
    setLoading(false);
  };

  const regenerer = async () => {
    if (!peutGenererCarteAujourdhui()) {
      ouvrirPaywall();
      return;
    }
    setLoading(true);
    const messages = await iaService.regenererMessage(personne, { withEmojis });
    if (!consommerCarte()) {
      setLoading(false);
      ouvrirPaywall();
      return;
    }
    setVariants(messages);
    setActive(0);
    setDraftText(messages[0]?.texte ?? '');
    setMessage(personne.id, messages, messages[0]?.texte);
    setLoading(false);
  };

  const modifier = async (instruction: string) => {
    setLoading(true);
    const texte = await iaService.modifierMessage(currentText, instruction);
    const updated = [...variants];
    if (updated[active]) {
      updated[active] = { ...updated[active], texte };
      setVariants(updated);
    }
    setDraftText(texte);
    setMessage(personne.id, updated.length ? updated : variants, texte);
    setShowMods(false);
    setLoading(false);
  };

  const copier = async () => {
    await Clipboard.setStringAsync(currentText);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore on unsupported platforms
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const saveEdit = () => {
    setEditing(false);
    const updated = [...variants];
    if (updated[active]) updated[active] = { ...updated[active], texte: draftText };
    setVariants(updated);
    updatePersonne(personne.id, {
      messageActuel: draftText,
      messages: updated,
      statut: 'pret',
    });
  };

  const saveCarte = (carte: CartePersonnalisation) => {
    updatePersonne(personne.id, { carte });
  };

  const downloadCarte = async () => {
    if (!peutGenererCarteAujourdhui()) {
      setShowPaywallCartes(true);
      return;
    }
    setDownloading(true);
    const uri = await carteRef.current?.capture();
    if (!uri) {
      setDownloading(false);
      setDialog({
        title: 'Erreur',
        message: 'Impossible de générer l’image de la carte.',
      });
      return;
    }
    const ok = consommerCarte();
    if (!ok) {
      setDownloading(false);
      setShowPaywallCartes(true);
      return;
    }
    const resultat = await telechargerCarte(uri, `Joyeux anniversaire ${personne.prenom}`);
    if (!resultat.ok && resultat.erreur) {
      setDialog(resultat.erreur);
    }
    setDownloading(false);
  };

  const marquerEnvoye = () => {
    setDialog({
      title: 'Message envoyé ?',
      message: `Confirmer que vous avez bien envoyé vos vœux à ${personne.prenom}.`,
      confirmLabel: 'Oui, c’est fait',
      cancelLabel: 'Pas encore',
      onConfirm: () => {
        setStatut(personne.id, 'envoye');
        try {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // ignore on unsupported platforms
        }
      },
    });
  };

  const dejaEnvoye = personne.statut === 'envoye';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>‹ Retour</Text>
          </Pressable>
          <BadgeStatut statut={personne.statut} />
        </View>

        {dejaEnvoye ? (
          <View
            style={[
              styles.sentBanner,
              { backgroundColor: `${theme.success}18`, borderColor: `${theme.success}44` },
            ]}>
            <AppIcon name="check" size={18} color={theme.success} />
            <Text style={{ color: theme.success, fontWeight: '700', flex: 1 }}>
              Message marqué comme envoyé
            </Text>
          </View>
        ) : null}

        <View style={styles.summary}>
          <AvatarPersonne
            prenom={personne.prenom}
            nom={personne.nom}
            photoUri={personne.photoUri}
            size={56}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.name, { color: theme.text }]}>
              {personne.prenom} {personne.nom}
            </Text>
            <BadgeRelation relation={personne.relation} custom={personne.relationPersonnalisee} />
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {labelDestination(personne.destination)} · {labelsStyles(personne.styles)}
            </Text>
          </View>
          <IconBulle name="gift" size={44} />
        </View>

        {loading ? (
          <View style={{ gap: Spacing.three }}>
            <SkeletonCarteMessage />
            <LoaderIA steps={steps.length ? steps : [{ label: 'Rédaction', done: false }]} />
          </View>
        ) : null}

        {!loading && variants.length === 0 && !personne.messageActuel ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.primarySoft }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Prêt à trouver les bons mots ?</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>
              {MESSAGE.avant}
            </Text>
            <PastilleQuota />
            <BoutonPrincipal label="Générer mon message" icon="✨" onPress={generer} />
          </View>
        ) : null}

        {!loading && (variants.length > 0 || currentText) ? (
          <Animated.View entering={FadeIn.reduceMotion(ReduceMotion.Never)} style={{ gap: Spacing.three }}>
            <CarteMessageAnniversaire
              ref={carteRef}
              prenom={personne.prenom}
              nom={personne.nom}
              message={currentText}
              photoUri={personne.photoUri}
              personalisation={personne.carte}
              onCustomize={() => setShowCarteEditor(true)}
            />

            <BoutonPrincipal
              label={downloading ? 'Préparation…' : 'Télécharger la carte'}
              iconNode={<AppIcon name="share" size={16} color="#FFF" />}
              onPress={downloadCarte}
              disabled={downloading}
            />
            <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19, textAlign: 'center' }}>
              {MESSAGE.apres}
            </Text>
            <PastilleQuota />
            {restantes <= 0 ? (
              <Text style={{ color: theme.textSecondary, fontSize: 12, textAlign: 'center' }}>
                Rechargez pour {PRIX_PACK_FCFA} FCFA et continuez vos vœux.
              </Text>
            ) : null}

            {variants.length > 1 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {variants.map((v, i) => {
                  const on = i === active;
                  return (
                    <Pressable
                      key={v.id}
                      onPress={() => {
                        setActive(i);
                        setDraftText(v.texte);
                        setEditing(false);
                      }}
                      style={[
                        styles.variantChip,
                        {
                          backgroundColor: on ? theme.primary : theme.backgroundElement,
                          borderColor: on ? theme.primary : theme.border,
                        },
                      ]}>
                      <Text style={{ color: on ? '#FFF' : theme.text, fontWeight: '600' }}>{v.variante}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            <View style={[styles.messageCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              {editing ? (
                <>
                  <TextInput
                    multiline
                    value={draftText}
                    onChangeText={setDraftText}
                    style={[styles.editor, { color: theme.text }]}
                  />
                  <View style={styles.emojiWrap}>
                    {EMOJIS_CARTE.map((e) => (
                      <Pressable
                        key={e}
                        onPress={() => setDraftText((t) => `${t}${e}`)}
                        style={[styles.emojiChip, { backgroundColor: theme.input, borderColor: theme.border }]}>
                        <Text style={styles.emoji}>{e}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={[styles.message, { color: theme.text }]}>{currentText}</Text>
              )}
            </View>

            {copied ? (
              <Text style={{ color: theme.success, fontWeight: '700', textAlign: 'center' }}>
                ✓ Message copié
              </Text>
            ) : null}

            <View style={styles.actions}>
              {editing ? (
                <BoutonPrincipal label="Enregistrer" onPress={saveEdit} />
              ) : (
                <>
                  <BoutonPrincipal label="Copier" icon="📋" onPress={copier} />
                  <View style={styles.row}>
                    <BoutonPrincipal
                      label="Modifier"
                      variant="secondary"
                      style={{ flex: 1 }}
                      onPress={() => {
                        setDraftText(currentText);
                        setEditing(true);
                      }}
                    />
                    <BoutonPrincipal
                      label="Partager"
                      variant="secondary"
                      style={{ flex: 1 }}
                      onPress={() => partageService.partagerMessage(currentText)}
                    />
                  </View>
                  <BoutonPrincipal
                    label="Personnaliser la carte"
                    iconNode={<AppIcon name="image" size={16} color={theme.primary} />}
                    variant="secondary"
                    onPress={() => setShowCarteEditor(true)}
                  />
                  <BoutonPrincipal label="Régénérer" icon="✨" variant="ghost" onPress={regenerer} />
                  <BoutonPrincipal
                    label="Modifier avec l’IA"
                    variant="ghost"
                    onPress={() => setShowMods((v) => !v)}
                  />
                  {showMods ? (
                    <View style={styles.mods}>
                      {MODIFS.map((m) => (
                        <Pressable
                          key={m.id}
                          onPress={() => modifier(m.id)}
                          style={[styles.mod, { backgroundColor: theme.primarySoft }]}>
                          <Text style={{ color: theme.primaryDark, fontWeight: '600' }}>{m.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                  {!dejaEnvoye ? (
                    <BoutonPrincipal
                      label="Marquer comme envoyé"
                      variant="secondary"
                      onPress={marquerEnvoye}
                    />
                  ) : null}
                </>
              )}
            </View>
          </Animated.View>
        ) : null}

        {!loading && variants.length === 0 && personne.messageActuel ? (
          <BoutonPrincipal label="Régénérer un nouveau message" icon="✨" onPress={generer} />
        ) : null}
      </ScrollView>

      <ModalPersonnaliserCarte
        visible={showCarteEditor}
        personne={personne}
        message={currentText}
        onClose={() => setShowCarteEditor(false)}
        onSave={saveCarte}
      />

      <ModalPaywallCarte
        visible={showPaywallCartes}
        mode="cartes"
        onClose={() => setShowPaywallCartes(false)}
        onPayer={() => {
          acheterPackCartes();
          setShowPaywallCartes(false);
          void downloadCarte();
        }}
      />

      <ModalConfirmation
        visible={!!dialog}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        destructive={dialog?.destructive}
        onClose={() => setDialog(null)}
        onConfirm={dialog?.onConfirm}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three, paddingBottom: Spacing.six },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  summary: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '800' },
  emptyCard: { borderRadius: Radius.xl, padding: Spacing.four, gap: Spacing.three },
  emptyTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    marginRight: 8,
  },
  messageCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    minHeight: 120,
  },
  message: { fontSize: 16, lineHeight: 26 },
  editor: { fontSize: 16, lineHeight: 26, minHeight: 120, textAlignVertical: 'top' },
  emojiWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  emojiChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  actions: { gap: Spacing.two },
  row: { flexDirection: 'row', gap: Spacing.two },
  mods: { gap: 8 },
  mod: { padding: 14, borderRadius: Radius.md },
  sentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
