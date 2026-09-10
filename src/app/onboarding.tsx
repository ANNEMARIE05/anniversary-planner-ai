import { router } from 'expo-router';
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

import { BoutonPrincipal } from '@/components/ui/bouton-principal';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAnniversaireStore } from '@/store/anniversaire-store';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🎂',
    title: 'N’oubliez plus\nles personnes importantes.',
    subtitle: 'Gardez près de vous tous les anniversaires qui comptent vraiment.',
  },
  {
    emoji: '📅',
    title: 'Planifiez vos anniversaires\net vos rappels.',
    subtitle: 'Choisissez quand être prévenu : 7 jours, 3 jours, la veille ou le jour J.',
  },
  {
    emoji: '✨',
    title: 'Trouvez les bons mots\ngrâce à votre assistant.',
    subtitle: 'Un message personnalisé selon le contexte, la relation et le ton souhaité.',
  },
  {
    emoji: '❤️',
    title: 'Célébrez les personnes\nqui comptent pour vous.',
    subtitle: 'Copiez, partagez, et envoyez le message parfait au bon moment.',
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
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
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
                { backgroundColor: i === index ? Colors.light.primary : Colors.light.border },
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
  emojiWrap: {
    width: 110,
    height: 110,
    borderRadius: Radius.xl,
    backgroundColor: Colors.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  emoji: { fontSize: 48 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.light.text,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  footer: { paddingHorizontal: Spacing.four, gap: Spacing.three },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  skip: { textAlign: 'center', color: Colors.light.textSecondary, fontWeight: '600' },
});
