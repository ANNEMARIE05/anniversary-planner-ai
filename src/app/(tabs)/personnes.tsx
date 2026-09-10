import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/screen';
import { AppIcon } from '@/components/ui/app-icon';
import { CartePersonne } from '@/components/ui/carte-personne';
import { ChampTexte } from '@/components/ui/champ-texte';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn } from '@/components/ui/fade-in';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil, isSameDay, labelRelation } from '@/lib/labels';
import { useAnniversaireStore } from '@/store/anniversaire-store';

const FILTERS = [
  { id: 'tous', label: 'Tous' },
  { id: 'favoris', label: 'Favoris' },
  { id: 'aujourd_hui', label: "Aujourd'hui" },
  { id: 'semaine', label: 'Cette semaine' },
  { id: 'mois', label: 'Ce mois' },
  { id: 'famille', label: 'Famille' },
  { id: 'amis', label: 'Amis' },
  { id: 'travail', label: 'Travail' },
  { id: 'communaute', label: 'Communauté' },
] as const;

export default function PersonnesScreen() {
  const theme = useTheme();
  const personnes = useAnniversaireStore((s) => s.personnes);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('tous');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...personnes]
      .filter((p) => {
        if (q) {
          const hay = `${p.prenom} ${p.nom} ${labelRelation(p.relation, p.relationPersonnalisee)}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        const d = daysUntil(p.jour, p.mois);
        switch (filter) {
          case 'favoris':
            return p.favori;
          case 'aujourd_hui':
            return isSameDay(p.jour, p.mois);
          case 'semaine':
            return d <= 7;
          case 'mois':
            return p.mois === new Date().getMonth() + 1;
          case 'famille':
            return p.relation === 'famille';
          case 'amis':
            return p.relation === 'ami_proche' || p.relation === 'connaissance';
          case 'travail':
            return p.relation === 'collegue' || p.relation === 'responsable';
          case 'communaute':
            return p.relation === 'communaute_chretienne' || p.relation === 'groupe';
          default:
            return true;
        }
      })
      .sort((a, b) => daysUntil(a.jour, a.mois) - daysUntil(b.jour, b.mois));
  }, [personnes, query, filter]);

  return (
    <Screen
      title="Mes personnes"
      subtitle="Tous ceux qui comptent"
      tabSafe
      right={
        <Pressable
          onPress={() => router.push('/ajouter')}
          style={[styles.add, { backgroundColor: theme.primary }]}
          accessibilityLabel="Ajouter une personne">
          <AppIcon name="add" size={22} color="#FFFFFF" />
        </Pressable>
      }>
      <ChampTexte
        placeholder="Rechercher..."
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 0 }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.primary : theme.backgroundElement,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}>
              <Text
                style={{
                  color: active ? '#FFF' : theme.text,
                  fontWeight: '600',
                  fontSize: 13,
                  lineHeight: 18,
                }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        style={styles.listScroll}>
        {filtered.length === 0 ? (
          <EmptyState
            emoji="👥"
            title="Aucune personne trouvée"
            subtitle="Ajoutez quelqu’un ou modifiez vos filtres."
            actionLabel="Ajouter une personne"
            onAction={() => router.push('/ajouter')}
          />
        ) : (
          filtered.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 30, 180)}>
              <CartePersonne personne={p} onPress={() => router.push(`/personne/${p.id}`)} />
            </FadeIn>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  add: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: { marginTop: Spacing.two, marginBottom: Spacing.two, flexGrow: 0 },
  chips: { alignItems: 'center', paddingVertical: 2, paddingRight: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listScroll: { flex: 1 },
  list: { gap: Spacing.two, paddingBottom: Spacing.four, flexGrow: 1 },
});
