import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MOCK_RESEAU } from '@/data/mock-reseau';
import { safeStorage } from '@/lib/safe-storage';
import type { Connexion, UtilisateurReseau } from '@/types/reseau';

type ReseauState = {
  utilisateurs: UtilisateurReseau[];
  connexions: Connexion[];
  envoyerDemande: (userId: string) => void;
  accepterDemande: (userId: string) => void;
  refuserDemande: (userId: string) => void;
  retirerConnexion: (userId: string) => void;
  statutPour: (userId: string) => 'aucune' | Connexion['statut'];
};

export const useReseauStore = create<ReseauState>()(
  persist(
    (set, get) => ({
      utilisateurs: MOCK_RESEAU,
      connexions: [
        {
          userId: 'net-thomas',
          statut: 'connecte',
          depuis: '2026-08-01T10:00:00.000Z',
        },
        {
          userId: 'net-noah',
          statut: 'recu',
          depuis: '2026-09-08T10:00:00.000Z',
        },
      ],
      envoyerDemande: (userId) => {
        const existing = get().connexions.find((c) => c.userId === userId);
        if (existing) return;
        set({
          connexions: [
            ...get().connexions,
            { userId, statut: 'en_attente', depuis: new Date().toISOString() },
          ],
        });
      },
      accepterDemande: (userId) => {
        set({
          connexions: get().connexions.map((c) =>
            c.userId === userId ? { ...c, statut: 'connecte' as const } : c,
          ),
        });
      },
      refuserDemande: (userId) => {
        set({ connexions: get().connexions.filter((c) => c.userId !== userId) });
      },
      retirerConnexion: (userId) => {
        set({ connexions: get().connexions.filter((c) => c.userId !== userId) });
      },
      statutPour: (userId) => {
        return get().connexions.find((c) => c.userId === userId)?.statut ?? 'aucune';
      },
    }),
    {
      name: 'anniversary-planner-reseau',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ connexions: state.connexions }),
    },
  ),
);
