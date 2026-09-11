import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { StickerMascotte } from '@/components/ui/sticker-mascotte';
import { useTheme } from '@/hooks/use-theme';
import { initials } from '@/lib/labels';

type Props = {
  prenom: string;
  nom: string;
  photoUri?: string;
  size?: number;
  /** Sans photo : initiales (défaut) ou mascotte Anniv */
  fallback?: 'initials' | 'mascotte';
};

export function AvatarPersonne({
  prenom,
  nom,
  photoUri,
  size = 52,
  fallback = 'initials',
}: Props) {
  const theme = useTheme();
  const fontSize = size * 0.34;

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  if (fallback === 'mascotte') {
    return <StickerMascotte expression="joyeux" taille={size} anime={false} />;
  }

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primarySoft,
          borderColor: theme.border,
        },
      ]}>
      <Text style={{ color: theme.primary, fontWeight: '700', fontSize }}>{initials(prenom, nom)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
