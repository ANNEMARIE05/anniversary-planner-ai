import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInRight, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BadgeRelation } from '@/components/ui/badge-relation';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import {
  ModalConfirmation,
  type ConfirmationDialog,
} from '@/components/ui/modal-confirmation';
import { ProgressionEtapes } from '@/components/ui/progression-etapes';
import { SelecteurDate } from '@/components/ui/selecteur-date';
import { SelecteurOptions } from '@/components/ui/selecteur-options';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AJOUT } from '@/lib/guides';
import {
  daysUntil,
  formatDateAnniv,
  inferContexte,
  inferTon,
  labelCountdown,
  labelDestination,
  labelLongueur,
  labelsStyles,
} from '@/lib/labels';
import { pickImageFromLibrary } from '@/lib/pick-image';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import {
  DESTINATIONS,
  LONGUEURS,
  RELATIONS,
  STYLES_MESSAGE,
  type DestinationId,
  type LongueurId,
  type PersonneDraft,
  type RelationId,
  type StyleMessageId,
} from '@/types/anniversaire';

const TOTAL = 4;

const emptyDraft: PersonneDraft = {
  prenom: '',
  nom: '',
  mois: new Date().getMonth() + 1,
  jour: new Date().getDate(),
  relation: 'ami_proche',
  destination: 'whatsapp_prive',
  contexte: 'ami_proche',
  description: '',
  styles: ['chaleureux'],
  ton: 'amical',
  longueur: 'moyen',
  rappels: { j7: true, j3: false, j1: true, j0: true, heure: '09:00' },
};

const RAPPEL_ITEMS = [
  { key: 'j7', label: '7 jours avant', short: 'J-7' },
  { key: 'j3', label: '3 jours avant', short: 'J-3' },
  { key: 'j1', label: '1 jour avant', short: 'J-1' },
  { key: 'j0', label: 'Le jour même', short: 'Jour J' },
] as const;

