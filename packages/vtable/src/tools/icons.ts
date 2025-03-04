import type {
  TextIcon,
  ImageIcon,
  // NamedIcon,
  PathIcon,
  SvgIcon
} from '../ts-types';

type IconPropKey = keyof TextIcon | keyof SvgIcon | keyof ImageIcon | keyof PathIcon;
// | keyof NamedIcon;
const ICON_PROP_KEYS: IconPropKey[] = [
  //TODO 需要去掉这个逻辑  每次fontIcon新增属性 就会丢失 定位到是这里需要对应加上key
  'type',
  'content',
  'style',
  'color',
  'width',
  'height',
  'marginRight',
  'marginLeft',
  'src',
  'svg',
  'name',
  'path',
  'positionType',
  'tooltip',
  'hover',
  'cursor',
  'shape',
  'interactive',
  'isGif'
];

export const iconPropKeys = ICON_PROP_KEYS;
