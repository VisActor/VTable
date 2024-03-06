/* eslint-disable sort-imports */
import type { ColorsDef, LineDashsDef, LineWidthsDef, LineWidthsPropertyDefine } from '.';
import type { CheckboxStyle, ITextStyleOption } from './column/style';
import type { ColorPropertyDefine, ColorsPropertyDefine } from './style-define';
import type { ColumnIconOption } from './icon';
import type { ICellAxisOption } from './component/axis';
import type { PopTipAttributes } from '@visactor/vrender-components';
// ****** Custom Theme *******
export type PartialTableThemeDefine = Partial<ITableThemeDefine>;
export type ThemeStyle = ITextStyleOption & {
  hover?: Omit<InteractionStyle, 'cellBorderColor' | 'cellBorderLineWidth'>; //鼠标hover到某个单元格
  // click?: Omit<InteractionStyle, 'inlineRowBgColor' | 'inlineColumnBgColor'>; //鼠标点击到某个单元格
  frameStyle?: FrameStyle;
};
export type InteractionStyle = {
  cellBorderColor?: ColorsPropertyDefine; //交互所在单元格的边框颜色
  cellBorderLineWidth?: LineWidthsPropertyDefine;
  // cellBorderLineDash?:LineDashsPropertyDefine,//用到的场景应该不多
  cellBgColor?: ColorPropertyDefine; //交互所在单元格的背景颜色
  // inlineRowBorderColor?: ColorsPropertyDefine,//交互所在整行的边框颜色
  inlineRowBgColor?: ColorPropertyDefine; //交互所在整行的背景颜色
  // inlineColBorderColor?: ColorsPropertyDefine,//交互所在整列的边框颜色
  inlineColumnBgColor?: ColorPropertyDefine; //交互所在整列的背景颜色
  // headerHighlightBorderColor?:ColorPropertyDefine,//表头底部高亮线
};
export type FrameStyle = {
  borderColor?: ColorsDef;
  borderLineWidth?: LineWidthsDef;
  borderLineDash?: LineDashsDef;
  innerBorder?: boolean;
};
export type TableFrameStyle = FrameStyle & {
  shadowBlur?: number; //阴影宽度
  shadowOffsetX?: number; //x方向偏移
  shadowOffsetY?: number; //Y方向偏移
  shadowColor?: string; //阴影颜色
  cornerRadius?: number; //边框圆角半径
};
export type menuStyle = {
  color?: string;
  highlightColor?: string;
  fontSize?: number;
  fontFamily?: string;
  highlightFontSize?: number;
  highlightFontFamily?: string;
  hoverBgColor?: string;
};
export type ScrollStyle = {
  /**滚动条滚动的颜色 */
  scrollRailColor?: string;
  /**滚动条滑块的颜色 */
  scrollSliderColor?: string;
  /**滚动条宽度大小 */
  width?: number;
  /**滚动条是否可见  'always' | 'scrolling' | 'none' | 'focus',常驻|滚动时|不显示|聚焦在画布上时 */
  visible?: 'always' | 'scrolling' | 'none' | 'focus';
  /*** 悬浮与容器上，还是独立于容器外 */
  hoverOn?: boolean;
};
/**
 * 气泡框，按钮的的解释信息
 */
export type TooltipStyle = {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  padding?: number[];
  bgColor?: string;
  /** !目前未实现该逻辑。触发行为：hover or click */
  // trigger?: string | string[];
  /**气泡框位置，可选 top left right bottom */
  // placement?: Placement;
};
export interface ITableThemeDefine {
  /** 表格绘制范围外的canvas上填充的颜色 */
  underlayBackgroundColor?: string;
  // selectionBgColor?: ColorPropertyDefine; //多选单元格背景色 手动设置的多选 非框选
  defaultStyle?: ThemeStyle;
  cornerHeaderStyle?: ThemeStyle; //角头样式
  cornerRightTopCellStyle?: ThemeStyle; // 右上角占位单元格样式
  cornerLeftBottomCellStyle?: ThemeStyle; // 左下角占位单元格样式
  cornerRightBottomCellStyle?: ThemeStyle; // 右下角占位单元格样式
  rightFrozenStyle?: ThemeStyle; // 右侧冻结单元格样式
  bottomFrozenStyle?: ThemeStyle; // 下部冻结单元格样式
  headerStyle?: ThemeStyle;
  rowHeaderStyle?: ThemeStyle;
  bodyStyle?: ThemeStyle;
  frameStyle?: TableFrameStyle;
  //列调整宽度的直线
  columnResize?: {
    lineColor: ColorPropertyDefine; //上面线的颜色
    bgColor?: ColorPropertyDefine; //背景线的颜色
    lineWidth: number; //上面线的宽度
    width?: number; //背景线的宽度
    labelColor?: string; //label的颜色
    labelFontSize?: number; //label的字体大小
    labelFontFamily?: string; //label的字体
    labelBackgroundFill?: string; //label的背景填充
    labelBackgroundCornerRadius?: number; //label的背景圆角
  };
  //拖拽表格换位分割线的样式
  dragHeaderSplitLine?: {
    lineColor: ColorPropertyDefine; //上面线的颜色
    lineWidth: number; //上面线的宽度
    shadowBlockColor?: string; //拖拽时阴影区域的颜色
  };
  //冻结列后面的效果
  frozenColumnLine?: {
    shadow?: {
      //默认效果 会有阴影配置
      width: number; //阴影整体宽度
      startColor: string; //开始颜色
      endColor: string; //结束颜色
    };
    /** TODO  暂未生效 */
    border?: {
      //有些需求要两种效果 这里配置滚动前的边框效果（实现方式是两条线叠加产生），滚动后按上面的阴影效果
      lineColor: ColorPropertyDefine; //上面线的颜色
      bgColor?: ColorPropertyDefine; //背景线的颜色
      lineWidth: number; //上面线的宽度
      width?: number; //背景线的宽度
    };
  };

  // menuStyle?: menuStyle;
  scrollStyle?: ScrollStyle;
  tooltipStyle?: TooltipStyle;
  // selectHeaderHighlight?: boolean;
  /** 选择框样式 */
  selectionStyle?: //Omit<InteractionStyle, 'inlineRowBgColor' | 'inlineColumnBgColor'>; //鼠标点击到某个单元格
  {
    cellBorderColor?: string; //边框颜色
    cellBorderLineWidth?: number; //边框线宽度
    cellBgColor?: string; //选择框背景颜色
  };

  // style for axis
  axisStyle?: {
    defaultAxisStyle?: Omit<ICellAxisOption, 'type' | 'domain' | 'range' | 'orient' | '__ticksForVTable'>;
    leftAxisStyle?: Omit<ICellAxisOption, 'type' | 'domain' | 'range' | 'orient' | '__ticksForVTable'>;
    rightAxisStyle?: Omit<ICellAxisOption, 'type' | 'domain' | 'range' | 'orient' | '__ticksForVTable'>;
    topAxisStyle?: Omit<ICellAxisOption, 'type' | 'domain' | 'range' | 'orient' | '__ticksForVTable'>;
    bottomAxisStyle?: Omit<ICellAxisOption, 'type' | 'domain' | 'range' | 'orient' | '__ticksForVTable'>;
  };

  checkboxStyle?: CheckboxStyle;

  // style for text pop tip
  textPopTipStyle?: PopTipAttributes;
}

export type RequiredTableThemeDefine = Required<ITableThemeDefine>;
