import type {
  ContexteId,
  DestinationId,
  LongueurId,
  MessageStatut,
  RelationId,
  StyleMessageId,
  TonId,
} from '@/types/anniversaire';
import { CONTEXTES, DESTINATIONS, LONGUEURS, RELATIONS, STYLES_MESSAGE, TONS } from '@/types/anniversaire';

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function labelRelation(id: RelationId, custom?: string) {
  if (id === 'autre' && custom) return custom;
  return RELATIONS.find((r) => r.id === id)?.label ?? id;
}

export function emojiRelation(id: RelationId) {
  return RELATIONS.find((r) => r.id === id)?.emoji ?? '✨';
}

export function iconRelation(id: RelationId) {
  return RELATIONS.find((r) => r.id === id)?.icon ?? 'sparkles';
}

export function labelDestination(id: DestinationId) {
  return DESTINATIONS.find((d) => d.id === id)?.label ?? id;
}

export function labelContexte(id: ContexteId) {
  return CONTEXTES.find((c) => c.id === id)?.label ?? id;
}

export function labelsStyles(ids: StyleMessageId[]) {
  return ids
    .map((id) => STYLES_MESSAGE.find((s) => s.id === id)?.label)
    .filter(Boolean)
    .join(' + ');
}

export function formatDateAnniv(jour: number, mois: number) {
  return `${jour} ${MOIS[mois - 1]}`;
}

export function weekdayFor(jour: number, mois: number, year = new Date().getFullYear()) {
  const d = new Date(year, mois - 1, jour);
  return JOURS[d.getDay()];
}

export function nextOccurrence(jour: number, mois: number, from = new Date()) {
  const year = from.getFullYear();
  let next = new Date(year, mois - 1, jour);
  next.setHours(0, 0, 0, 0);
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  if (next < today) next = new Date(year + 1, mois - 1, jour);
  return next;
}

export function daysUntil(jour: number, mois: number, from = new Date()) {
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  const next = nextOccurrence(jour, mois, from);
  return Math.round((next.getTime() - today.getTime()) / 86400000);
}

export function isSameDay(jour: number, mois: number, from = new Date()) {
  return from.getDate() === jour && from.getMonth() + 1 === mois;
}

export function labelCountdown(days: number) {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  return `Dans ${days} jours`;
}

export function initials(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

export function statutLabel(statut: MessageStatut) {
  if (statut === 'envoye') return 'Envoyé';
  if (statut === 'pret') return 'Message prêt';
  return 'À préparer';
}

export function monthLabel(mois: number) {
  return MOIS[mois - 1];
}

export function longueurHint(id: LongueurId) {
  if (id === 'tres_court') return 1;
  if (id === 'court') return 2;
  if (id === 'moyen') return 3;
  return 4;
}

export function labelLongueur(id: LongueurId) {
  return LONGUEURS.find((l) => l.id === id)?.label ?? id;
}

export function labelTon(id: TonId) {
  return TONS.find((t) => t.id === id)?.label ?? id;
}

export function inferContexte(relation: RelationId): ContexteId {
  switch (relation) {
    case 'famille':
      return 'groupe_familial';
    case 'communaute_chretienne':
      return 'groupe_chretien';
    case 'collegue':
      return 'groupe_pro';
    case 'groupe':
      return 'amis';
    case 'ami_proche':
    case 'partenaire':
      return 'ami_proche';
    default:
      return 'autre';
  }
}

export function inferTon(relation: RelationId, styles: StyleMessageId[]): TonId {
  if (styles.includes('naturel')) return 'tres_naturel';
  if (styles.includes('affectueux') || styles.includes('emotionnel')) return 'affectueux';
  if (relation === 'collegue' || relation === 'responsable') return 'respectueux';
  if (styles.includes('drole')) return 'familier';
  return 'amical';
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
