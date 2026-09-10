import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { AvatarPersonne } from '@/components/ui/avatar-personne';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

export function BoutonProfil() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  return (
    <Pressable
      onPress={() => router.push('/parametres')}
      style={styles.profile}
      accessibilityLabel="Mon profil">
      {user ? (
        <AvatarPersonne prenom={user.prenom} nom={user.nom} size={42} />
      ) : (
        <View
          style={[
            styles.fallback,
            { borderColor: theme.border, backgroundColor: theme.primarySoft },
          ]}>
          <AppIcon name="user" size={20} color={theme.primary} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
