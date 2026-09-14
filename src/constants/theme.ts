import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1414',
    textSecondary: '#8A6F72',
    background: '#FFF4F2',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#FFE4E2',
    primary: '#F15B62',
    primaryDark: '#D94850',
    primarySoft: '#FFE8E8',
    border: '#F7C9CB',
    input: '#FFF7F7',
    nav: '#171717',
    navMuted: '#6F6F6F',
    overlay: 'rgba(23, 23, 23, 0.45)',
    success: '#2E9B67',
    gradientTop: '#FFD6D0',
    gradientMid: '#FFF1EE',
    gradientBottom: '#FFF9F4',
    gradientBlob: 'rgba(241, 91, 98, 0.16)',
    gradientBlobWarm: 'rgba(255, 138, 101, 0.14)',
    gradientBlobGold: 'rgba(245, 185, 66, 0.12)',
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#FFF3F1',
    skeletonBase: '#F5E0DE',
    skeletonHighlight: '#FFF8F7',
    accentWarm: '#FF8A65',
    accentGold: '#F5B942',
  },
  dark: {
    text: '#FFF6F5',
    textSecondary: '#C9A8AB',
    background: '#1A1213',
    backgroundElement: '#2A1C1E',
    backgroundSelected: '#3A2628',
    primary: '#F15B62',
    primaryDark: '#FF7A80',
    primarySoft: '#3A2224',
    border: '#5A383A',
    input: '#24181A',
    nav: '#0E0E0E',
    navMuted: '#A8A8A8',
    overlay: 'rgba(0, 0, 0, 0.55)',
    success: '#4ECB8C',
    gradientTop: '#3A1A1E',
    gradientMid: '#1E1214',
    gradientBottom: '#120C0D',
    gradientBlob: 'rgba(241, 91, 98, 0.22)',
    gradientBlobWarm: 'rgba(255, 138, 101, 0.16)',
    gradientBlobGold: 'rgba(245, 185, 66, 0.12)',
    cardGradientStart: '#2E1E20',
    cardGradientEnd: '#241618',
    skeletonBase: '#3A2628',
    skeletonHighlight: '#4A3234',
    accentWarm: '#FF8A65',
    accentGold: '#F5B942',
  },
} as const;

/** Fonds de cartes d’anniversaire (images chic fournies) */
export const CARTE_FONDS = [
  {
    id: 'pastel',
    label: 'Pastel chic',
    image: require('../../assets/images/cartes/cadre-pastel.png'),
    text: '#5A3040',
    muted: '#8A6070',
    accent: '#F15B62',
  },
  {
    id: 'aquarelle',
    label: 'Aquarelle',
    image: require('../../assets/images/cartes/aquarelle.png'),
    text: '#4A3A30',
    muted: '#7A6A5A',
    accent: '#E07A5F',
  },
  {
    id: 'doodle',
    label: 'Motifs fête',
    image: require('../../assets/images/cartes/motif-doodle.png'),
    text: '#2A2A2A',
    muted: '#5A5A5A',
    accent: '#F15B62',
  },
] as const;

export type CarteThemeId = (typeof CARTE_FONDS)[number]['id'] | 'perso';

/** Stickers décoratifs (la personne choisit, rien n’est imposé). */
export const CARTE_STICKERS = [
  { id: 'cake', label: 'Gâteau' },
  { id: 'gift', label: 'Cadeau' },
  { id: 'balloon', label: 'Ballon' },
  { id: 'hat', label: 'Fête' },
  { id: 'star', label: 'Étoile' },
  { id: 'heart', label: 'Cœur' },
  { id: 'flower', label: 'Fleur' },
  { id: 'champagne', label: 'Flûte' },
  { id: 'sparkle', label: 'Éclat' },
  { id: 'crown', label: 'Couronne' },
  { id: 'butterfly', label: 'Papillon' },
  { id: 'ribbon', label: 'Ruban' },
] as const;

export type CarteStickerId = (typeof CARTE_STICKERS)[number]['id'];

/** Packs stickers suggérés selon le fond de carte */
export const STICKERS_PAR_THEME: Record<Exclude<CarteThemeId, 'perso'>, readonly CarteStickerId[]> = {
  pastel: ['heart', 'star', 'gift'],
  aquarelle: ['balloon', 'gift', 'cake'],
  doodle: ['cake', 'hat', 'star', 'balloon'],
};

