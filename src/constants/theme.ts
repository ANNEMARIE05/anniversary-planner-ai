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

export type CarteThemeId = (typeof CARTE_FONDS)[number]['id'];

/** Stickers doodle aux couleurs de la marque (carte d’anniversaire) */
export const CARTE_STICKERS = [
  { id: 'cake', label: 'Gâteau' },
  { id: 'gift', label: 'Cadeau' },
  { id: 'balloon', label: 'Ballon' },
  { id: 'hat', label: 'Fête' },
  { id: 'star', label: 'Étoile' },
  { id: 'heart', label: 'Cœur' },
] as const;

export type CarteStickerId = (typeof CARTE_STICKERS)[number]['id'];

/** Packs stickers suggérés selon le fond de carte */
export const STICKERS_PAR_THEME: Record<CarteThemeId, readonly CarteStickerId[]> = {
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
  themeId?: CarteThemeId | string | null,
  stickers?: readonly CarteStickerId[] | null,
): CarteStickerId[] {
  if (Array.isArray(stickers)) {
    return stickers.slice(0, STICKER_SLOTS.length);
  }
  const pack =
    (themeId && STICKERS_PAR_THEME[themeId as CarteThemeId]) || STICKERS_PAR_THEME.pastel;
  return [...pack];
}

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
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
  pill: 999,
} as const;

/** Réserve pour la barre d’onglets web (position absolute). Sur natif, NativeTabs gère l’inset. */
export const BottomTabInset = Platform.select({ web: 88, default: 0 }) ?? 0;
export const MaxContentWidth = 800;
