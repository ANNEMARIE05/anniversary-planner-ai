import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppIcon, type IconName } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  name: IconName;
  size?: number;
  iconSize?: number;
  variant?: 'soft' | 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

export function IconBulle({
  name,
  size = 48,
  iconSize,
  variant = 'soft',
  style,
  delay = 0,
}: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glyph = iconSize ?? Math.round(size * 0.42);

  const bg =
    variant === 'solid'
      ? theme.primary
      : variant === 'outline'
        ? 'transparent'
        : theme.primarySoft;
  const border = variant === 'outline' ? theme.primary : 'transparent';
  const color = variant === 'solid' ? '#FFFFFF' : theme.primary;

  return (
    <Animated.View
      entering={FadeIn.delay(delay).springify().damping(14).reduceMotion(ReduceMotion.Never)}
      style={[anim, style]}
      onTouchStart={() => {
        scale.value = withSpring(0.92, { reduceMotion: ReduceMotion.Never });
      }}
      onTouchEnd={() => {
        scale.value = withSpring(1, { reduceMotion: ReduceMotion.Never });
      }}>
      <View
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2.4,
            backgroundColor: bg,
            borderColor: border,
            borderWidth: variant === 'outline' ? 1.5 : 0,
          },
        ]}>
        <AppIcon name={name} size={glyph} color={color} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
