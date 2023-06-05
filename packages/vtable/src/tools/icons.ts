import type {
  FontIcon,
  ImageIcon,
  // NamedIcon,
  PathIcon,
  SvgIcon
} from '../ts-types';

type IconPropKey = keyof FontIcon | keyof SvgIcon | keyof ImageIcon | keyof PathIcon;
// | keyof NamedIcon;
const ICON_PROP_KEYS: IconPropKey[] = [
  //TODO 需要去掉这个逻辑  每次fontIcon新增属性 就会丢失 定位到是这里需要对应加上key
  'type',
  'content',
  'font',
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
  'interactive'
];

export const iconPropKeys = ICON_PROP_KEYS;
