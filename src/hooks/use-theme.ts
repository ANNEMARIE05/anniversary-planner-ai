/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export function useTheme() {
  const scheme = useColorScheme();
  const themePref = useAnniversaireStore((s) => s.preferences.theme);

  // Par défaut / préférence « clair » → toujours light
  if (themePref === 'clair' || !themePref) {
    return Colors.light;
  }
  if (themePref === 'sombre') {
    return Colors.dark;
  }

  const resolved = scheme === 'dark' ? 'dark' : 'light';
  return Colors[resolved];
}
