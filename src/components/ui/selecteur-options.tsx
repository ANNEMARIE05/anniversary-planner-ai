import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon, type IconName } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Option = { id: string; label: string; emoji?: string; icon?: IconName };

type Props = {
  options: readonly Option[] | Option[];
  value?: string | string[];
  multiple?: boolean;
  onChange: (id: string) => void;
};

export function SelecteurOptions({ options, value, onChange }: Props) {
  const theme = useTheme();
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        const accent = active ? theme.primary : theme.textSecondary;
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
            {opt.icon ? (
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: active ? '#FFFFFF' : theme.input,
                    borderColor: active ? theme.primary : 'transparent',
                  },
                ]}>
                <AppIcon name={opt.icon} size={20} color={accent} />
              </View>
            ) : opt.emoji ? (
              <Text style={styles.emoji}>{opt.emoji}</Text>
            ) : null}
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
    gap: 8,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  emoji: { fontSize: 22 },
  label: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
