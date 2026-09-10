import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  iconNode?: ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BoutonPrincipal({
  label,
  variant = 'primary',
  icon,
  iconNode,
  style,
  disabled,
  ...rest
}: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bg =
    variant === 'primary'
      ? theme.primary
      : variant === 'secondary'
        ? theme.primarySoft
        : 'transparent';
  const color = variant === 'primary' ? '#FFFFFF' : theme.primary;

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.97, { reduceMotion: ReduceMotion.Never });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { reduceMotion: ReduceMotion.Never });
      }}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === 'ghost' ? 1.5 : 0,
          borderColor: theme.border,
          shadowColor: theme.primary,
        },
        variant === 'primary' && styles.shadow,
        anim,
        style,
      ]}>
      <View style={styles.row}>
        {iconNode ?? (icon ? <Text style={styles.icon}>{icon}</Text> : null)}
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  shadow: {
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  label: { fontSize: 16, fontWeight: '700' },
});
