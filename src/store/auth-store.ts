import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { safeStorage } from '@/lib/safe-storage';

export type AuthUser = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  /** Date de naissance — indispensable pour le réseau social */
  jourNaissance?: number;
  moisNaissance?: number;
  anneeNaissance?: number;
  photoUri?: string;
  bio?: string;
};

type AuthState = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    jourNaissance: number;
    moisNaissance: number;
    anneeNaissance?: number;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateProfile: (patch: Partial<Omit<AuthUser, 'id'>>) => void;
  logout: () => void;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, password) => {
        const e = normalizeEmail(email);
        if (!e.includes('@') || password.trim().length < 4) {
          return { ok: false, error: 'Email ou mot de passe invalide.' };
        }
        const existing = get().user;
        if (existing && existing.email === e) {
          return { ok: true };
        }
        const localName = e.split('@')[0] || 'Utilisateur';
        set({
          user: {
            id: `u_${Date.now()}`,
            prenom: existing?.email === e ? existing.prenom : localName,
            nom: existing?.email === e ? existing.nom : '',
            email: e,
            jourNaissance: existing?.email === e ? existing.jourNaissance : undefined,
            moisNaissance: existing?.email === e ? existing.moisNaissance : undefined,
            anneeNaissance: existing?.email === e ? existing.anneeNaissance : undefined,
            photoUri: existing?.email === e ? existing.photoUri : undefined,
            bio: existing?.email === e ? existing.bio : undefined,
          },
        });
        return { ok: true };
      },
      register: async ({
        prenom,
        nom,
        email,
        password,
        jourNaissance,
        moisNaissance,
        anneeNaissance,
      }) => {
        const e = normalizeEmail(email);
        if (!prenom.trim()) return { ok: false, error: 'Le prénom est requis.' };
        if (!e.includes('@')) return { ok: false, error: 'Adresse email invalide.' };
        if (password.trim().length < 6) {
          return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
        }
        if (
          !Number.isFinite(jourNaissance) ||
          jourNaissance < 1 ||
          jourNaissance > 31 ||
          !Number.isFinite(moisNaissance) ||
          moisNaissance < 1 ||
          moisNaissance > 12
        ) {
          return { ok: false, error: 'Indiquez une date de naissance valide.' };
        }
        set({
          user: {
            id: `u_${Date.now()}`,
            prenom: prenom.trim(),
            nom: nom.trim(),
            email: e,
            jourNaissance,
            moisNaissance,
            anneeNaissance,
          },
        });
        return { ok: true };
      },
      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            ...patch,
            email: patch.email ? normalizeEmail(patch.email) : user.email,
          },
        });
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'anniversary-planner-auth',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
