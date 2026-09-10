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
  },
} as const;

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
