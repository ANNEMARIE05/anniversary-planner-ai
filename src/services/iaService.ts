import { labelContexte, labelDestination, labelRelation, uid } from '@/lib/labels';
import type { MessageGenere, Personne } from '@/types/anniversaire';

export type GenerationProgress = {
  label: string;
  done: boolean;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildVariants(personne: Personne): MessageGenere[] {
  const name = personne.prenom;
  const relation = labelRelation(personne.relation, personne.relationPersonnalisee);
  const contexte = labelContexte(personne.contexte);
  const destination = labelDestination(personne.destination);
  const note = personne.description.trim();
  const now = new Date().toISOString();
  const spiritual = personne.styles.includes('spirituel') || personne.contexte === 'groupe_chretien';
  const funny = personne.styles.includes('drole');
  const emotional = personne.styles.includes('emotionnel') || personne.styles.includes('affectueux');

  const chaleureux = `Joyeux anniversaire ${name} 🎂
En ce jour particulier, je voulais simplement te rappeler combien tu comptes.
Que cette nouvelle année soit remplie de belles choses, de paix et de bonheur.
Profite pleinement de ta journée ✨`;

  const emotionnel = `Joyeux anniversaire ${name} ❤️
Tu es une personne précieuse${note ? ', et je pense souvent à tout ce que tu apportes' : ''}.
Merci d’être ${relation.toLowerCase()} dans ma vie.
Je te souhaite une année douce, lumineuse et pleine de belles surprises.`;

  const spirituel = `Joyeux anniversaire ${name} 🙏
Que le Seigneur te bénisse abondamment en cette nouvelle année.
Qu’Il t’accorde sa paix, sa joie et sa faveur chaque jour.
Merci pour ta présence précieuse${contexte.includes('chrétien') ? ' dans notre communauté' : ''}.
Que cette journée soit remplie de gratitude et d’amour.`;

  const drole = `Joyeux anniversaire ${name} 🎉
Encore un an de sagesse… ou au moins d’excellent humour !
Profite bien, mange du gâteau, et que cette année te réserve plein de belles surprises.
On célèbre ça comme il faut 😄🎂`;

  const elegant = `Joyeux anniversaire ${name}.
Je te souhaite une journée élégante et sereine, à la hauteur de la personne que tu es.
Que cette nouvelle année t’apporte réussite, équilibre et moments précieux.`;

  const court = `Joyeux anniversaire ${name} 🎂✨
Passe une magnifique journée !`;

  const variants: { label: string; texte: string }[] = [];

  if (personne.longueur === 'tres_court' || personne.longueur === 'court') {
    variants.push({ label: 'Court', texte: court });
  }

  if (spiritual) variants.push({ label: 'Spirituel', texte: spirituel });
  if (funny) variants.push({ label: 'Drôle', texte: drole });
  if (emotional) variants.push({ label: 'Émotionnel', texte: emotionnel });
  variants.push({ label: 'Chaleureux', texte: chaleureux });
  variants.push({ label: 'Élégant', texte: elegant });

  if (destination.includes('Groupe') || destination.includes('groupe')) {
    variants.push({
      label: 'Groupe',
      texte: `Joyeux anniversaire ${name} 🎂
Toute l’équipe / le groupe te souhaite une journée merveilleuse !
Merci pour ta présence et ta bonne énergie. Passe un excellent anniversaire ✨`,
    });
  }

  return variants.slice(0, 3).map((v) => ({
    id: uid(),
    texte: v.texte,
    variante: v.label,
    createdAt: now,
  }));
}

function applyModifier(texte: string, instruction: string) {
  switch (instruction) {
    case 'plus_naturel':
      return texte
        .replace(/En ce jour particulier, /g, '')
        .replace(/Que cette nouvelle année/g, 'Que cette année')
        .replace(/\n\n/g, '\n');
    case 'plus_court':
      return texte
        .split('\n')
        .filter(Boolean)
        .slice(0, 3)
        .join('\n');
    case 'plus_emotion':
      return `${texte}\nTu comptes vraiment beaucoup pour moi.`;
    case 'plus_spirituel':
      return `${texte}\nQue Dieu te garde et te bénisse 🙏`;
    case 'plus_humour':
      return `${texte}\nEt n’oublie pas le gâteau… c’est obligatoire 😄`;
    case 'sans_emojis':
      return texte.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/  +/g, ' ').trim();
    default:
      return texte;
  }
}

export const iaService = {
  async genererMessage(
    personne: Personne,
    onProgress?: (steps: GenerationProgress[]) => void,
  ): Promise<MessageGenere[]> {
    const steps: GenerationProgress[] = [
      { label: 'Compréhension du contexte', done: false },
      { label: 'Analyse de votre relation', done: false },
      { label: 'Recherche du ton approprié', done: false },
      { label: 'Rédaction', done: false },
    ];
    onProgress?.([...steps]);

    for (let i = 0; i < steps.length; i++) {
      await delay(350 + Math.random() * 250);
      steps[i] = { ...steps[i], done: true };
      onProgress?.([...steps]);
    }

    await delay(200);
    return buildVariants(personne);
  },

  async regenererMessage(personne: Personne): Promise<MessageGenere[]> {
    await delay(900);
    return buildVariants(personne).map((m) => ({
      ...m,
      id: uid(),
      createdAt: new Date().toISOString(),
    }));
  },

  async modifierMessage(texte: string, instruction: string): Promise<string> {
    await delay(700);
    return applyModifier(texte, instruction);
  },
};
