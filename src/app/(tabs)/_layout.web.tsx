import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="home">Accueil</TabButton>
          </TabTrigger>
          <TabTrigger name="calendrier" href="/calendrier" asChild>
            <TabButton icon="calendar">Calendrier</TabButton>
          </TabTrigger>
          <TabTrigger name="personnes" href="/personnes" asChild>
            <TabButton icon="gift">Liste</TabButton>
          </TabTrigger>
          <TabTrigger name="reseau" href={'/reseau' as never} asChild>
            <TabButton icon="users">Réseau</TabButton>
          </TabTrigger>
          <TabTrigger name="assistant" href="/assistant" asChild>
            <TabButton icon="sparkles">Messages</TabButton>
          </TabTrigger>
          <TabTrigger name="parametres" href="/parametres" asChild>
            <TabButton icon="user">Profil</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabTriggerSlotProps & {
  icon: 'home' | 'calendar' | 'gift' | 'sparkles' | 'user' | 'users';
}) {
  const theme = useTheme();
  const color = isFocused ? theme.primary : theme.navMuted;
  return (
    <Pressable {...props} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View
        style={[
          styles.tabBtn,
          {
            backgroundColor: isFocused ? theme.primarySoft : 'transparent',
          },
        ]}>
        <AppIcon name={icon} size={20} color={color} />
        <Text style={{ fontSize: 11, fontWeight: '700', color }}>{children}</Text>
      </View>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  return (
    <View {...props} style={styles.tabListContainer}>
      <View
        style={[
          styles.innerContainer,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    borderWidth: 1,
    gap: 4,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
});
