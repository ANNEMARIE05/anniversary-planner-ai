import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const LOGO_MARK = require('../../../assets/images/logo-mark.png');
const LOGO_WORDMARK = require('../../../assets/images/logo-wordmark.png');

/** Ratio hauteur / largeur des PNG sources. */
const RATIO = {
  icon: 366 / 416,
  complet: 276 / 302,
} as const;

type Props = {
  /** Largeur du logo. */
  size?: number;
  variant?: 'icon' | 'complet';
  style?: StyleProp<ViewStyle>;
};

/** Logo Souhait (cœur-cadeau). */
export function LogoApp({ size = 56, variant = 'icon', style }: Props) {
  const height = Math.round(size * RATIO[variant]);
  const radius = Math.round(size * 0.22);
  return (
    <View style={[{ width: size, height, borderRadius: radius, overflow: 'hidden' }, style]}>
      <Image
        source={variant === 'complet' ? LOGO_WORDMARK : LOGO_MARK}
        style={[styles.logo, { width: size, height }]}
        resizeMode="contain"
        accessibilityLabel="Souhait"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: 'transparent',
  },
});