/** Emplacements décoratifs sur la carte (coins) */
export const STICKER_SLOTS = [
  { left: '5%' as const, top: '10%' as const, rotate: -14 },
  { right: '5%' as const, top: '12%' as const, rotate: 12 },
  { left: '6%' as const, bottom: '12%' as const, rotate: 8 },
  { right: '6%' as const, bottom: '14%' as const, rotate: -10 },
] as const;

/** @deprecated — utiliser CARTE_FONDS */
export const CARTE_THEMES = CARTE_FONDS;

export function resolveCarteStickers(
  _themeId?: CarteThemeId | string | null,
  stickers?: readonly CarteStickerId[] | null,
): CarteStickerId[] {
  if (Array.isArray(stickers)) {
    return stickers.slice(0, STICKER_SLOTS.length);
  }
  return [];
}

/** Couleurs de texte pour personnaliser la carte (pas la marque). */
export const CARTE_TEXT_COLORS = [
  { id: 'encre', label: 'Encre', hex: '#3A2A2C' },
  { id: 'bordeaux', label: 'Bordeaux', hex: '#7A3040' },
  { id: 'or', label: 'Or', hex: '#B8860B' },
  { id: 'rose', label: 'Rose', hex: '#C45C67' },
  { id: 'nuit', label: 'Nuit', hex: '#2A2430' },
  { id: 'sauge', label: 'Sauge', hex: '#4F6B58' },
  { id: 'ivoire', label: 'Ivoire', hex: '#F7F0E8' },
  { id: 'blanc', label: 'Blanc', hex: '#FFFFFF' },
] as const;

export type CarteTextColorId = (typeof CARTE_TEXT_COLORS)[number]['id'];

export const EMOJIS_CARTE = [
  '🎂',
  '🎉',
  '🥳',
  '💐',
  '🥂',
  '✨',
  '💖',
  '🌟',
  '🎁',
  '🦋',
  '🌸',
  '💌',
  '🕊️',
  '🌙',
  '👑',
  '💎',
] as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Tokens de thème (valeurs dynamiques après application d’une palette). */
export type ThemeColors = {
  [K in ThemeColor]: string;
};

/** Formes de masque pour les photos sur la carte */
export const PHOTO_FORMES = [
  { id: 'cercle', label: 'Cercle' },
  { id: 'carre', label: 'Carré' },
  { id: 'arrondi', label: 'Arrondi' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'losange', label: 'Losange' },
  { id: 'hexagone', label: 'Hexagone' },
] as const;

export type PhotoFormeId = (typeof PHOTO_FORMES)[number]['id'];

/** Formes du cadre de la carte d’anniversaire */
export const CARTE_FORMES = [
  { id: 'arrondie', label: 'Arrondie', radius: 32 },
  { id: 'douce', label: 'Très douce', radius: 48 },
  { id: 'rectangulaire', label: 'Rectangulaire', radius: 4 },
  { id: 'carree', label: 'Angles nets', radius: 0 },
] as const;

export type CarteFormeId = (typeof CARTE_FORMES)[number]['id'];

export function resolveCarteRadius(forme?: CarteFormeId | string | null): number {
  const found = CARTE_FORMES.find((f) => f.id === forme);
  return found?.radius ?? CARTE_FORMES[0].radius;
}

