import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

const LOGO = require('../../../assets/images/logo.png');

type Props = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

/** Logo Anniversary Planner AI (PNG local). */
export function LogoApp({ size = 56, style }: Props) {
  return (
    <Image
      source={LOGO}
      style={[styles.logo, { width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel="Anniversary Planner AI"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: 'transparent',
  },
});
