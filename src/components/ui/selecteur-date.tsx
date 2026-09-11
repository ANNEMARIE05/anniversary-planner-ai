import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateAnniv, weekdayFor } from '@/lib/labels';

export type DateAnnivValue = {
  jour: number;
  mois: number;
  annee?: number;
};

type Props = {
  label?: string;
  hint?: string;
  value: DateAnnivValue;
  onChange: (value: DateAnnivValue) => void;
  /** Si true, l’année peut rester vide. */
  anneeFacultative?: boolean;
  style?: StyleProp<ViewStyle>;
};

const MOIS = [
  { id: 1, label: 'janvier' },
  { id: 2, label: 'février' },
  { id: 3, label: 'mars' },
  { id: 4, label: 'avril' },
  { id: 5, label: 'mai' },
  { id: 6, label: 'juin' },
  { id: 7, label: 'juillet' },
  { id: 8, label: 'août' },
  { id: 9, label: 'septembre' },
  { id: 10, label: 'octobre' },
  { id: 11, label: 'novembre' },
  { id: 12, label: 'décembre' },
] as const;

type Field = 'jour' | 'mois' | 'annee';

function daysInMonth(mois: number, annee?: number) {
  const y = annee ?? 2000;
  return new Date(y, mois, 0).getDate();
}

function clampJour(jour: number, mois: number, annee?: number) {
  const max = daysInMonth(mois, annee);
  return Math.min(Math.max(jour, 1), max);
}

export function SelecteurDate({
  label,
  hint,
  value,
  onChange,
  anneeFacultative = false,
  style,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [openField, setOpenField] = useState<Field | null>(null);

  const currentYear = new Date().getFullYear();
  const annees = useMemo(() => {
    const list: { id: number | null; label: string }[] = [];
    if (anneeFacultative) list.push({ id: null, label: 'Non précisée' });
    for (let y = currentYear; y >= 1920; y -= 1) {
      list.push({ id: y, label: String(y) });
    }
    return list;
  }, [anneeFacultative, currentYear]);

  const jours = useMemo(() => {
    const max = daysInMonth(value.mois || 1, value.annee);
    return Array.from({ length: max }, (_, i) => ({ id: i + 1, label: String(i + 1) }));
  }, [value.mois, value.annee]);

  const dateLabel =
    value.jour >= 1 && value.mois >= 1 && value.mois <= 12
      ? formatDateAnniv(value.jour, value.mois)
      : '—';

  const weekday =
    value.jour >= 1 && value.mois >= 1 && value.mois <= 12
      ? weekdayFor(value.jour, value.mois)
      : 'Choisissez le jour et le mois';

  const moisLabel = MOIS.find((m) => m.id === value.mois)?.label ?? 'Mois';

  const patch = (partial: Partial<DateAnnivValue>) => {
    const mois = partial.mois ?? value.mois;
    const annee = 'annee' in partial ? partial.annee : value.annee;
    const jour = clampJour(partial.jour ?? value.jour, mois, annee);
    onChange({ jour, mois, annee });
  };

  const options =
    openField === 'jour'
      ? jours
      : openField === 'mois'
        ? MOIS.map((m) => ({ id: m.id, label: m.label }))
        : annees;

  const sheetTitle =
    openField === 'jour' ? 'Jour' : openField === 'mois' ? 'Mois' : 'Année de naissance';

  const initialIndex = useMemo(() => {
    if (openField === 'jour') return Math.max(0, value.jour - 1);
    if (openField === 'mois') return Math.max(0, value.mois - 1);
    if (openField === 'annee') {
      const idx = annees.findIndex((a) => a.id === (value.annee ?? null));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [openField, value.jour, value.mois, value.annee, annees]);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}

      <Text style={[styles.bigDate, { color: theme.text }]}>{dateLabel}</Text>
      <Text style={[styles.weekday, { color: theme.primary }]}>{weekday}</Text>

      <SelectField
        label="Jour"
        value={String(value.jour)}
        onPress={() => setOpenField('jour')}
      />
      <SelectField
        label="Mois"
        value={moisLabel}
        onPress={() => setOpenField('mois')}
      />
      <SelectField
        label={anneeFacultative ? 'Année de naissance (facultatif)' : 'Année de naissance'}
        value={value.annee != null ? String(value.annee) : 'Non précisée'}
        onPress={() => setOpenField('annee')}
      />

      {hint ? <Text style={[styles.hint, { color: theme.textSecondary }]}>{hint}</Text> : null}

      <Modal
        visible={openField != null}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenField(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenField(null)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.backgroundElement,
                paddingBottom: insets.bottom + 12,
              },
            ]}
            onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>{sheetTitle}</Text>
              <Pressable onPress={() => setOpenField(null)} hitSlop={8}>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>Fermer</Text>
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              style={{ maxHeight: 360 }}
              initialScrollIndex={Math.min(initialIndex, Math.max(0, options.length - 1))}
              getItemLayout={(_, index) => ({ length: 60, offset: 60 * index, index })}
              renderItem={({ item }) => {
                const selected =
                  openField === 'jour'
                    ? item.id === value.jour
                    : openField === 'mois'
                      ? item.id === value.mois
                      : item.id === (value.annee ?? null);
                return (
                  <Pressable
                    onPress={() => {
                      if (openField === 'jour') patch({ jour: item.id as number });
                      else if (openField === 'mois') patch({ mois: item.id as number });
                      else patch({ annee: (item.id as number | null) ?? undefined });
                      setOpenField(null);
                    }}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selected ? theme.primarySoft : 'transparent',
                        borderColor: selected ? theme.primary : theme.border,
                      },
                    ]}>
                    <Text
                      style={{
                        color: selected ? theme.primaryDark : theme.text,
                        fontWeight: selected ? '700' : '500',
                        fontSize: 16,
                      }}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function SelectField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.text }]}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={[
          styles.select,
          { backgroundColor: theme.input, borderColor: theme.border },
        ]}>
        <Text style={[styles.selectValue, { color: theme.text }]}>{value}</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>▼</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  label: { fontSize: 15, fontWeight: '600' },
  bigDate: { fontSize: 28, fontWeight: '800' },
  weekday: { fontWeight: '600', marginBottom: 4 },
  fieldWrap: { gap: Spacing.two },
  fieldLabel: { fontSize: 15, fontWeight: '600' },
  select: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    minHeight: 54,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: { fontSize: 16, fontWeight: '500', textTransform: 'capitalize' },
  hint: { fontSize: 13, lineHeight: 18 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800' },
  option: {
    height: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    marginBottom: 8,
  },
});