export default function AjouterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addPersonne = useAnniversaireStore((s) => s.addPersonne);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<PersonneDraft>(emptyDraft);
  const [savedName, setSavedName] = useState('');
  const [dialog, setDialog] = useState<ConfirmationDialog | null>(null);

  const patch = (p: Partial<PersonneDraft>) => setDraft((d) => ({ ...d, ...p }));

  const canNext = useMemo(() => {
    if (step === 1) {
      return (
        draft.prenom.trim().length > 0 &&
        draft.jour >= 1 &&
        draft.jour <= 31 &&
        draft.mois >= 1 &&
        draft.mois <= 12
      );
    }
    if (step === 2) {
      return Boolean(draft.relation) && Boolean(draft.destination);
    }
    if (step === 3) {
      return draft.styles.length > 0;
    }
    return true;
  }, [step, draft]);

  const next = () => {
    if (!canNext) {
      if (step === 1 && !draft.prenom.trim()) {
        setDialog({
          title: 'Prénom requis',
          message: 'Veuillez saisir au moins le prénom de la personne.',
        });
        return;
      }
      if (step === 3 && draft.styles.length === 0) {
        setDialog({
          title: 'Style requis',
          message: 'Choisissez au moins une ambiance pour vos vœux.',
        });
        return;
      }
      setDialog({
        title: 'Presque',
        message: 'Complétez les informations requises pour continuer.',
      });
      return;
    }
    if (step < TOTAL) setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 1) router.back();
    else setStep((s) => s - 1);
  };

  const save = () => {
    const id = addPersonne(draft);
    setSavedName(draft.prenom);
    setStep(TOTAL + 1);
    setTimeout(() => router.replace(`/personne/${id}`), 1400);
  };

  const days = daysUntil(draft.jour, draft.mois);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top + 8 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <View style={styles.topBar}>
          <Pressable onPress={back} hitSlop={10} style={styles.backButton}>
            <AppIcon name="chevron-left" size={20} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>
              {step === 1 ? 'Annuler' : 'Précédent'}
            </Text>
          </Pressable>
          {step <= TOTAL ? (
            <View style={styles.progressWrap}>
              <ProgressionEtapes step={step} total={TOTAL} />
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View key={step} entering={FadeInRight.duration(260).reduceMotion(ReduceMotion.Never)}>
          {/* ÉTAPE 1 : Identité & Date d'anniversaire */}
          {step === 1 && (
            <Step
              title="Qui fêtons-nous ?"
              subtitle={AJOUT.etape1}>
              <View style={styles.avatarSection}>
                <Pressable
                  onPress={async () => {
                    const uri = await pickImageFromLibrary();
                    if (uri) patch({ photoUri: uri });
                  }}
                  style={styles.avatarPress}>
                  <AvatarPersonne
                    prenom={draft.prenom || 'A'}
                    nom={draft.nom || 'P'}
                    photoUri={draft.photoUri}
                    size={88}
                  />
                  <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                    <AppIcon name="camera" size={13} color="#FFF" />
                  </View>
                </Pressable>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
                  {draft.photoUri ? 'Modifier la photo' : 'Ajouter une photo'}
                </Text>
              </View>

              <ChampTexte
                label="Prénom *"
                placeholder="Ex : Marie, Thomas..."
                value={draft.prenom}
                onChangeText={(prenom) => patch({ prenom })}
              />

              <ChampTexte
                label="Nom (facultatif)"
                placeholder="Ex : Dupont"
                value={draft.nom}
                onChangeText={(nom) => patch({ nom })}
              />

              <View style={{ marginTop: 6 }}>
                <SelecteurDate
                  label="Date d’anniversaire *"
                  anneeFacultative
                  value={{ jour: draft.jour, mois: draft.mois, annee: draft.annee }}
                  onChange={({ jour, mois, annee }) => patch({ jour, mois, annee })}
                  hint="Le jour et le mois sont nécessaires. L'année est facultative."
                />
              </View>
            </Step>
          )}

          {/* ÉTAPE 2 : Relation & Canal d'envoi */}
          {step === 2 && (
            <Step
              title="Relation et canal"
              subtitle={AJOUT.etape2}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Quelle est votre relation ?
              </Text>
              <SelecteurOptions
                options={RELATIONS}
                value={draft.relation}
                onChange={(id) => {
                  const rel = id as RelationId;
                  patch({
                    relation: rel,
                    contexte: inferContexte(rel),
                    ton: inferTon(rel, draft.styles),
                  });
                }}
              />

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
                Où comptez-vous lui écrire ?
              </Text>
              <SelecteurOptions
                layout="chips"
                options={DESTINATIONS}
                value={draft.destination}
                onChange={(id) => patch({ destination: id as DestinationId })}
              />
            </Step>
          )}

          {/* ÉTAPE 3 : Personnalisation des vœux (IA) */}
          {step === 3 && (
            <Step
              title="Ambiance du message"
              subtitle={AJOUT.etape3}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Ambiance souhaitée (au moins 1)
              </Text>
              <SelecteurOptions
                multiple
                layout="chips"
                options={STYLES_MESSAGE}
                value={draft.styles}
                onChange={(id) => {
                  const style = id as StyleMessageId;
                  const nextStyles = draft.styles.includes(style)
                    ? draft.styles.filter((s) => s !== style)
                    : [...draft.styles, style];
                  patch({
                    styles: nextStyles,
                    ton: inferTon(draft.relation, nextStyles),
                  });
                }}
              />

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
                Longueur du message
              </Text>
              <SelecteurOptions
                layout="chips"
                options={LONGUEURS}
                value={draft.longueur}
                onChange={(id) => patch({ longueur: id as LongueurId })}
              />

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
                Un souvenir ou détail pour l'IA ? (facultatif)
              </Text>
              <ChampTexte
                multiline
                placeholder="Ex : C'est une amie d'enfance très drôle, elle adore voyager, son nouveau projet pro..."
                hint="Une petite anecdote permettra de générer un message unique et ultra personnalisé."
                value={draft.description}
                onChangeText={(description) => patch({ description })}
              />
            </Step>
          )}

          {/* ÉTAPE 4 : Rappels & Récapitulatif */}
          {step === 4 && (
            <Step
              title="Rappels et récapitulatif"
              subtitle={AJOUT.etape4}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Quand souhaitez-vous être notifié ?
              </Text>
              <View style={styles.rappelGrid}>
                {RAPPEL_ITEMS.map((item) => {
                  const active = draft.rappels[item.key];
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() =>
                        patch({
                          rappels: { ...draft.rappels, [item.key]: !active },
                        })
                      }
                      style={[
                        styles.rappelCard,
                        {
                          backgroundColor: active ? theme.primarySoft : theme.backgroundElement,
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            backgroundColor: active ? theme.primary : 'transparent',
                            borderColor: active ? theme.primary : theme.border,
                          },
                        ]}>
                        {active ? <AppIcon name="check" size={12} color="#FFF" /> : null}
                      </View>
                      <Text
                        style={[
                          styles.rappelLabel,
                          { color: active ? theme.primaryDark : theme.text },
                        ]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <ChampTexte
                label="Heure de notification"
                placeholder="09:00"
                value={draft.rappels.heure}
                onChangeText={(heure) => patch({ rappels: { ...draft.rappels, heure } })}
                hint="Heure à laquelle vous recevrez le rappel sur votre téléphone."
              />

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
                Aperçu de la fiche
              </Text>
              <View
                style={[
                  styles.recap,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                ]}>
                <View style={styles.recapHeader}>
                  <AvatarPersonne
                    prenom={draft.prenom || 'A'}
                    nom={draft.nom || 'P'}
                    photoUri={draft.photoUri}
                    size={52}
                  />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[styles.recapName, { color: theme.text }]}>
                      {draft.prenom} {draft.nom}
                    </Text>
                    <BadgeRelation relation={draft.relation} />
                  </View>
                </View>

                <View style={[styles.recapDivider, { backgroundColor: theme.border }]} />

                <View style={styles.recapRow}>
                  <Text style={styles.recapEmoji}>🎂</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recapValue, { color: theme.text }]}>
                      {formatDateAnniv(draft.jour, draft.mois)}
                      {draft.annee ? ` ${draft.annee}` : ''}
                    </Text>
                    <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>
                      {labelCountdown(days)}
                    </Text>
                  </View>
                </View>

                <View style={styles.recapRow}>
                  <Text style={styles.recapEmoji}>💬</Text>
                  <Text style={[styles.recapValue, { color: theme.text }]}>
                    {labelDestination(draft.destination)}
                  </Text>
                </View>

                <View style={styles.recapRow}>
                  <Text style={styles.recapEmoji}>✨</Text>
                  <Text style={[styles.recapValue, { color: theme.text }]}>
                    {labelsStyles(draft.styles)} · {labelLongueur(draft.longueur)}
                  </Text>
                </View>

                <View style={styles.recapRow}>
                  <Text style={styles.recapEmoji}>🔔</Text>
                  <Text style={[styles.recapValue, { color: theme.textSecondary }]}>
                    {[
                      draft.rappels.j7 && 'J-7',
                      draft.rappels.j3 && 'J-3',
                      draft.rappels.j1 && 'J-1',
                      draft.rappels.j0 && 'Jour J',
                    ]
                      .filter(Boolean)
                      .join(' · ')}{' '}
                    à {draft.rappels.heure || '09:00'}
                  </Text>
                </View>

                {draft.description.trim() ? (
                  <View style={styles.recapRow}>
                    <Text style={styles.recapEmoji}>📝</Text>
                    <Text
                      numberOfLines={2}
                      style={[styles.recapValue, { color: theme.textSecondary, fontStyle: 'italic' }]}>
                      « {draft.description.trim()} »
                    </Text>
                  </View>
                ) : null}
              </View>
            </Step>
          )}

          {/* SUCCÈS */}
          {step > TOTAL && (
            <View style={styles.success}>
              <Text style={{ fontSize: 56 }}>✨</Text>
              <Text style={[styles.successTitle, { color: theme.text }]}>C’est enregistré !</Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  textAlign: 'center',
                  fontSize: 16,
                  lineHeight: 24,
                  paddingHorizontal: 20,
                }}>
                {savedName} est dans votre calendrier. Vous pourrez préparer un message quand vous voulez.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {step <= TOTAL ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + 12, backgroundColor: theme.background },
          ]}>
          <BoutonPrincipal
            label={step === TOTAL ? "Enregistrer l'anniversaire" : 'Continuer'}
            iconNode={
              step === TOTAL ? (
                <AppIcon name="check" size={18} color="#FFFFFF" />
              ) : undefined
            }
            onPress={step === TOTAL ? save : next}
            disabled={!canNext}
          />
        </View>
      ) : null}
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
    </KeyboardAvoidingView>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: Spacing.two }}>
      <View style={{ marginBottom: 4 }}>
        <Text style={[styles.stepTitle, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { paddingHorizontal: Spacing.three, paddingBottom: 4 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  progressWrap: {
    flex: 1,
    maxWidth: 180,
  },
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, gap: 0 },
  stepTitle: { fontSize: 24, fontWeight: '800', lineHeight: 30 },
  stepSubtitle: { fontSize: 14, marginTop: 3, lineHeight: 19 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 8, marginBottom: 2 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatarPress: { position: 'relative' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  rappelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  rappelCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rappelLabel: { fontSize: 13, fontWeight: '600', flex: 1 },
  recap: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: 10,
    marginTop: 4,
  },
  recapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recapName: { fontSize: 19, fontWeight: '800' },
  recapDivider: { height: 1, marginVertical: 2 },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recapEmoji: { fontSize: 18 },
  recapValue: { fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: Spacing.three, paddingTop: 10 },
  success: { alignItems: 'center', gap: Spacing.three, paddingTop: 80 },
  successTitle: { fontSize: 28, fontWeight: '800' },
});
