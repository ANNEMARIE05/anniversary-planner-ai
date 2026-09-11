import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight, ReduceMotion } from 'react-native-reanimated';

import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { ChampTexte } from '@/components/ui/champ-texte';
import { ProgressionEtapes } from '@/components/ui/progression-etapes';
import { SelecteurDate } from '@/components/ui/selecteur-date';
import { SelecteurOptions } from '@/components/ui/selecteur-options';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  formatDateAnniv,
  labelContexte,
  labelDestination,
  labelRelation,
  labelsStyles,
} from '@/lib/labels';
import { pickImageFromLibrary } from '@/lib/pick-image';
import { useAnniversaireStore } from '@/store/anniversaire-store';
import {
  CONTEXTES,
  DESTINATIONS,
  LONGUEURS,
  RELATIONS,
  STYLES_MESSAGE,
  TONS,
  type ContexteId,
  type DestinationId,
  type LongueurId,
  type PersonneDraft,
  type RelationId,
  type StyleMessageId,
  type TonId,
} from '@/types/anniversaire';

const TOTAL = 11;

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
  rappels: { j7: true, j3: true, j1: true, j0: true, heure: '09:00' },
};

export default function AjouterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addPersonne = useAnniversaireStore((s) => s.addPersonne);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<PersonneDraft>(emptyDraft);
  const [savedName, setSavedName] = useState('');

  const patch = (p: Partial<PersonneDraft>) => setDraft((d) => ({ ...d, ...p }));

  const canNext = useMemo(() => {
    if (step === 1) return draft.prenom.trim().length > 0;
    if (step === 2) {
      return draft.jour >= 1 && draft.jour <= 31 && draft.mois >= 1 && draft.mois <= 12;
    }
    if (step === 7) return draft.styles.length > 0;
    return true;
  }, [step, draft]);

  const next = () => {
    if (!canNext) {
      Alert.alert('Presque', 'Complétez cette étape pour continuer.');
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

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top + 8 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <Pressable onPress={back}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>{step > TOTAL ? '' : 'Retour'}</Text>
        </Pressable>
        {step <= TOTAL ? <ProgressionEtapes step={step} total={TOTAL} /> : null}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
        keyboardShouldPersistTaps="handled">
        <Animated.View key={step} entering={FadeInRight.duration(280).reduceMotion(ReduceMotion.Never)}>
          {step === 1 && (
            <Step title="Commençons par la personne">
              <View style={{ alignItems: 'center', marginBottom: 12, gap: 10 }}>
                <Pressable
                  onPress={async () => {
                    const uri = await pickImageFromLibrary();
                    if (uri) patch({ photoUri: uri });
                  }}>
                  <AvatarPersonne
                    prenom={draft.prenom || 'A'}
                    nom={draft.nom || 'P'}
                    photoUri={draft.photoUri}
                    size={84}
                  />
                </Pressable>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
                  {draft.photoUri ? 'Changer la photo' : 'Ajouter une photo'}
                </Text>
              </View>
              <ChampTexte
                label="Prénom"
                placeholder="Marie"
                value={draft.prenom}
                onChangeText={(prenom) => patch({ prenom })}
              />
              <ChampTexte
                label="Nom"
                placeholder="Dupont"
                value={draft.nom}
                onChangeText={(nom) => patch({ nom })}
              />
            </Step>
          )}

          {step === 2 && (
            <Step title="Quand est son anniversaire ?">
              <SelecteurDate
                anneeFacultative
                value={{ jour: draft.jour, mois: draft.mois, annee: draft.annee }}
                onChange={({ jour, mois, annee }) => patch({ jour, mois, annee })}
                hint="Choisissez le jour, le mois et éventuellement l’année."
              />
            </Step>
          )}

          {step === 3 && (
            <Step title="Quelle est votre relation ?">
              <SelecteurOptions
                options={RELATIONS}
                value={draft.relation}
                onChange={(id) => patch({ relation: id as RelationId })}
              />
            </Step>
          )}

          {step === 4 && (
            <Step title="Où vas-tu envoyer le message ?">
              <SelecteurOptions
                options={DESTINATIONS}
                value={draft.destination}
                onChange={(id) => patch({ destination: id as DestinationId })}
              />
            </Step>
          )}

          {step === 5 && (
            <Step title="Dans quel contexte ?">
              <SelecteurOptions
                options={CONTEXTES}
                value={draft.contexte}
                onChange={(id) => patch({ contexte: id as ContexteId })}
              />
            </Step>
          )}

          {step === 6 && (
            <Step title="Parle-moi un peu de cette personne">
              <ChampTexte
                multiline
                placeholder="Exemple : C’est une amie très proche. Elle m’a beaucoup soutenue cette année..."
                hint="Plus tu donnes de contexte, plus ton message pourra être personnel."
                value={draft.description}
                onChangeText={(description) => patch({ description })}
              />
            </Step>
          )}

          {step === 7 && (
            <Step title="Comment veux-tu que ton message sonne ?">
              <SelecteurOptions
                multiple
                options={STYLES_MESSAGE}
                value={draft.styles}
                onChange={(id) => {
                  const style = id as StyleMessageId;
                  patch({
                    styles: draft.styles.includes(style)
                      ? draft.styles.filter((s) => s !== style)
                      : [...draft.styles, style],
                  });
                }}
              />
            </Step>
          )}

          {step === 8 && (
            <Step title="Quel ton préfères-tu ?">
              <SelecteurOptions
                options={TONS}
                value={draft.ton}
                onChange={(id) => patch({ ton: id as TonId })}
              />
            </Step>
          )}

          {step === 9 && (
            <Step title="Longueur du message">
              <SelecteurOptions
                options={LONGUEURS}
                value={draft.longueur}
                onChange={(id) => patch({ longueur: id as LongueurId })}
              />
            </Step>
          )}

          {step === 10 && (
            <Step title="Quand veux-tu être prévenu ?">
              {(
                [
                  ['j7', '7 jours avant'],
                  ['j3', '3 jours avant'],
                  ['j1', '1 jour avant'],
                  ['j0', 'Le jour même'],
                ] as const
              ).map(([key, label]) => (
                <Pressable
                  key={key}
                  onPress={() =>
                    patch({ rappels: { ...draft.rappels, [key]: !draft.rappels[key] } })
                  }
                  style={[
                    styles.check,
                    {
                      backgroundColor: draft.rappels[key] ? theme.primarySoft : theme.backgroundElement,
                      borderColor: draft.rappels[key] ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text style={{ color: theme.text, fontWeight: '600' }}>
                    {draft.rappels[key] ? '☑' : '☐'} {label}
                  </Text>
                </Pressable>
              ))}
              <ChampTexte
                label="Heure du rappel"
                placeholder="09:00"
                value={draft.rappels.heure}
                onChangeText={(heure) => patch({ rappels: { ...draft.rappels, heure } })}
              />
            </Step>
          )}

          {step === 11 && (
            <Step title="Récapitulatif">
              <View style={[styles.recap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <Text style={[styles.recapName, { color: theme.text }]}>
                  {draft.prenom} {draft.nom}
                </Text>
                <Text style={{ color: theme.textSecondary }}>🎂 {formatDateAnniv(draft.jour, draft.mois)}</Text>
                <Text style={{ color: theme.text }}>❤️ {labelRelation(draft.relation)}</Text>
                <Text style={{ color: theme.text }}>💬 {labelDestination(draft.destination)}</Text>
                <Text style={{ color: theme.text }}>Contexte · {labelContexte(draft.contexte)}</Text>
                <Text style={{ color: theme.text }}>Style · {labelsStyles(draft.styles)}</Text>
                <Text style={{ color: theme.textSecondary }}>
                  Rappels · {[
                    draft.rappels.j7 && '7j',
                    draft.rappels.j3 && '3j',
                    draft.rappels.j1 && '1j',
                    draft.rappels.j0 && 'Jour J',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </View>
            </Step>
          )}

          {step > TOTAL && (
            <View style={styles.success}>
              <Text style={{ fontSize: 56 }}>✨</Text>
              <Text style={[styles.successTitle, { color: theme.text }]}>C’est enregistré !</Text>
              <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                {savedName} fait maintenant partie de vos anniversaires importants.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {step <= TOTAL ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: theme.background }]}>
          <BoutonPrincipal
            label={step === TOTAL ? "Enregistrer l'anniversaire" : 'Continuer'}
            onPress={step === TOTAL ? save : next}
            disabled={!canNext}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: Spacing.two }}>
      <Text style={[styles.stepTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { paddingHorizontal: Spacing.three, gap: Spacing.two },
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three, gap: 0 },
  stepTitle: { fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 2 },
  check: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.three,
  },
  recap: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.four, gap: 10 },
  recapName: { fontSize: 24, fontWeight: '800' },
  footer: { paddingHorizontal: Spacing.three, paddingTop: 8 },
  success: { alignItems: 'center', gap: Spacing.three, paddingTop: 80 },
  successTitle: { fontSize: 28, fontWeight: '800' },
});
