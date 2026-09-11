import type { StyleProp, ViewStyle } from 'react-native';

import { OrnementFete } from '@/components/ui/ornement-fete';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
};

/** @deprecated Remplacé par OrnementFete. */
export function BonhommeMascotte({ size = 64, style, animated = true }: Props) {
  return <OrnementFete letter="A" size={size} style={style} animated={animated} />;
}
