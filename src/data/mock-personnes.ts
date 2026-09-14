import type { Personne } from '@/types/anniversaire';

export const MOCK_PERSONNES: Personne[] = [
  {
    id: 'marie-001',
    prenom: 'Marie',
    nom: 'Dupont',
    mois: 9,
    jour: 10,
    relation: 'ami_proche',
    destination: 'whatsapp_prive',
    contexte: 'ami_proche',
    description:
      "Amie très proche. Elle m'a beaucoup soutenue cette année. Elle aime les messages sincères et un peu émotionnels.",
    styles: ['chaleureux', 'emotionnel'],
    ton: 'affectueux',
    longueur: 'moyen',
    rappels: { j7: true, j3: true, j1: true, j0: true, heure: '09:00' },
    favori: true,
    statut: 'a_preparer',
    messages: [],
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'david-002',
    prenom: 'David',
    nom: 'Kouassi',
    mois: 9,
    jour: 21,
    relation: 'collegue',
    destination: 'groupe_whatsapp',
    contexte: 'groupe_pro',
    description: 'Collègue sympathique de l’équipe produit. Relation professionnelle amicale.',
    styles: ['naturel', 'elegant'],
    ton: 'amical',
    longueur: 'court',
    rappels: { j7: false, j3: true, j1: true, j0: true, heure: '08:30' },
    favori: false,
    statut: 'a_preparer',
    messages: [],
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'esther-003',
    prenom: 'Esther',
    nom: 'Mbala',
    mois: 10,
    jour: 3,
    relation: 'communaute_chretienne',
    destination: 'groupe_whatsapp',
    contexte: 'groupe_chretien',
    description:
      'Sœur de la communauté. Elle aime les messages spirituels, encourageants et pleins de foi.',
    styles: ['spirituel', 'chaleureux'],
    ton: 'respectueux',
    longueur: 'moyen',
    rappels: { j7: true, j3: false, j1: true, j0: true, heure: '07:00' },
    favori: true,
    statut: 'pret',
    messageActuel:
      'Joyeux anniversaire Esther 🙏\nQue le Seigneur te comble de paix, de joie et de nouvelles grâces en cette nouvelle année. Merci pour ta présence précieuse dans notre communauté.',
    messages: [
      {
        id: 'msg-esther-1',
        texte:
          'Joyeux anniversaire Esther 🙏\nQue le Seigneur te comble de paix, de joie et de nouvelles grâces en cette nouvelle année. Merci pour ta présence précieuse dans notre communauté.',
        variante: 'Spirituel',
        createdAt: '2026-09-01T10:00:00.000Z',
      },
    ],
    createdAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'sarah-004',
    prenom: 'Sarah',
    nom: 'Nguyen',
    mois: 10,
    jour: 12,
    relation: 'famille',
    destination: 'whatsapp_prive',
    contexte: 'groupe_familial',
    description: 'Cousine préférée. On partage beaucoup de souvenirs d’enfance.',
    styles: ['affectueux', 'festif'],
    ton: 'familier',
    longueur: 'moyen',
    rappels: { j7: true, j3: true, j1: true, j0: true, heure: '09:00' },
    favori: true,
    statut: 'a_preparer',
    messages: [],
    createdAt: '2026-04-05T10:00:00.000Z',
  },
];

export const IDS_EXEMPLES = MOCK_PERSONNES.map((p) => p.id);

export function sontExemples(personnes: { id: string }[]) {
  if (personnes.length === 0) return false;
  const ids = new Set(IDS_EXEMPLES);
  return personnes.every((p) => ids.has(p.id));
}
