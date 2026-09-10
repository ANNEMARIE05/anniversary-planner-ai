import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { safeStorage } from '@/lib/safe-storage';

export type AuthUser = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateProfile: (patch: Partial<Pick<AuthUser, 'prenom' | 'nom' | 'email'>>) => void;
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
          },
        });
        return { ok: true };
      },
      register: async ({ prenom, nom, email, password }) => {
        const e = normalizeEmail(email);
        if (!prenom.trim()) return { ok: false, error: 'Le prénom est requis.' };
        if (!e.includes('@')) return { ok: false, error: 'Adresse email invalide.' };
        if (password.trim().length < 6) {
          return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
        }
        set({
          user: {
            id: `u_${Date.now()}`,
            prenom: prenom.trim(),
            nom: nom.trim(),
            email: e,
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
