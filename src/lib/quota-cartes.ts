/** Quota & monétisation cartes (mock paiement 50 FCFA). */

export const PRIX_PACK_CARTES_FCFA = 50;
export const CARTES_PAR_PACK = 3;
export const CARTES_GRATUITES_PAR_JOUR = 3;

export type QuotaCartesJour = {
  /** Date locale YYYY-MM-DD */
  date: string;
  /** Cartes déjà générées / téléchargées aujourd’hui */
  utilisees: number;
  /** Crédits bonus achetés (packs de 3) encore disponibles aujourd’hui */
  bonusRestants: number;
};

export function dateLocaleAujourdhui(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function quotaDuJour(q?: QuotaCartesJour | null): QuotaCartesJour {
  const today = dateLocaleAujourdhui();
  if (!q || q.date !== today) {
    return { date: today, utilisees: 0, bonusRestants: 0 };
  }
  return q;
}

/** Combien de cartes encore générables sans payer. */
export function cartesRestantes(q?: QuotaCartesJour | null): number {
  const cur = quotaDuJour(q);
  const gratuitRestant = Math.max(0, CARTES_GRATUITES_PAR_JOUR - cur.utilisees);
  if (cur.utilisees < CARTES_GRATUITES_PAR_JOUR) {
    return gratuitRestant + cur.bonusRestants;
  }
  return cur.bonusRestants;
}

export function peutGenererCarte(q?: QuotaCartesJour | null): boolean {
  return cartesRestantes(q) > 0;
}
