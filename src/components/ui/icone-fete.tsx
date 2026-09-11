import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type FeteIconName =
  | 'home'
  | 'gift'
  | 'calendar'
  | 'cake'
  | 'users'
  | 'message'
  | 'settings'
  | 'add'
  | 'balloon'
  | 'hat'
  | 'star'
  | 'sparkle'
  | 'heart'
  | 'link'
  | 'search'
  | 'bell'
  | 'check'
  | 'x'
  | 'user';

type Props = {
  name: FeteIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Icônes « doodle fête » dessinées en formes simples.
 * Remplace le look Feather générique / trop IA.
 */
export function IconeFete({ name, size = 22, color, style }: Props) {
  const theme = useTheme();
  const c = color ?? theme.primary;
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {renderIcon(name, size, c, theme.accentGold)}
    </View>
  );
}

function renderIcon(name: FeteIconName, size: number, c: string, gold: string) {
  switch (name) {
    case 'home':
      return <HomeIcon size={size} color={c} />;
    case 'gift':
      return <GiftIcon size={size} color={c} ribbon={gold} />;
    case 'calendar':
      return <CalendarIcon size={size} color={c} accent={gold} />;
    case 'cake':
      return <CakeIcon size={size} color={c} flame={gold} />;
    case 'users':
      return <UsersIcon size={size} color={c} />;
    case 'message':
      return <MessageIcon size={size} color={c} />;
    case 'settings':
      return <SettingsIcon size={size} color={c} />;
    case 'add':
      return <AddIcon size={size} color={c} />;
    case 'balloon':
      return <BalloonIcon size={size} color={c} />;
    case 'hat':
      return <HatIcon size={size} color={c} pom={gold} />;
    case 'star':
      return <StarIcon size={size} color={c} />;
    case 'sparkle':
      return <SparkleIcon size={size} color={c} />;
    case 'heart':
      return <HeartIcon size={size} color={c} />;
    case 'link':
      return <LinkIcon size={size} color={c} />;
    case 'search':
      return <SearchIcon size={size} color={c} />;
    case 'bell':
      return <BellIcon size={size} color={c} />;
    case 'check':
      return <CheckIcon size={size} color={c} />;
    case 'x':
      return <XIcon size={size} color={c} />;
    case 'user':
      return <UserIcon size={size} color={c} />;
    default:
      return null;
  }
}

function HomeIcon({ size, color }: { size: number; color: string }) {
  const w = size * 0.72;
  const h = size * 0.5;
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w / 2,
          borderRightWidth: w / 2,
          borderBottomWidth: size * 0.32,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: w * 0.78,
          height: h,
          borderWidth: 2,
          borderColor: color,
          borderTopWidth: 0,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />
    </View>
  );
}

function GiftIcon({ size, color, ribbon }: { size: number; color: string; ribbon: string }) {
  const box = size * 0.62;
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: box * 0.55,
          height: size * 0.16,
          borderRadius: 3,
          backgroundColor: ribbon,
          marginBottom: 1,
        }}
      />
      <View style={{ width: box, height: box * 0.72, borderWidth: 2, borderColor: color, borderRadius: 4 }}>
        <View
          style={{
            position: 'absolute',
            left: box / 2 - 1.5,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: ribbon,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: (box * 0.72) / 2 - 1.5,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: ribbon,
          }}
        />
      </View>
    </View>
  );
}

function CalendarIcon({ size, color, accent }: { size: number; color: string; accent: string }) {
  const w = size * 0.7;
  const h = size * 0.62;
  return (
    <View style={{ width: w, height: h + 4, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: w * 0.22, marginBottom: -2, zIndex: 1 }}>
        <View style={{ width: 2.5, height: 6, borderRadius: 2, backgroundColor: color }} />
        <View style={{ width: 2.5, height: 6, borderRadius: 2, backgroundColor: color }} />
      </View>
      <View style={{ width: w, height: h, borderWidth: 2, borderColor: color, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ height: h * 0.28, backgroundColor: color }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: w * 0.28, height: w * 0.28, borderRadius: 3, backgroundColor: accent }} />
        </View>
      </View>
    </View>
  );
}

function CakeIcon({ size, color, flame }: { size: number; color: string; flame: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 3, height: size * 0.16, backgroundColor: flame, borderRadius: 2 }} />
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: flame,
          marginBottom: 1,
          marginTop: -2,
        }}
      />
      <View
        style={{
          width: size * 0.55,
          height: size * 0.22,
          borderRadius: 4,
          backgroundColor: color,
          marginBottom: 2,
        }}
      />
      <View
        style={{
          width: size * 0.72,
          height: size * 0.28,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: color,
        }}
      />
    </View>
  );
}