/** Palettes d’accent paramétrables (Apparence) */
export const ACCENT_PALETTES = [
  {
    id: 'corail',
    label: 'Corail',
    primary: '#F15B62',
    primaryDark: '#D94850',
    primarySoftLight: '#FFE8E8',
    primarySoftDark: '#3A2224',
    accentWarm: '#FF8A65',
    accentGold: '#F5B942',
    borderLight: '#F7C9CB',
    borderDark: '#5A383A',
    selectedLight: '#FFE4E2',
    selectedDark: '#3A2628',
  },
  {
    id: 'bleu',
    label: 'Bleu',
    primary: '#4A90D9',
    primaryDark: '#3574B8',
    primarySoftLight: '#E3F0FC',
    primarySoftDark: '#1A2A3A',
    accentWarm: '#5BA3E0',
    accentGold: '#F0C75E',
    borderLight: '#B8D4F0',
    borderDark: '#2A4058',
    selectedLight: '#D6EAFB',
    selectedDark: '#243448',
  },
  {
    id: 'vert',
    label: 'Vert',
    primary: '#2E9B67',
    primaryDark: '#248055',
    primarySoftLight: '#E0F5EB',
    primarySoftDark: '#1A2E24',
    accentWarm: '#5CB88A',
    accentGold: '#E8C547',
    borderLight: '#B5E0CB',
    borderDark: '#2A4838',
    selectedLight: '#D4F0E3',
    selectedDark: '#243830',
  },
  {
    id: 'violet',
    label: 'Violet',
    primary: '#8B6BC9',
    primaryDark: '#6F52A8',
    primarySoftLight: '#F0E8FA',
    primarySoftDark: '#2A2238',
    accentWarm: '#A88BE0',
    accentGold: '#E8B84A',
    borderLight: '#D4C4F0',
    borderDark: '#403058',
    selectedLight: '#E8DCF8',
    selectedDark: '#322848',
  },
  {
    id: 'orange',
    label: 'Orange',
    primary: '#E67E22',
    primaryDark: '#C46818',
    primarySoftLight: '#FDEBD8',
    primarySoftDark: '#3A2418',
    accentWarm: '#F39C4A',
    accentGold: '#F5C542',
    borderLight: '#F5D0A8',
    borderDark: '#5A3820',
    selectedLight: '#FBE0C4',
    selectedDark: '#3A2818',
  },
  {
    id: 'rose',
    label: 'Rose',
    primary: '#E85A8C',
    primaryDark: '#C94472',
    primarySoftLight: '#FCE4EE',
    primarySoftDark: '#3A1E28',
    accentWarm: '#F080A0',
    accentGold: '#F0C040',
    borderLight: '#F5C4D4',
    borderDark: '#5A3040',
    selectedLight: '#F8D4E0',
    selectedDark: '#3A2430',
  },
] as const;

export type AccentPaletteId = (typeof ACCENT_PALETTES)[number]['id'];

export function getAccentPalette(id?: AccentPaletteId | string | null) {
  return ACCENT_PALETTES.find((p) => p.id === id) ?? ACCENT_PALETTES[0];
}

/** Applique une palette d’accent sur un thème clair/sombre de base */
export function resolveThemeColors(
  mode: 'clair' | 'sombre',
  accentId?: AccentPaletteId | string | null,
): ThemeColors {
  const base = mode === 'sombre' ? Colors.dark : Colors.light;
  const accent = getAccentPalette(accentId);
  const isDark = mode === 'sombre';
  const primary = accent.primary;

  return {
    ...base,
    primary,
    primaryDark: isDark ? lightenHex(primary, 0.18) : accent.primaryDark,
    primarySoft: isDark ? accent.primarySoftDark : accent.primarySoftLight,
    border: isDark ? accent.borderDark : accent.borderLight,
    backgroundSelected: isDark ? accent.selectedDark : accent.selectedLight,
    accentWarm: accent.accentWarm,
    accentGold: accent.accentGold,
    gradientBlob: hexToRgba(primary, isDark ? 0.22 : 0.16),
    gradientBlobWarm: hexToRgba(accent.accentWarm, isDark ? 0.16 : 0.14),
    gradientBlobGold: hexToRgba(accent.accentGold, 0.12),
  };
}

function lightenHex(hex: string, amount: number): string {
  const n = hex.replace('#', '');
  const r = Math.min(255, Math.round(parseInt(n.slice(0, 2), 16) + 255 * amount));
  const g = Math.min(255, Math.round(parseInt(n.slice(2, 4), 16) + 255 * amount));
  const b = Math.min(255, Math.round(parseInt(n.slice(4, 6), 16) + 255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Plus Jakarta Sans — titres nets, comme la maquette Ticketet. */
export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const FontsLegacy = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 32,
  button: 16,
  pill: 999,
} as const;

/** Hauteur utile sous le contenu (la barre custom gère déjà le safe area). */
export const BottomTabInset = 12;
export const MaxContentWidth = 800;
