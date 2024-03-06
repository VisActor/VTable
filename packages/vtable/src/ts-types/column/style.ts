import type { LineWidthsPropertyDefine } from '..';
import { PaddingPropertyDefine } from '..';
import type {
  ColorPropertyDefine,
  ColorsPropertyDefine,
  IconPropertyDefine,
  LineClamp,
  LineDashsPropertyDefine,
  TextOverflow,
  UnderlinePropertyDefine,
  LineDashPropertyDefine,
  LineThroughPropertyDefine,
  TagPropertyDefine,
  PaddingsPropertyDefine,
  StylePropertyFunctionArg,
  CursorPropertyDefine,
  MarkedPropertyDefine,
  FontSizePropertyDefine,
  FontFamilyPropertyDefine,
  FontWeightPropertyDefine,
  FontVariantPropertyDefine,
  FontStylePropertyDefine,
  TextAlignType,
  TextBaselineType
} from '../style-define';
import type { ThemeStyle } from '../theme';
//这个style是在绘制里面的内容时用到的，用不到borderColor和borderLineWidth，所以和IStyleOption有些不一致
export interface ColumnStyle {
  padding?: PaddingsPropertyDefine;
  bgColor?: ColorPropertyDefine;
  // eslint-disable-next-line no-undef
  textAlign?: TextAlignType;
  // eslint-disable-next-line no-undef
  textBaseline?: TextBaselineType;
  color?: ColorPropertyDefine;

  fontSize?: FontSizePropertyDefine;
  fontFamily?: FontFamilyPropertyDefine;
  fontWeight?: FontWeightPropertyDefine;
  fontVariant?: FontVariantPropertyDefine;
  fontStyle?: FontStylePropertyDefine;

  textOverflow?: TextOverflow;
  // doChangeStyle: () => void;
  clone: () => ColumnStyle;
  linkColor?: ColorPropertyDefine;
}

export type IHeaderStyle = ColumnStyle;

export type ISortheaderSyle = IHeaderStyle;

export interface IStyleOption {
  bgColor?: ColorPropertyDefine;
  padding?: PaddingsPropertyDefine;
  textAlign?: TextAlignType;
  textBaseline?: TextBaselineType;
  color?: ColorPropertyDefine;

  fontSize?: FontSizePropertyDefine;
  fontFamily?: FontFamilyPropertyDefine;
  fontWeight?: FontWeightPropertyDefine;
  fontVariant?: FontVariantPropertyDefine;
  fontStyle?: FontStylePropertyDefine;

  textOverflow?: TextOverflow;
  borderColor?: ColorsPropertyDefine;
  borderLineWidth?: LineWidthsPropertyDefine;

  lineHeight?: number;
  underline?: UnderlinePropertyDefine;
  /** TODO */
  underlineColor?: ColorPropertyDefine;
  /** TODO */
  underlineDash?: LineDashPropertyDefine;
  lineThrough?: LineThroughPropertyDefine;
  /** TODO */
  lineThroughColor?: ColorPropertyDefine;
  /** TODO */
  lineThroughDash?: LineDashPropertyDefine;

  borderLineDash?: LineDashsPropertyDefine;
  linkColor?: ColorPropertyDefine;

  // tag?: TagPropertyDefine;
  // tagFont?: FontPropertyDefine;
  // tagColor?: ColorPropertyDefine;
  // tagBgColor?: ColorPropertyDefine;
  // tagMargin?: number | string | (number | string)[];

  // dropDownIcon?: IconPropertyDefine;
  // dropDownHoverIcon?: IconPropertyDefine;
  cursor?: CursorPropertyDefine;

  textStick?: boolean;

  marked?: MarkedPropertyDefine;
}

export interface ITextStyleOption extends IStyleOption {
  // lineHeight?: string | number;//移入IStyleOption中 单行文本类型也可以有
  autoWrapText?: boolean;
  lineClamp?: LineClamp;
}

export interface IImageStyleOption extends IStyleOption {
  // imageSizing?: 'keep-aspect-ratio';
  // imageAutoSizing?: boolean;
  margin?: number;
}
// export type ISortHeaderStyleOption = IStyleOption;

export type ColumnStyleOption =
  | IStyleOption
  | ITextStyleOption
  | IImageStyleOption
  | ProgressBarStyleOption
  | CheckboxStyleOption
  | ((styleArg: StylePropertyFunctionArg) => IStyleOption | ITextStyleOption | IImageStyleOption);

export type HeaderStyleOption =
  | (IStyleOption & { textStick?: boolean }) //表头可以配置吸附
  | ITextStyleOption
  | IImageStyleOption
  // | ISortHeaderStyleOption
  | ((styleArg: StylePropertyFunctionArg) => IStyleOption | ITextStyleOption | IImageStyleOption);
// | ISortHeaderStyleOption

export type FullExtendStyle = HeaderStyleOption & ColumnStyleOption & ThemeStyle;

// export interface BaseStyleOption {
//   bgColor?: ColorPropertyDefine;
// }

// export interface StdBaseStyleOption extends BaseStyleOption {
//   // eslint-disable-next-line no-undef
//   textAlign?: CanvasTextAlign;
//   // eslint-disable-next-line no-undef
//   textBaseline?: CanvasTextBaseline;
// }
// export interface StyleOption extends StdBaseStyleOption {
//   color?: ColorPropertyDefine;
//   font?: FontPropertyDefine;
//   padding?: PaddingsPropertyDefine;
//   textOverflow?: TextOverflow;
// }
export interface ProgressBarStyleOption extends IStyleOption {
  // 是否显示进度条
  showBar?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  // 进度条颜色
  barColor?: ColorPropertyDefine;
  // 进度条背景颜色
  barBgColor?: ColorPropertyDefine;
  // 进度条高度
  barHeight?: number | string;
  // 进度条距单元格底部距离
  barBottom?: number | string;
  // 进度条padding
  barPadding?: (number | string)[];
  // 进度条正向颜色
  barPositiveColor?: ColorPropertyDefine;
  // 进度条负向颜色
  barNegativeColor?: ColorPropertyDefine;
  // 进度条坐标轴轴颜色
  barAxisColor?: ColorPropertyDefine;
  // 进度条方向是否从右到左
  barRightToLeft?: boolean;

  // 是否显示进度条标记
  showBarMark?: boolean;
  // 进度条标记正向颜色
  barMarkPositiveColor?: ColorPropertyDefine;
  // 进度条标记负向颜色
  barMarkNegativeColor?: ColorPropertyDefine;
  // 进度条标记宽度
  barMarkWidth?: number;
  // 进度条标记位置
  barMarkPosition?: 'right' | 'bottom';
}

export type CheckboxStyleOption = {
  size?: number;
  spaceBetweenTextAndIcon?: number;
  checkboxStyle?: CheckboxStyle;
} & ITextStyleOption;

export type CheckboxStyle = {
  // 选择框尺寸
  size?: number;
  // 选择框与文字间距
  spaceBetweenTextAndIcon?: number;

  // 未选中状态填充颜色
  defaultFill?: string;
  // 未选中状态描边颜色
  defaultStroke?: string;
  // disable状态填充颜色
  disableFill?: string;
  // checked状态填充颜色
  checkedFill?: string;
  // checked状态描边颜色
  checkedStroke?: string;
  // checked状态填充颜色
  disableCheckedFill?: string;
  // checked状态描边颜色
  disableCheckedStroke?: string;

  // checked状态图标url
  checkIconImage?: string;
  // indeterminate状态图标url
  indeterminateIconImage?: string;
};
