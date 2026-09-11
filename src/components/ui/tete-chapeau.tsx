import type { StyleProp, ViewStyle } from 'react-native';

import { OrnementFete } from '@/components/ui/ornement-fete';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  letter?: string;
};

/** @deprecated Utiliser OrnementFete — alias de compatibilité. */
export function TeteChapeau({ size = 64, style, animated = true, letter = 'A' }: Props) {
  return <OrnementFete letter={letter} size={size} style={style} animated={animated} />;
}
