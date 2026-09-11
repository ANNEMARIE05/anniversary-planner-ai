import Feather from '@expo/vector-icons/Feather';
import type { StyleProp, TextStyle } from 'react-native';

export type IconName =
  | 'home'
  | 'calendar'
  | 'people'
  | 'sparkles'
  | 'settings'
  | 'add'
  | 'back'
  | 'search'
  | 'share'
  | 'copy'
  | 'star'
  | 'chevron-left'
  | 'chevron-right'
  | 'logout'
  | 'edit'
  | 'user'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'camera'
  | 'image'
  | 'heart'
  | 'gift'
  | 'link'
  | 'check'
  | 'x'
  | 'bell'
  | 'users'
  | 'cake'
  | 'balloon'
  | 'hat'
  | 'message';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const FEATHER_MAP: Record<IconName, keyof typeof Feather.glyphMap> = {
  home: 'home',
  calendar: 'calendar',
  people: 'users',
  users: 'users',
  sparkles: 'star',
  settings: 'settings',
  add: 'plus',
  back: 'chevron-left',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  search: 'search',
  share: 'share-2',
  copy: 'copy',
  star: 'star',
  logout: 'log-out',
  edit: 'edit-2',
  user: 'user',
  mail: 'mail',
  lock: 'lock',
  eye: 'eye',
  'eye-off': 'eye-off',
  camera: 'camera',
  image: 'image',
  heart: 'heart',
  gift: 'gift',
  link: 'link',
  check: 'check',
  x: 'x',
  bell: 'bell',
  cake: 'gift',
  balloon: 'heart',
  hat: 'award',
  message: 'message-circle',
};

/** Icônes UI propres (Feather) — tracé net, look chic. */
export function AppIcon({ name, size = 22, color = '#1A1414', style }: Props) {
  return <Feather name={FEATHER_MAP[name]} size={size} color={color} style={style} />;
}
