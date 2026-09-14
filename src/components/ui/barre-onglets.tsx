import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { type ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon, type IconName } from '@/components/ui/app-icon';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, IconName> = {
  index: 'home',
  calendrier: 'calendar',
  personnes: 'gift',
  assistant: 'message',
  reseau: 'users',
  parametres: 'user',
};

const LABELS: Record<string, string> = {
  index: 'Accueil',
  calendrier: 'Dates',
  personnes: 'Proches',
  assistant: 'Vœux',
  reseau: 'Réseau',
  parametres: 'Profil',
};

const ORDER = ['index', 'calendrier', 'personnes', 'assistant', 'reseau', 'parametres'];

export function BarreOnglets({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, Platform.OS === 'web' ? 12 : 8);

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: bottom,
          backgroundColor: theme.background,
        },
      ]}>
      <View
        style={[
          styles.dock,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
            shadowColor: theme.text,
          },
        ]}>
        <View style={styles.row}>
          {[...state.routes]
            .map((route, index) => ({ route, index }))
            .filter(({ route }) => {
              const { options } = descriptors[route.key];
              return (options as { href?: string | null }).href !== null;
            })
            .sort((a, b) => {
              const ia = ORDER.indexOf(a.route.name);
              const ib = ORDER.indexOf(b.route.name);
              return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
            })
            .map(({ route, index }) => {
              const { options } = descriptors[route.key];
              const focused = state.index === index;
              const label = LABELS[route.name] ?? options.title ?? route.name;
              const icon = ICONS[route.name] ?? 'sparkles';
              const color = focused ? theme.primary : theme.navMuted;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  try {
                    void Haptics.selectionAsync();
                  } catch {
                    // ignore
                  }
                  navigation.navigate(route.name, route.params);
                }
              };

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  accessibilityLabel={label}
                  onPress={onPress}
                  style={styles.itemWrapper}>
                  <View
                    style={[
                      styles.itemContent,
                      focused && [
                        styles.itemContentActive,
                        {
                          backgroundColor: theme.primarySoft,
                          borderColor: theme.border,
                        },
                      ],
                    ]}>
                    <AppIcon name={icon} size={19} color={color} />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.label,
                        {
                          color,
                          fontFamily: focused ? Fonts.bold : Fonts.medium,
                        },
                      ]}>
                      {label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingTop: 6,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dock: {
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 4,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemContentActive: {
    borderRadius: 14,
  },
  label: {
    fontSize: 10.5,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});
