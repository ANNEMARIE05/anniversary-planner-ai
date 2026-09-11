import type { IconName } from '@/components/ui/app-icon';
import type { CarteStickerId, CarteThemeId } from '@/constants/theme';
import type { QuotaCartesJour } from '@/lib/quota-cartes';

export type { QuotaCartesJour };

export const RELATIONS = [
  { id: 'ami_proche', label: 'Ami proche', emoji: '❤️', icon: 'heart' as IconName },
  { id: 'famille', label: 'Famille', emoji: '🏠', icon: 'home' as IconName },
  { id: 'communaute_chretienne', label: 'Communauté chrétienne', emoji: '✨', icon: 'sparkles' as IconName },
  { id: 'collegue', label: 'Collègue', emoji: '💼', icon: 'user' as IconName },
  { id: 'connaissance', label: 'Connaissance', emoji: '🤝', icon: 'users' as IconName },
  { id: 'responsable', label: 'Responsable', emoji: '⭐', icon: 'star' as IconName },
  { id: 'partenaire', label: 'Partenaire', emoji: '💕', icon: 'heart' as IconName },
  { id: 'groupe', label: 'Groupe', emoji: '👥', icon: 'users' as IconName },
  { id: 'autre', label: 'Autre', emoji: '✨', icon: 'sparkles' as IconName },
] as const;

export const DESTINATIONS = [
  { id: 'whatsapp_prive', label: 'WhatsApp privé', emoji: '💬', icon: 'message' as IconName },
  { id: 'groupe_whatsapp', label: 'Groupe WhatsApp', emoji: '👥', icon: 'users' as IconName },
  { id: 'sms', label: 'SMS', emoji: '📱', icon: 'message' as IconName },
  { id: 'messenger', label: 'Messenger', emoji: '💬', icon: 'message' as IconName },
  { id: 'email', label: 'Email', emoji: '✉️', icon: 'mail' as IconName },
  { id: 'autre', label: 'Autre', emoji: '🔗', icon: 'link' as IconName },
] as const;

export const CONTEXTES = [
  { id: 'groupe_chretien', label: 'Groupe chrétien', emoji: '✨', icon: 'sparkles' as IconName },
  { id: 'groupe_familial', label: 'Groupe familial', emoji: '🏠', icon: 'home' as IconName },
  { id: 'ami_proche', label: 'Ami proche', emoji: '❤️', icon: 'heart' as IconName },
  { id: 'groupe_pro', label: 'Groupe professionnel', emoji: '💼', icon: 'user' as IconName },
  { id: 'etudiants', label: "Groupe d'étudiants", emoji: '⭐', icon: 'star' as IconName },
  { id: 'amis', label: "Groupe d'amis", emoji: '🎉', icon: 'balloon' as IconName },
  { id: 'autre', label: 'Autre', emoji: '✨', icon: 'sparkles' as IconName },
] as const;

export const STYLES_MESSAGE = [
  { id: 'affectueux', label: 'Affectueux', emoji: '❤️', icon: 'heart' as IconName },
  { id: 'chaleureux', label: 'Chaleureux', emoji: '☀️', icon: 'star' as IconName },
  { id: 'emotionnel', label: 'Émotionnel', emoji: '💕', icon: 'heart' as IconName },
  { id: 'spirituel', label: 'Spirituel', emoji: '✨', icon: 'sparkles' as IconName },
  { id: 'drole', label: 'Drôle', emoji: '🎈', icon: 'balloon' as IconName },
  { id: 'elegant', label: 'Élégant', emoji: '✨', icon: 'sparkles' as IconName },
  { id: 'festif', label: 'Festif', emoji: '🎂', icon: 'cake' as IconName },
  { id: 'naturel', label: 'Naturel', emoji: '💬', icon: 'message' as IconName },
] as const;

export const TONS = [
  { id: 'tres_naturel', label: 'Très naturel' },
  { id: 'amical', label: 'Amical' },
  { id: 'affectueux', label: 'Affectueux' },
  { id: 'respectueux', label: 'Respectueux' },
  { id: 'formel', label: 'Formel' },
  { id: 'familier', label: 'Familier' },
] as const;

export const LONGUEURS = [
  { id: 'tres_court', label: 'Très court' },
  { id: 'court', label: 'Court' },
  { id: 'moyen', label: 'Moyen' },
  { id: 'long', label: 'Long' },
] as const;

export type RelationId = (typeof RELATIONS)[number]['id'];
export type DestinationId = (typeof DESTINATIONS)[number]['id'];
export type ContexteId = (typeof CONTEXTES)[number]['id'];
export type StyleMessageId = (typeof STYLES_MESSAGE)[number]['id'];
export type TonId = (typeof TONS)[number]['id'];
export type LongueurId = (typeof LONGUEURS)[number]['id'];

export type { CarteStickerId, CarteThemeId };

export type MessageStatut = 'a_preparer' | 'pret' | 'envoye';

export type CartePersonnalisation = {
  theme: CarteThemeId | 'perso';
  messagePerso?: string;
  photoUri?: string;
  showPhoto: boolean;
  /** Stickers doodle (max 4). Si absent → pack suggéré du thème. */
  stickers?: CarteStickerId[];
  /** Photos importées aux 4 coins (remplacent ou complètent les stickers). */
  photoStickers?: (string | null)[];
  /** Fond personnalisé (photo importée) — thème `perso`. */
  fondPersoUri?: string;
};

export type Rappels = {
  j7: boolean;
  j3: boolean;
  j1: boolean;
  j0: boolean;
  heure: string;
};

export type MessageGenere = {
  id: string;
  texte: string;
  variante: string;
  createdAt: string;
};

export type Personne = {
  id: string;
  prenom: string;
  nom: string;
  photoUri?: string;
  mois: number;
  jour: number;
  annee?: number;
  relation: RelationId;
  relationPersonnalisee?: string;
  destination: DestinationId;
  contexte: ContexteId;
  description: string;
  styles: StyleMessageId[];
  ton: TonId;
  longueur: LongueurId;
  rappels: Rappels;
  favori: boolean;
  statut: MessageStatut;
  messages: MessageGenere[];
  messageActuel?: string;
  carte?: CartePersonnalisation;
  createdAt: string;
};

export type Preferences = {
  notificationsActivees: boolean;
  heureDefaut: string;
  tonPrefere: TonId;
  longueurPreferee: LongueurId;
  emojis: boolean;
  theme: 'clair' | 'sombre';
  /** Quota journalier de génération / téléchargement de cartes */
  quotaCartes?: QuotaCartesJour;
  /** Fonds photo débloqués (payants) — URIs ou slots */
  fondsPersoDebloques?: number;
  /** Galerie de fonds photo importés (après déblocage) */
  fondsPersoUris?: string[];
};

export type PersonneDraft = Omit<Personne, 'id' | 'createdAt' | 'messages' | 'statut' | 'favori' | 'messageActuel'>;
