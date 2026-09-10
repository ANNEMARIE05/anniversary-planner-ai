export const RELATIONS = [
  { id: 'ami_proche', label: 'Ami proche', emoji: '❤️' },
  { id: 'famille', label: 'Famille', emoji: '👨‍👩‍👧' },
  { id: 'communaute_chretienne', label: 'Communauté chrétienne', emoji: '🙏' },
  { id: 'collegue', label: 'Collègue', emoji: '💼' },
  { id: 'connaissance', label: 'Connaissance', emoji: '🤝' },
  { id: 'responsable', label: 'Responsable', emoji: '👩‍🏫' },
  { id: 'partenaire', label: 'Partenaire', emoji: '💑' },
  { id: 'groupe', label: 'Groupe', emoji: '👥' },
  { id: 'autre', label: 'Autre', emoji: '✨' },
] as const;

export const DESTINATIONS = [
  { id: 'whatsapp_prive', label: 'WhatsApp privé', emoji: '💬' },
  { id: 'groupe_whatsapp', label: 'Groupe WhatsApp', emoji: '👥' },
  { id: 'sms', label: 'SMS', emoji: '📱' },
  { id: 'messenger', label: 'Messenger', emoji: '💙' },
  { id: 'email', label: 'Email', emoji: '✉️' },
  { id: 'autre', label: 'Autre', emoji: '🔗' },
] as const;

export const CONTEXTES = [
  { id: 'groupe_chretien', label: 'Groupe chrétien', emoji: '🙏' },
  { id: 'groupe_familial', label: 'Groupe familial', emoji: '👨‍👩‍👧' },
  { id: 'ami_proche', label: 'Ami proche', emoji: '❤️' },
  { id: 'groupe_pro', label: 'Groupe professionnel', emoji: '💼' },
  { id: 'etudiants', label: "Groupe d'étudiants", emoji: '🎓' },
  { id: 'amis', label: "Groupe d'amis", emoji: '🎉' },
  { id: 'autre', label: 'Autre', emoji: '✨' },
] as const;

export const STYLES_MESSAGE = [
  { id: 'affectueux', label: 'Affectueux', emoji: '❤️' },
  { id: 'chaleureux', label: 'Chaleureux', emoji: '😊' },
  { id: 'emotionnel', label: 'Émotionnel', emoji: '🥹' },
  { id: 'spirituel', label: 'Spirituel', emoji: '🙏' },
  { id: 'drole', label: 'Drôle', emoji: '😂' },
  { id: 'elegant', label: 'Élégant', emoji: '✨' },
  { id: 'festif', label: 'Festif', emoji: '🎉' },
  { id: 'naturel', label: 'Naturel', emoji: '💬' },
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
export type MessageStatut = 'a_preparer' | 'pret' | 'envoye';

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
  createdAt: string;
};

export type Preferences = {
  notificationsActivees: boolean;
  heureDefaut: string;
  tonPrefere: TonId;
  longueurPreferee: LongueurId;
  emojis: boolean;
  theme: 'clair' | 'sombre' | 'auto';
};

export type PersonneDraft = Omit<Personne, 'id' | 'createdAt' | 'messages' | 'statut' | 'favori' | 'messageActuel'>;
