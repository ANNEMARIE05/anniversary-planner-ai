/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export function useTheme() {
  const themePref = useAnniversaireStore((s) => s.preferences.theme);

  if (themePref === 'sombre') {
    return Colors.dark;
  }

  return Colors.light;
}
