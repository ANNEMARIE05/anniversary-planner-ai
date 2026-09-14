/** Quota journalier : 4 souhaits (message ou carte), recharge 100 FCFA. */

export const CREDITS_GRATUITS_PAR_JOUR = 4;
export const CREDITS_PAR_PACK = 4;
export const PRIX_PACK_FCFA = 100;

/** 1 carte perso offerte, puis packs de 4. */
export const FONDS_PERSO_OFFERTS = 1;
export const FONDS_PAR_PACK = 4;

/** Alias rétrocompatibles */
export const CARTES_GRATUITES_PAR_JOUR = CREDITS_GRATUITS_PAR_JOUR;
export const CARTES_PAR_PACK = CREDITS_PAR_PACK;
export const PRIX_PACK_CARTES_FCFA = PRIX_PACK_FCFA;

export type QuotaCartesJour = {
  /** Date locale YYYY-MM-DD */
  date: string;
  /** Souhaits déjà générés aujourd’hui (message IA ou carte) */
  utilisees: number;
  /** Crédits bonus achetés encore disponibles aujourd’hui */
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

/** Combien de souhaits encore générables sans payer. */
export function cartesRestantes(q?: QuotaCartesJour | null): number {
  const cur = quotaDuJour(q);
  const gratuitRestant = Math.max(0, CREDITS_GRATUITS_PAR_JOUR - cur.utilisees);
  if (cur.utilisees < CREDITS_GRATUITS_PAR_JOUR) {
    return gratuitRestant + cur.bonusRestants;
  }
  return cur.bonusRestants;
}

export function peutGenererCarte(q?: QuotaCartesJour | null): boolean {
  return cartesRestantes(q) > 0;
}

export function slotsFondsPerso(achetes?: number | null): number {
  return FONDS_PERSO_OFFERTS + (achetes ?? 0);
}

export function peutAjouterFondPerso(urisCount: number, achetes?: number | null): boolean {
  return urisCount < slotsFondsPerso(achetes);
}

export function labelCreditsRestants(n: number): string {
  if (n <= 0) {
    return `Quota atteint — ${PRIX_PACK_FCFA} FCFA pour +${CREDITS_PAR_PACK} souhaits`;
  }
  return `${n} souhait${n > 1 ? 's' : ''} restant${n > 1 ? 's' : ''} aujourd’hui`;
}
