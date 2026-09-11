import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { useAuthStore } from '@/store/auth-store';

export function BoutonProfil() {
  const user = useAuthStore((s) => s.user);
  return (
    <Pressable
      onPress={() => router.push('/parametres')}
      style={styles.profile}
      accessibilityLabel="Mon profil">
      <AvatarPersonne
        prenom={user?.prenom ?? 'Moi'}
        nom={user?.nom ?? ''}
        photoUri={user?.photoUri}
        size={44}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
