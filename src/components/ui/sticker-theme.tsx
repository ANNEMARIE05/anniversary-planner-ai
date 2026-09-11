import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CarteStickerId } from '@/constants/theme';

type StickerMeta = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bg: string;
};

/** Stickers Anniv — Material Community Icons, pastilles aux couleurs marque. */
export const STICKER_LOOK: Record<CarteStickerId, StickerMeta> = {
  cake: { icon: 'cake-variant', color: '#F15B62', bg: '#FFE8E8' },
  gift: { icon: 'gift', color: '#E07A5F', bg: '#FFF0E8' },
  balloon: { icon: 'balloon', color: '#F15B62', bg: '#FFE4E8' },
  hat: { icon: 'party-popper', color: '#D4A017', bg: '#FFF6D9' },
  star: { icon: 'star-four-points', color: '#F5B942', bg: '#FFF8E6' },
  heart: { icon: 'heart', color: '#F15B62', bg: '#FFE8E8' },
};

type Props = {
  id: CarteStickerId;
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** Sans fond (picker compact) */
  bare?: boolean;
};

export function StickerTheme({ id, size = 40, style, bare }: Props) {
  const look = STICKER_LOOK[id];
  const iconSize = Math.round(size * (bare ? 0.9 : 0.52));

  if (bare) {
    return (
      <MaterialCommunityIcons
        name={look.icon}
        size={iconSize}
        color={look.color}
        style={style as never}
      />
    );
  }

  return (
    <View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: look.bg,
          borderColor: look.color,
        },
        style,
      ]}>
      <MaterialCommunityIcons name={look.icon} size={iconSize} color={look.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#F15B62',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
