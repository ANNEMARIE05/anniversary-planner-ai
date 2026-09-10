import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { emojiRelation, formatDateAnniv, monthLabel } from '@/lib/labels';
import { useAnniversaireStore } from '@/store/anniversaire-store';

export default function CalendrierScreen() {
  const theme = useTheme();
  const personnes = useAnniversaireStore((s) => s.personnes);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // lundi = 0

  const byDay = useMemo(() => {
    const map = new Map<number, typeof personnes>();
    personnes.forEach((p) => {
      if (p.mois === month) {
        const list = map.get(p.jour) ?? [];
        list.push(p);
        map.set(p.jour, list);
      }
    });
    return map;
  }, [personnes, month]);

  const selected = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  const prev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const next = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  return (
    <Screen title="Calendrier" subtitle="Vos anniversaires du mois" tabSafe>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.three }}>
        <View style={styles.nav}>
          <Pressable onPress={prev} style={[styles.navBtn, { backgroundColor: theme.primarySoft }]}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>‹</Text>
          </Pressable>
          <Text style={[styles.month, { color: theme.text }]}>
            {monthLabel(month)} {year}
          </Text>
          <Pressable onPress={next} style={[styles.navBtn, { backgroundColor: theme.primarySoft }]}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>›</Text>
          </Pressable>
        </View>

        <View style={[styles.calendar, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.weekRow}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <Text key={`${d}-${i}`} style={[styles.weekDay, { color: theme.textSecondary }]}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {Array.from({ length: startWeekday }).map((_, i) => (
              <View key={`e-${i}`} style={styles.cell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const has = byDay.has(day);
              const active = selectedDay === day;
              const isToday =
                day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear();
              return (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.cell,
                    active && { backgroundColor: theme.primary },
                    !active && isToday && { borderColor: theme.primary, borderWidth: 1.5 },
                  ]}>
                  <Text
                    style={{
                      color: active ? '#FFF' : theme.text,
                      fontWeight: has || active ? '700' : '500',
                    }}>
                    {day}
                  </Text>
                  {has ? (
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: active ? '#FFF' : theme.primary },
                      ]}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedDay ? (
          <View style={{ gap: Spacing.two }}>
            <Text style={[styles.section, { color: theme.text }]}>
              {selectedDay} {monthLabel(month)}
            </Text>
            {selected.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>Aucun anniversaire ce jour-là.</Text>
            ) : (
              selected.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(`/personne/${p.id}`)}
                  style={[styles.person, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 20 }}>{emojiRelation(p.relation)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}>
                      {p.prenom} {p.nom}
                    </Text>
                    <Text style={{ color: theme.textSecondary }}>
                      {formatDateAnniv(p.jour, p.mois)}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        ) : personnes.length === 0 ? (
          <EmptyState
            emoji="📅"
            title="Aucun anniversaire"
            subtitle="Ajoutez des personnes pour voir leurs dates ici."
            actionLabel="Ajouter"
            onAction={() => router.push('/ajouter')}
          />
        ) : (
          <Text style={{ color: theme.textSecondary }}>Sélectionnez un jour pour voir les détails.</Text>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: { fontSize: 20, fontWeight: '700', textTransform: 'capitalize' },
  calendar: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.three, gap: Spacing.two },
  weekRow: { flexDirection: 'row' },
  weekDay: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
  section: { fontSize: 18, fontWeight: '700' },
  person: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
