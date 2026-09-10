import type { Personne } from '@/types/anniversaire';

/** Prépare la logique de notifications locales (simulée en V1). */
export const notificationService = {
  async demanderPermission(): Promise<boolean> {
    // Expo Notifications pourra être branché ici une fois le package installé.
    return true;
  },

  async planifierPourPersonne(_personne: Personne): Promise<void> {
    // Placeholder : planifier j-7, j-3, j-1, j0 selon personne.rappels
  },

  async annulerPourPersonne(_personneId: string): Promise<void> {
    // Placeholder
  },

  async planifierToutes(personnes: Personne[]): Promise<void> {
    await Promise.all(personnes.map((p) => this.planifierPourPersonne(p)));
  },
};
