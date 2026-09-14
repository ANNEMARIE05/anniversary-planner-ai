export type GuideId =
  | 'accueil'
  | 'calendrier'
  | 'personnes'
  | 'reseau'
  | 'messages'
  | 'parametres'
  | 'exemples';

/** Une phrase par onglet : à quoi ça sert, sans jargon. */
export const ONGLET = {
  accueil: {
    titre: 'Accueil',
    sousTitre: 'Ce qui arrive bientôt, en un coup d’œil.',
    guideTitre: 'Par où commencer ?',
    guide: 'Ajoutez une personne — date et lien suffisent. Messages, cartes et réseau peuvent attendre.',
    action: 'Ajouter quelqu’un',
    exemples:
      'Marie, David et les autres sont des exemples pour découvrir l’app. Ajoutez vos proches quand vous voulez.',
  },
  calendrier: {
    titre: 'Dates',
    sousTitre: 'Vue du mois. Un point = un anniversaire.',
    guideTitre: 'Lire le mois',
    guide: 'Touchez un jour avec un point pour voir qui fête. Les dates reviennent chaque année.',
  },
  personnes: {
    titre: 'Proches',
    sousTitre: 'Votre carnet : tous ceux que vous suivez.',
    guideTitre: 'Votre carnet',
    guide: 'Ouvrez une fiche pour modifier, préparer un message ou mettre en favori.',
  },
  reseau: {
    titre: 'Réseau',
    sousTitre: 'Invitez, devenez amis, puis ajoutez leur date.',
    guideTitre: 'Un cercle à part',
    guide: 'Inviter → ils acceptent → vous devenez amis → vous pouvez ajouter leur date à votre calendrier. Ce n’est pas la même liste que Personnes.',
  },
  messages: {
    titre: 'Vœux',
    sousTitre: 'Un texte ou une carte, prêt pour le jour J.',
    guideTitre: 'Comment ça s’utilise',
    guide: '4 souhaits gratuits par jour : un message ou une carte. Ensuite, 100 FCFA pour en recharger 4.',
  },
  parametres: {
    titre: 'Profil',
    sousTitre: 'Votre compte et vos préférences.',
    guideTitre: 'Vos réglages',
    guide: 'Votre date de naissance sert au réseau. Le reste reste sur cet appareil.',
  },
} as const;

export const REGLAGES = {
  compte: 'Photo, nom et date — pour vous reconnaître et activer le réseau.',
  naissance: 'Le réseau s’en sert pour vous proposer des profils proches de vos dates.',
  reseau: 'Trouver des proches et, une fois amis, ajouter leur date à votre calendrier.',
  notifications: 'Un rappel avant le jour J, à l’heure choisie, sur cet appareil.',
  heure: 'Heure des rappels si une personne n’a pas d’heure à elle.',
  messages: '4 souhaits gratuits par jour. Les emojis s’ajoutent aux textes générés.',
  apparence: 'Thème et couleur de toute l’application.',
  donnees: 'Tout est enregistré sur cet appareil. L’export crée un fichier à partager.',
} as const;

export const AUTH = {
  connexion: 'Retrouvez vos dates et préparez vos vœux.',
  inscription: 'Quelques infos pour commencer. Votre date sert surtout au réseau.',
} as const;

export const AJOUT = {
  etape1: 'Le jour et le mois suffisent. L’année et la photo peuvent attendre.',
  etape2: 'Le canal sert à adapter le texte, pas à l’envoyer à votre place.',
  etape3: 'L’assistant s’en sert pour le ton. Vous pourrez changer ça plus tard.',
  etape4: 'On vous prévient avant, pour avoir le temps de préparer. Le message se génère ensuite.',
} as const;

export const FICHE = {
  infos: 'Ces choix guident le texte généré. Ils ne lancent aucun envoi.',
  messageVide: 'Aucun texte pour l’instant. Générez-en un quand vous voulez.',
} as const;

export const MESSAGE = {
  avant: 'Un texte à copier, puis une carte si vous voulez. Chaque génération compte pour le quota du jour.',
  apres: 'Copiez le texte, téléchargez la carte, ou ajustez encore.',
} as const;

export const HEURES_DEFAUT = ['07:00', '08:00', '09:00', '10:00', '12:00', '18:00', '20:00'] as const;
