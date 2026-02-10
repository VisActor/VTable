# VTable 样式类型定义

## 文字样式

```typescript
export interface ITextStyleOption {
  /** 字体 */
  fontFamily?: string;
  /** 字号 */
  fontSize?: number | string;
  /** 粗细 */
  fontWeight?: 'normal' | 'bold' | number | string;
  /** 斜体 */
  fontStyle?: 'normal' | 'italic';
  /** 文字颜色 */
  color?: ColorPropertyDefine;
  /** 文字对齐 */
  textAlign?: 'left' | 'center' | 'right';
  /** 垂直对齐 */
  textBaseline?: 'top' | 'middle' | 'bottom';
  /** 文字省略号位置 */
  textOverflow?: 'ellipsis' | 'clip' | string;
  /** 最大行数（'auto' 为自动换行） */
  lineClamp?: number | 'auto';
  /** 文字行高 */
  lineHeight?: number;
  /** 下划线 */
  underline?: boolean;
  /** 中划线 */
  lineThrough?: boolean;
  /** 文字装饰线颜色 */
  underlineColor?: ColorPropertyDefine;
  /** 文字吸附（表头文字始终可见） */
  textStick?: boolean;
  /** 文字吸附基于对齐方向 */
  textStickBaseOnAlign?: boolean;
  /** 标记（右上角红点） */
  marked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
```

## 单元格样式

```typescript
/** 单元格完整样式 — 继承文字样式 */
export interface IStyleOption extends ITextStyleOption {
  /** 背景色 */
  bgColor?: ColorPropertyDefine;
  /** 内边距（单值或 [上, 右, 下, 左]） */
  padding?: number | number[];
  /** 边框颜色 */
  borderColor?: ColorPropertyDefine;
  /** 边框线宽 */
  borderLineWidth?: number | number[];
  /** 边框虚线 */
  borderLineDash?: number[];
  /** 链接文字颜色 */
  linkColor?: ColorPropertyDefine;
  /** 鼠标光标 */
  cursor?: string;
}
```

## 颜色属性与样式回调

```typescript
/** 颜色值：可以是字符串、字符串数组（不同行交替）、或回调函数 */
export type ColorPropertyDefine = string | string[] | ((args: StylePropertyFunctionArg) => string);

/** 列样式可为静态对象或回调函数 */
export type ColumnStyleOption = IStyleOption | ((args: StylePropertyFunctionArg) => IStyleOption);

/** 样式回调参数 — 所有样式回调函数都接收此参数 */
export interface StylePropertyFunctionArg {
  /** 列号 */
  col: number;
  /** 行号 */
  row: number;
  /** 当前单元格的原始数据值 */
  dataValue: any;
  /** 当前单元格的显示值 */
  value: any;
  /** 表头路径 */
  cellHeaderPaths: ICellHeaderPaths;
  /** 表格实例 */
  table: any;
}

/** 表头路径信息 */
export interface ICellHeaderPaths {
  /** 列方向的表头路径 */
  colHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
  /** 行方向的表头路径 */
  rowHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
}
```

## 主题定义

```typescript
/** 完整主题结构 */
export interface ITableThemeDefine {
  /** 默认 body 样式 */
  defaultStyle?: IStyleOption;
  /** 列表头样式 */
  headerStyle?: IStyleOption;
  /** 行表头样式 */
  rowHeaderStyle?: IStyleOption;
  /** 角表头样式 */
  cornerHeaderStyle?: IStyleOption;
  /** 底部冻结行样式 */
  bottomFrozenStyle?: IStyleOption;
  /** 右侧冻结列样式 */
  rightFrozenStyle?: IStyleOption;
  /** body 样式 */
  bodyStyle?: IStyleOption;
  /** 帧外边框 */
  frameStyle?: {
    borderColor?: string;
    borderLineWidth?: number | number[];
    borderLineDash?: number[];
    cornerRadius?: number;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
  };
  /** 选中区域样式 */
  selectionStyle?: {
    cellBgColor?: string;
    cellBorderColor?: string;
    cellBorderLineWidth?: number;
    headerHighlightBgColor?: string;
    inlineRowBgColor?: string;
    inlineColumnBgColor?: string;
  };
  /** hover 样式 */
  hoverStyle?: {
    cellBgColor?: string;
    inlineRowBgColor?: string;
    inlineColumnBgColor?: string;
  };
  /** 滚动条样式 */
  scrollStyle?: {
    visible?: 'always' | 'scrolling' | 'none' | 'focus';
    hoverOn?: boolean;
    barToSide?: boolean;
    scrollSliderColor?: string;
    scrollRailColor?: string;
    scrollSliderCornerRadius?: number;
    width?: number;
  };
  /** tooltip 样式 */
  tooltipStyle?: {
    bgColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    padding?: number[];
  };
  /** 列宽调整线样式 */
  columnResize?: {
    lineColor?: string;
    lineWidth?: number;
    bgColor?: string;
    width?: number;
  };
  /** 冻结线样式 */
  frozenColumnLine?: {
    shadow?: {
      width?: number;
      startColor?: string;
      endColor?: string;
    };
  };
  /** 拖拽表头样式 */
  dragHeaderSplitLine?: {
    lineColor?: string;
    lineWidth?: number;
    shadowBlockColor?: string;
  };
  /** checkbox 样式 */
  checkboxStyle?: {
    checkedFill?: string;
    uncheckedStroke?: string;
    indeterminateFill?: string;
    size?: number;
  };
  /** radio 样式 */
  radioStyle?: {
    checkedFill?: string;
    uncheckedStroke?: string;
    size?: number;
  };
}
```

## 内置主题

```typescript
/** 5 个内置主题 — 通过 VTable.themes.XXX 使用 */
export type BuiltinThemeName =
  | 'DEFAULT' // 默认浅色
  | 'ARCO' // ArcoDesign 风格
  | 'BRIGHT' // 明亮色调
  | 'DARK' // 深色主题
  | 'SIMPLIFY'; // 极简风格

// 使用方式：
// const table = new VTable.ListTable({ theme: VTable.themes.ARCO });
// 扩展主题：
// const theme = VTable.themes.DEFAULT.extends({ bodyStyle: { bgColor: '#f5f5f5' } });
```

## 条件样式

```typescript
/** 条件格式 */
export interface ConditionalStyle {
  /** 字段名 */
  field?: string;
  /** 条件函数 */
  filter?: (args: { col: number; row: number; dataValue: any; value: any; table: any }) => boolean;
  /** 满足条件时的样式 */
  style: IStyleOption;
}

/** MarkCellStyle — 标记指定单元格样式 */
export interface MarkCellStyle {
  col?: number;
  row?: number;
  field?: string;
  fieldValue?: any;
  style: IStyleOption;
}

/** 运行时自定义样式注册 */
// table.registerCustomCellStyle(customStyleId, customStyle)
// 列定义中使用: customCellStyle: 'myStyleId'
export interface CustomCellStyle {
  id: string;
  style: IStyleOption;
}

/** 自定义样式分配 */
export interface CustomCellStyleArrangement {
  cellPosition: {
    col?: number;
    row?: number;
    range?: { start: { col: number; row: number }; end: { col: number; row: number } };
  };
  customStyleId: string;
}
```
