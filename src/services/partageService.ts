import { Share, Platform } from 'react-native';

export const partageService = {
  async partagerMessage(message: string, titre = 'Message d’anniversaire') {
    try {
      await Share.share(
        Platform.OS === 'ios'
          ? { message, title: titre }
          : { message, title: titre },
      );
      return true;
    } catch {
      return false;
    }
  },
};
