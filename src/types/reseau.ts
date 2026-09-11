export type ConnexionStatut = 'aucune' | 'en_attente' | 'connecte' | 'recu';

export type UtilisateurReseau = {
  id: string;
  prenom: string;
  nom: string;
  jour: number;
  mois: number;
  annee?: number;
  bio: string;
  ville: string;
  interets: string[];
  photoUri?: string;
};

export type Connexion = {
  userId: string;
  statut: Exclude<ConnexionStatut, 'aucune'>;
  depuis: string;
};
