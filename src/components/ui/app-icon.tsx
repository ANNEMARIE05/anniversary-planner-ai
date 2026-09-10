import Feather from '@expo/vector-icons/Feather';
import type { StyleProp, TextStyle } from 'react-native';

type IconName =
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
  | 'eye-off';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const MAP: Record<IconName, keyof typeof Feather.glyphMap> = {
  home: 'home',
  calendar: 'calendar',
  people: 'users',
  sparkles: 'message-circle',
  settings: 'sliders',
  add: 'plus',
  back: 'chevron-left',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  share: 'share-2',
  copy: 'copy',
  star: 'star',
  search: 'search',
  logout: 'log-out',
  edit: 'edit-2',
  user: 'user',
  mail: 'mail',
  lock: 'lock',
  eye: 'eye',
  'eye-off': 'eye-off',
};

export function AppIcon({ name, size = 22, color = '#1A1414', style }: Props) {
  return <Feather name={MAP[name]} size={size} color={color} style={style} />;
}