function UsersIcon({ size, color }: { size: number; color: string }) {
  const head = size * 0.28;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', gap: size * 0.08, alignItems: 'flex-end' }}>
        <View style={{ alignItems: 'center', opacity: 0.7 }}>
          <View style={{ width: head * 0.85, height: head * 0.85, borderRadius: 99, borderWidth: 2, borderColor: color }} />
          <View
            style={{
              width: head * 1.3,
              height: head * 0.7,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              marginTop: 2,
            }}
          />
        </View>
        <View style={{ alignItems: 'center', marginBottom: 2 }}>
          <View style={{ width: head, height: head, borderRadius: 99, borderWidth: 2, borderColor: color }} />
          <View
            style={{
              width: head * 1.45,
              height: head * 0.78,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              marginTop: 2,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function MessageIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.52,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 7,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -1,
          marginRight: size * 0.22,
        }}
      />
    </View>
  );
}

function SettingsIcon({ size, color }: { size: number; color: string }) {
  const outer = size * 0.7;
  const inner = size * 0.28;
  return (
    <View style={{ width: outer, height: outer, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: outer,
          height: outer,
          borderRadius: outer / 2,
          borderWidth: 2.5,
          borderColor: color,
          borderStyle: 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function AddIcon({ size, color }: { size: number; color: string }) {
  const bar = size * 0.62;
  const thick = Math.max(2.5, size * 0.12);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: bar, height: thick, borderRadius: 2, backgroundColor: color }} />
      <View style={{ position: 'absolute', width: thick, height: bar, borderRadius: 2, backgroundColor: color }} />
    </View>
  );
}

function BalloonIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.48,
          height: size * 0.58,
          borderRadius: size * 0.28,
          borderWidth: 2,
          borderColor: color,
        }}
      />
      <View style={{ width: 1.5, height: size * 0.22, backgroundColor: color, marginTop: 1 }} />
    </View>
  );
}

function HatIcon({ size, color, pom }: { size: number; color: string; pom: string }) {
  const w = size * 0.62;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: pom, marginBottom: -1, zIndex: 1 }} />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w / 2,
          borderRightWidth: w / 2,
          borderBottomWidth: size * 0.48,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      <View style={{ width: w * 1.15, height: 4, borderRadius: 2, backgroundColor: color, marginTop: -2 }} />
    </View>
  );
}

function StarIcon({ size, color }: { size: number; color: string }) {
  const s = size * 0.55;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: s,
          height: s,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          borderRadius: 3,
        }}
      />
    </View>
  );
}

function SparkleIcon({ size, color }: { size: number; color: string }) {
  const thick = Math.max(2, size * 0.1);
  const long = size * 0.62;
  const short = size * 0.32;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: thick, height: long, borderRadius: 2, backgroundColor: color }} />
      <View style={{ position: 'absolute', width: long, height: thick, borderRadius: 2, backgroundColor: color }} />
      <View
        style={{
          position: 'absolute',
          width: thick,
          height: short,
          borderRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: short,
          height: thick,
          borderRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function HeartIcon({ size, color }: { size: number; color: string }) {
  const s = size * 0.28;
  return (
    <View style={{ width: size * 0.7, height: size * 0.62, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 1 }}>
        <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: color }} />
        <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: color }} />
      </View>
      <View
        style={{
          width: s * 1.55,
          height: s * 1.55,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: -s * 0.55,
        }}
      />
    </View>
  );
}

function LinkIcon({ size, color }: { size: number; color: string }) {
  const r = size * 0.22;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: -2 }}>
      <View
        style={{
          width: r * 2,
          height: r * 1.4,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: color,
          transform: [{ rotate: '-25deg' }],
        }}
      />
      <View
        style={{
          width: r * 2,
          height: r * 1.4,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: color,
          transform: [{ rotate: '25deg' }],
          marginLeft: -4,
        }}
      />
    </View>
  );
}

function SearchIcon({ size, color }: { size: number; color: string }) {
  const ring = size * 0.48;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 2.5,
          borderColor: color,
          marginRight: 4,
          marginBottom: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.28,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 2,
          right: size * 0.08,
          bottom: size * 0.18,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function BellIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 4, height: 3, borderRadius: 2, backgroundColor: color, marginBottom: 1 }} />
      <View
        style={{
          width: size * 0.5,
          height: size * 0.42,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
      <View style={{ width: size * 0.62, height: 3, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color, marginTop: 1 }} />
    </View>
  );
}

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <View
      style={{
        width: size * 0.45,
        height: size * 0.28,
        borderLeftWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: color,
        transform: [{ rotate: '-45deg' }],
        marginTop: -size * 0.08,
      }}
    />
  );
}

function XIcon({ size, color }: { size: number; color: string }) {
  const bar = size * 0.55;
  const thick = 2.5;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: bar,
          height: thick,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: bar,
          height: thick,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

function UserIcon({ size, color }: { size: number; color: string }) {
  const head = size * 0.36;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: head, height: head, borderRadius: head / 2, borderWidth: 2, borderColor: color }} />
      <View
        style={{
          width: head * 1.5,
          height: head * 0.85,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
          marginTop: 2,
        }}
      />
    </View>
  );
}

/** Petite déco doodle pour empty states / stickers. */
export function StickerFete({
  kind,
  size = 28,
  color,
  style,
}: {
  kind: 'hat' | 'gift' | 'balloon' | 'star' | 'cake' | 'heart' | 'sparkle';
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return <IconeFete name={kind} size={size} color={color} style={style} />;
}
