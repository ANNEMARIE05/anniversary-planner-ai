import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Option = { id: string; label: string; emoji?: string };

type Props = {
  options: readonly Option[] | Option[];
  value?: string | string[];
  multiple?: boolean;
  onChange: (id: string) => void;
};

export function SelecteurOptions({ options, value, multiple, onChange }: Props) {
  const theme = useTheme();
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[
              styles.card,
              {
                backgroundColor: active ? theme.primarySoft : theme.backgroundElement,
                borderColor: active ? theme.primary : theme.border,
              },
            ]}>
            {opt.emoji ? <Text style={styles.emoji}>{opt.emoji}</Text> : null}
            <Text style={[styles.label, { color: active ? theme.primaryDark : theme.text }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  card: {
    width: '47.5%',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: 6,
  },
  emoji: { fontSize: 22 },
  label: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
