import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function telechargerCarte(uri: string | undefined, titre = 'Carte anniversaire') {
  if (!uri) {
    Alert.alert('Erreur', 'Impossible de générer l’image de la carte.');
    return false;
  }
  try {
    const can = await Sharing.isAvailableAsync();
    if (!can) {
      Alert.alert('Indisponible', 'Le partage / téléchargement n’est pas disponible sur cet appareil.');
      return false;
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: titre,
      UTI: 'public.png',
    });
    return true;
  } catch {
    Alert.alert('Erreur', 'Le téléchargement a échoué. Réessayez.');
    return false;
  }
}
