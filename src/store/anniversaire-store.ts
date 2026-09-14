import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MOCK_PERSONNES } from '@/data/mock-personnes';
import type { GuideId } from '@/lib/guides';
import { uid } from '@/lib/labels';
import {
  CREDITS_GRATUITS_PAR_JOUR,
  CREDITS_PAR_PACK,
  FONDS_PAR_PACK,
  cartesRestantes,
  peutGenererCarte,
  quotaDuJour,
  type QuotaCartesJour,
} from '@/lib/quota-cartes';
import { safeStorage } from '@/lib/safe-storage';
import type {
  MessageGenere,
  MessageStatut,
  Personne,
  PersonneDraft,
  Preferences,
} from '@/types/anniversaire';

type AnniversaireState = {
  hydrated: boolean;
  onboardingDone: boolean;
  personnes: Personne[];
  preferences: Preferences;
  guidesVus: Partial<Record<GuideId, boolean>>;
  setHydrated: (v: boolean) => void;
  completeOnboarding: () => void;
  marquerGuideVu: (id: GuideId) => void;
  chargerExemples: () => void;
  addPersonne: (draft: PersonneDraft) => string;
  updatePersonne: (id: string, patch: Partial<Personne>) => void;
  removePersonne: (id: string) => void;
  toggleFavori: (id: string) => void;
  setMessage: (id: string, messages: MessageGenere[], actuel?: string) => void;
  setStatut: (id: string, statut: MessageStatut) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  getQuotaCartes: () => QuotaCartesJour;
  cartesRestantesAujourdhui: () => number;
  peutGenererCarteAujourdhui: () => boolean;
  /** Consomme 1 souhait (message ou carte). Retourne false si quota épuisé. */
  consommerCarte: () => boolean;
  /** Achat mock : +4 souhaits pour aujourd’hui */
  acheterPackCartes: () => void;
  /** Achat mock : +4 slots de cartes perso */
  acheterFondPerso: () => void;
  ajouterFondPersoUri: (uri: string) => void;
  clearData: () => void;
  exportData: () => string;
};

const defaultPreferences: Preferences = {
  notificationsActivees: true,
  heureDefaut: '09:00',
  tonPrefere: 'amical',
  longueurPreferee: 'moyen',
  emojis: true,
  theme: 'clair',
  accentPalette: 'corail',
};

export const useAnniversaireStore = create<AnniversaireState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingDone: false,
      personnes: [],
      preferences: defaultPreferences,
      guidesVus: {},
      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: () => set({ onboardingDone: true }),
      marquerGuideVu: (id) =>
        set({ guidesVus: { ...get().guidesVus, [id]: true } }),
      chargerExemples: () => {
        const existing = new Set(get().personnes.map((p) => p.id));
        const toAdd = MOCK_PERSONNES.filter((p) => !existing.has(p.id));
        if (toAdd.length) set({ personnes: [...get().personnes, ...toAdd] });
      },
      addPersonne: (draft) => {
        const id = uid();
        const personne: Personne = {
          ...draft,
          id,
          favori: false,
          statut: 'a_preparer',
          messages: [],
          createdAt: new Date().toISOString(),
        };
        set({ personnes: [personne, ...get().personnes] });
        return id;
      },
      updatePersonne: (id, patch) =>
        set({
          personnes: get().personnes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }),
      removePersonne: (id) =>
        set({ personnes: get().personnes.filter((p) => p.id !== id) }),
      toggleFavori: (id) =>
        set({
          personnes: get().personnes.map((p) =>
            p.id === id ? { ...p, favori: !p.favori } : p,
          ),
        }),
      setMessage: (id, messages, actuel) =>
        set({
          personnes: get().personnes.map((p) =>
            p.id === id
              ? {
                  ...p,
                  messages,
                  messageActuel: actuel ?? messages[0]?.texte,
                  statut: 'pret' as MessageStatut,
                }
              : p,
          ),
        }),
      setStatut: (id, statut) =>
        set({
          personnes: get().personnes.map((p) => (p.id === id ? { ...p, statut } : p)),
        }),
      updatePreferences: (patch) =>
        set({ preferences: { ...get().preferences, ...patch } }),
      getQuotaCartes: () => quotaDuJour(get().preferences.quotaCartes),
      cartesRestantesAujourdhui: () => cartesRestantes(get().preferences.quotaCartes),
      peutGenererCarteAujourdhui: () => peutGenererCarte(get().preferences.quotaCartes),
      consommerCarte: () => {
        const cur = quotaDuJour(get().preferences.quotaCartes);
        if (!peutGenererCarte(cur)) return false;
        let next: QuotaCartesJour;
        if (cur.utilisees < CREDITS_GRATUITS_PAR_JOUR) {
          next = { ...cur, utilisees: cur.utilisees + 1 };
        } else {
          next = { ...cur, utilisees: cur.utilisees + 1, bonusRestants: Math.max(0, cur.bonusRestants - 1) };
        }
        set({ preferences: { ...get().preferences, quotaCartes: next } });
        return true;
      },
      acheterPackCartes: () => {
        const cur = quotaDuJour(get().preferences.quotaCartes);
        set({
          preferences: {
            ...get().preferences,
            quotaCartes: {
              ...cur,
              bonusRestants: cur.bonusRestants + CREDITS_PAR_PACK,
            },
          },
        });
      },
      acheterFondPerso: () => {
        const prefs = get().preferences;
        set({
          preferences: {
            ...prefs,
            fondsPersoDebloques: (prefs.fondsPersoDebloques ?? 0) + FONDS_PAR_PACK,
          },
        });
      },
      ajouterFondPersoUri: (uri) => {
        const prefs = get().preferences;
        const list = prefs.fondsPersoUris ?? [];
        if (list.includes(uri)) return;
        set({
          preferences: {
            ...prefs,
            fondsPersoUris: [...list, uri],
          },
        });
      },
      clearData: () =>
        set({
          personnes: [],
          preferences: defaultPreferences,
          guidesVus: {},
        }),
      exportData: () =>
        JSON.stringify(
          { personnes: get().personnes, preferences: get().preferences },
          null,
          2,
        ),
    }),
    {
      name: 'anniversary-planner-ai',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        onboardingDone: state.onboardingDone,
        personnes: state.personnes,
        preferences: state.preferences,
        guidesVus: state.guidesVus,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AnniversaireState>;
        return {
          ...current,
          ...p,
          preferences: {
            ...defaultPreferences,
            ...p.preferences,
            theme:
              p.preferences?.theme === 'sombre'
                ? 'sombre'
                : 'clair',
            accentPalette: p.preferences?.accentPalette ?? defaultPreferences.accentPalette,
          },
          personnes: Array.isArray(p.personnes) ? p.personnes : current.personnes,
          guidesVus: { ...current.guidesVus, ...p.guidesVus },
        };
      },
    },
  ),
);
