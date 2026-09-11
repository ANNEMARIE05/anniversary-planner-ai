/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { resolveThemeColors } from '@/constants/theme';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export function useTheme() {
  const themePref = useAnniversaireStore((s) => s.preferences.theme);
  const accentPalette = useAnniversaireStore((s) => s.preferences.accentPalette);

  return resolveThemeColors(themePref, accentPalette);
}
