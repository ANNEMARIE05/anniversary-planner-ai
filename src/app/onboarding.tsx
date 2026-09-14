import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/components/ui/app-icon';
import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { FondAnime } from '@/components/ui/fond-anime';
import { IconBulle } from '@/components/ui/icon-bulle';
import { LogoApp } from '@/components/ui/logo-app';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAnniversaireStore } from '@/store/anniversaire-store';

const { width } = Dimensions.get('window');

const SLIDES: {
  icon: IconName;
  title: string;
  subtitle: string;
}[] = [
  {
    icon: 'gift',
    title: 'Notez les dates\nqui comptent.',
    subtitle: 'Accueil, dates et proches restent alignés : une fiche, un rappel, un vœu.',
  },
  {
    icon: 'sparkles',
    title: 'Préparez un souhait\npour le jour J.',
    subtitle: '4 messages ou cartes par jour. Rien n’est envoyé à votre place.',
  },
  {
    icon: 'users',
    title: 'Le réseau,\nquand vous serez prêt.',
    subtitle: 'Invitez, devenez amis, puis ajoutez leur date. Ce n’est pas obligatoire pour commencer.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAnniversaireStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const next = () => {
    if (index >= SLIDES.length - 1) finish();
    else listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
      <LinearGradient
        colors={[Colors.light.gradientTop, Colors.light.gradientMid, Colors.light.gradientBottom]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <FondAnime />
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <LogoApp variant="icon" size={148} />
            <IconBulle name={item.icon} size={52} delay={120} style={{ marginTop: Spacing.three }} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? Colors.light.primary : Colors.light.border,
                  width: i === index ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>
        <BoutonPrincipal
          label={index === SLIDES.length - 1 ? 'Commencer' : 'Continuer'}
          onPress={next}
        />
        {index < SLIDES.length - 1 ? (
          <Text style={styles.skip} onPress={finish}>
            Passer
          </Text>
        ) : (
          <View style={{ height: 22 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  slide: {
    paddingHorizontal: Spacing.five,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.extraBold,
    letterSpacing: -0.8,
    textAlign: 'center',
    color: Colors.light.text,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  footer: { paddingHorizontal: Spacing.four, gap: Spacing.three },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  skip: { textAlign: 'center', color: Colors.light.textSecondary, fontWeight: '600' },
});
