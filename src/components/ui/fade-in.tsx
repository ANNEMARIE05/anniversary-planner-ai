import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeIn({ children, delay = 0, style }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(420)
        .springify()
        .damping(18)
        .reduceMotion(ReduceMotion.Never)}
      style={style}>
      {children}
    </Animated.View>
  );
}
