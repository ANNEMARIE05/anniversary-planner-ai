import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MOCK_PERSONNES } from '@/data/mock-personnes';
import { uid } from '@/lib/labels';
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
  setHydrated: (v: boolean) => void;
  completeOnboarding: () => void;
  addPersonne: (draft: PersonneDraft) => string;
  updatePersonne: (id: string, patch: Partial<Personne>) => void;
  removePersonne: (id: string) => void;
  toggleFavori: (id: string) => void;
  setMessage: (id: string, messages: MessageGenere[], actuel?: string) => void;
  setStatut: (id: string, statut: MessageStatut) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
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
};

export const useAnniversaireStore = create<AnniversaireState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingDone: false,
      personnes: MOCK_PERSONNES,
      preferences: defaultPreferences,
      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: () => set({ onboardingDone: true }),
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
      clearData: () =>
        set({
          personnes: [],
          preferences: defaultPreferences,
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
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AnniversaireState>;
        return {
          ...current,
          ...p,
          preferences: {
            ...defaultPreferences,
            ...p.preferences,
            theme: p.preferences?.theme ?? 'clair',
          },
          personnes: p.personnes?.length ? p.personnes : current.personnes,
        };
      },
    },
  ),
);
