import * as Sharing from 'expo-sharing';

export async function telechargerCarte(
  uri: string | undefined,
  titre = 'Carte anniversaire',
): Promise<{ ok: boolean; erreur?: { title: string; message: string } }> {
  if (!uri) {
    return {
      ok: false,
      erreur: { title: 'Erreur', message: 'Impossible de générer l’image de la carte.' },
    };
  }
  try {
    const can = await Sharing.isAvailableAsync();
    if (!can) {
      return {
        ok: false,
        erreur: {
          title: 'Indisponible',
          message: 'Le partage / téléchargement n’est pas disponible sur cet appareil.',
        },
      };
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: titre,
      UTI: 'public.png',
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      erreur: { title: 'Erreur', message: 'Le téléchargement a échoué. Réessayez.' },
    };
  }
}
