import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GenerationProgress } from '@/services/iaService';

type Props = { steps: GenerationProgress[] };

export function LoaderIA({ steps }: Props) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={[theme.cardGradientStart, theme.cardGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: theme.border }]}>
      <Text style={styles.spark}>✨</Text>
      <Text style={[styles.title, { color: theme.text }]}>Je prépare ton message...</Text>
      <View style={styles.list}>
        {steps.map((s, i) => (
          <Animated.View
            entering={FadeInDown.delay(i * 80).reduceMotion(ReduceMotion.Never)}
            key={s.label}
            style={styles.row}>
            <Text style={{ color: s.done ? theme.success : theme.textSecondary, fontSize: 16 }}>
              {s.done ? '✓' : '○'}
            </Text>
            <Text style={{ color: theme.text, fontSize: 15, flex: 1 }}>{s.label}</Text>
            {!s.done && i === steps.findIndex((x) => !x.done) ? (
              <Text style={{ color: theme.primary }}>...</Text>
            ) : null}
          </Animated.View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  spark: { fontSize: 40 },
  title: { fontSize: 20, fontWeight: '700' },
  list: { alignSelf: 'stretch', gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
