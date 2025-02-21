// ****** Icon配置信息，header ，以及列Icon *******9

import type { ITextAttribute } from '@src/vrender';
import type { Placement } from './table-engine';

export interface IIconBase {
  /**
   * icon 是何种内容类型，如svg font。可用来约束不同类型的属性定义
   */
  type: 'text' | 'svg' | 'path' | 'image';
  /** icon的高度 */
  width?: number;
  /** icon的高度 */
  height?: number; // 如果是font图标 不设的话默认是字体高度
  /**
   * IconPosition枚举类型
   */
  positionType: IconPosition;
  /**
   * 和右侧元素间隔距离, 或者与单元格边界的间隔距离
   */
  marginRight?: number;
  /**
   * 和左侧元素间隔距离, 或者与单元格边界的间隔距离
   */
  marginLeft?: number;
  /**
   * icon名称，会作为内部缓存的key
   */
  name: string;
  /**
   * 重置VTable内部icon 指定icon的功能类型
   * 具有切换状态的功能性的图标请务必配置上, 如排序功能funcType配置sort，name配置sort_normal或ort_downward,或sort_upward
   */
  funcType?: IconFuncTypeEnum | string;
  /**
   * 响应hover 热区大小，及hover效果背景色
   */
  hover?: {
    width?: number;
    height?: number;
    bgColor: string;
    image?: string;
  };
  /** 鼠标hover到图标上后出现的具体鼠标样式 */
  cursor?: string;
  /**是否可见 默认'always' 可选：'always' | 'mouseenter_cell' | 'click_cell',常驻|hover到单元格时|选中单元格时。
   * 建议：如需使用 'mouseenter_cell' | 'click_cell'，建议将positionTyle设为absoluteRight【即不占位】，否则占位的类型会影响视觉展示
   */
  visibleTime?: 'always' | 'mouseenter_cell' | 'click_cell';
  /**
   * 气泡框，按钮的的解释信息, 目前只支持hover行为触发
   */
  tooltip?: {
    title: string;
    /**气泡框位置，可选 top left right bottom */
    placement?: Placement;
    /** 气泡框的样式 不配的话会使用theme中的样式 */
    style?: {
      // font?: string;
      fontSize?: number;
      fontFamily?: string;
      color?: string;
      padding?: number[];
      bgColor?: string;
      arrowMark?: boolean;
      maxWidth?: number;
      maxHeight?: number;
    };
    disappearDelay?: number;
  };
  /**
   * 是否可交互 默认为true  目前已知不可交互按钮：下拉菜单状态
   */
  interactive?: boolean;
}

// ****** Column Icon Options *******
export interface TextIcon extends IIconBase {
  type: 'text';
  content: string;
  style?: ITextAttribute;
}
export interface ImageIcon extends IIconBase {
  type: 'image';
  src: string;
  /** 图片裁切形状 */
  shape?: 'circle' | 'square';

  isGif?: boolean;
}

export interface PathIcon extends IIconBase {
  type: 'path';
  path: string;
  color?: string;
}

export interface SvgIcon extends IIconBase {
  type: 'svg';
  /**
   * svg内容，支持url或者path
   */
  svg: string;
}

// export interface NamedIcon extends IIconBase {
//   type: 'name';
//   color?: string;
// }
/**
 * icon 的位置
 * inlineFront:文本内容的前面，
 * inlineEnd：文本内容后面
 *
 */
export enum IconPosition {
  /**文本行内容前面的图标，跟随文本定位，随文本折行 */
  inlineFront = 'inlineFront',
  /**文本行内容后面的图标，跟随文本定位，随文本折行。如sort图表 放在文本内容的第一行 */
  inlineEnd = 'inlineEnd',
  /**单元格左侧按钮 且受padding影响 */
  left = 'left',
  /**单元格右侧按钮 受padding影响 如pin图表 */
  right = 'right',
  /**固定在右侧的图标，不占位，不受padding影响，可能压盖内容 如 dropDown */
  absoluteRight = 'absoluteRight',

  // todo 增加更丰富的配置
  // cellLeft = 'cellLeft', //cell内靠左侧布局的图标（占位但是不受padding影响？）
  // cellRight = 'cellRight', //cell内靠右侧布局的图标
  /**在单元格内容块的左侧的图标，跟随文本定位，不随文本折行 */
  contentLeft = 'contentLeft',
  /**在单元格内容块的右侧的图标,跟随文本定位，不随文本折行 */
  contentRight = 'contentRight',

  /**在单元格中自由定位 */
  absolute = 'absolute'
}
/**
 * 图标类型
 * frozen 固定列图标
 * sort 排序图标
 */
export enum IconFuncTypeEnum {
  frozen = 'frozen',
  sort = 'sort',
  dropDown = 'dropDown',
  dropDownState = 'dropDownState',
  play = 'play',
  damagePic = 'damagePic',
  expand = 'expand',
  collapse = 'collapse',
  drillDown = 'drillDown',
  drillUp = 'drillUp',
  dragReorder = 'dragReorder'
}
export enum InternalIconName {
  upwardIconName = 'sort_upward',
  downwardIconName = 'sort_downward',
  normalIconName = 'sort_normal',
  //冻结列 图钉按钮的几种状态
  freezeIconName = 'freeze',
  frozenIconName = 'frozen',
  frozenCurrentIconName = 'frozenCurrent',
  dropdownIconName = 'dropdownIcon',
  // dropdownHoverIconName = 'dropdownIcon_hover',
  expandIconName = 'expand',
  collapseIconName = 'collapse',
  dragReorderIconName = 'dragReorder',

  loadingIconName = 'loading'
}
// 目前暂不支持FontIcon&PathIcon
export type ColumnIconOption = ImageIcon | SvgIcon | TextIcon;
