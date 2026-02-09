# VTable 基础表格配置

## BaseTableConstructorOptions

```typescript
/**
 * VTable 基础表格配置 — 用户可见类型精简版
 * 所有表格类型共享的公共配置
 * 源码: packages/vtable/src/ts-types/table-engine.ts
 */

/** 基础表格配置（ListTable / PivotTable / PivotChart 共享） */
export interface BaseTableConstructorOptions {
  /** DOM 容器元素 */
  container: HTMLElement | string;

  // ===== 尺寸 =====
  /** 列宽模式 */
  widthMode?: 'standard' | 'adaptive' | 'autoWidth';
  /** 行高模式 */
  heightMode?: 'standard' | 'adaptive' | 'autoHeight';
  /** 列总宽不足时自动拉伸填满 */
  autoFillWidth?: boolean;
  /** 行总高不足时自动拉伸填满 */
  autoFillHeight?: boolean;
  /** 默认行高 */
  defaultRowHeight?: number | 'auto';
  /** 默认列宽 */
  defaultColWidth?: number;
  /** 表头行高（可按行设置） */
  defaultHeaderRowHeight?: (number | 'auto') | (number | 'auto')[];
  /** 表头列宽 */
  defaultHeaderColWidth?: (number | 'auto') | (number | 'auto')[];
  /** 自动列宽最大限制 */
  limitMaxAutoWidth?: boolean | number;
  /** 最小列宽限制 */
  limitMinWidth?: number;
  /** 画布像素比 */
  pixelRatio?: number;

  // ===== 冻结 =====
  /** 左侧冻结列数 */
  frozenColCount?: number;
  /** 顶部冻结行数 */
  frozenRowCount?: number;
  /** 右侧冻结列数 */
  rightFrozenColCount?: number;
  /** 底部冻结行数 */
  bottomFrozenRowCount?: number;

  // ===== 文字 =====
  /** 全局自动换行 */
  autoWrapText?: boolean;
  /** 识别换行符 \n */
  enableLineBreak?: boolean;

  // ===== 交互 =====
  /** hover 高亮配置 */
  hover?: {
    highlightMode?: 'cross' | 'column' | 'row' | 'cell';
    disableHover?: boolean;
    disableHeaderHover?: boolean;
    enableSingleCell?: boolean;
  };

  /** 选择配置 */
  select?: {
    disableSelect?: boolean;
    disableHeaderSelect?: boolean;
    highlightMode?: 'cross' | 'column' | 'row' | 'cell';
    headerSelectMode?: 'inline' | 'cell';
    blankAreaClickDeselect?: boolean;
  };

  /** 键盘交互 */
  keyboardOptions?: TableKeyboardOptions;

  /** 列宽/行高调整 */
  resize?: {
    columnResizeMode?: 'all' | 'none' | 'header' | 'body';
    rowResizeMode?: 'all' | 'none' | 'header' | 'body';
    columnResizeWidth?: number;
  };

  /** 拖拽表头排序 */
  dragOrder?: {
    dragHeaderMode?: 'all' | 'none' | 'column' | 'row';
    frozenColDragHeaderMode?: 'disabled' | 'adjustFrozenCount' | 'fixedFrozenCount';
  };

  // ===== 菜单 =====
  menu?: {
    renderMode?: 'canvas' | 'html';
    defaultHeaderMenuItems?: MenuListItem[] | ((args: { row: number; col: number; table: any }) => MenuListItem[]);
    contextMenuItems?: MenuListItem[] | ((field: any, row: number, col: number, table?: any) => MenuListItem[]);
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
    contextMenuWorkOnlyCell?: boolean;
  };

  // ===== 提示框 =====
  tooltip?: {
    renderMode?: 'html' | 'canvas';
    isShowOverflowTextTooltip?: boolean;
    confine?: boolean;
    overflowTextTooltipDisappearDelay?: number;
  };

  // ===== 主题 =====
  /** 主题配置 */
  theme?: ITableThemeDefine;

  // ===== 标题 =====
  /** 表格标题 */
  title?: ITitle;
  /** 数据为空提示 */
  emptyTip?: IEmptyTip;

  // ===== 其他 =====
  /** 行序号列 */
  rowSeriesNumber?: IRowSeriesNumber;
  /** 自定义合并单元格 */
  customMergeCell?: CustomMergeCell;
  /** 全局自定义渲染 */
  customRender?: ICustomRender;
  /** 全局自定义布局 */
  customLayout?: ICustomLayout;
  /** 全局表头自定义渲染 */
  headerCustomRender?: ICustomRender;
  /** 全局表头自定义布局 */
  headerCustomLayout?: ICustomLayout;
  /** 出场动画 */
  animationAppear?: IAnimationAppear;
  /** 滚动到边界行为 */
  overscrollBehavior?: 'auto' | 'none';
  /** 图表异步渲染 */
  renderChartAsync?: boolean;
  /** 预注册自定义样式 */
  customCellStyle?: CustomCellStyle[];
  /** 预分配自定义样式 */
  customCellStyleArrangement?: CustomCellStyleArrangement[];
}
```

```typescript
/** 键盘交互配置 */
export interface TableKeyboardOptions {
  /** Tab 键移动焦点 */
  moveFocusCellOnTab?: boolean;
  /** Enter 键编辑 */
  editCellOnEnter?: boolean;
  /** Enter 键移动（与 editCellOnEnter 互斥） */
  moveFocusCellOnEnter?: boolean;
  /** 方向键切换编辑单元格 */
  moveEditCellOnArrowKeys?: boolean;
  /** Ctrl+A 全选 */
  selectAllOnCtrlA?: boolean | SelectAllOnCtrlAOption;
  /** Ctrl+C 复制 */
  copySelected?: boolean;
  /** Ctrl+V 粘贴 */
  pasteValueToCell?: boolean;
  /** Ctrl+X 剪切 */
  cutSelected?: boolean;
  /** 方向键移动选中 */
  moveSelectedCellOnArrowKeys?: boolean;
  /** Ctrl 多选 */
  ctrlMultiSelect?: boolean;
  /** Shift 范围选 */
  shiftMultiSelect?: boolean;
}
```

## 依赖类型说明

```typescript
/** 菜单项 */
export type MenuListItem = string | { text: string; menuKey: string; icon?: string; children?: MenuListItem[] } | '-'; // 分隔线

/** 下拉菜单高亮信息 */
export interface DropDownMenuHighlightInfo {
  col?: number;
  row?: number;
  field?: string;
  menuKey?: string;
}
/** 表格标题 */
export interface ITitle {
  text?: string;
  subtext?: string;
  align?: 'left' | 'center' | 'right';
  textStyle?: { fontSize?: number; fontFamily?: string; fontWeight?: string | number; color?: string };
  subtextStyle?: { fontSize?: number; fontFamily?: string; color?: string };
  padding?: number | number[];
}

/** 空数据提示 */
export interface IEmptyTip {
  text?: string;
  icon?: { width?: number; height?: number; svg?: string; src?: string };
  textStyle?: { fontSize?: number; color?: string; fontFamily?: string };
  spaceBetweenTextAndIcon?: number;
}

/** 行序号列 */
export interface IRowSeriesNumber {
  width?: number | 'auto';
  title?: string;
  format?: (col: number, row: number, table: any) => string | number;
  style?: IStyleOption;
  headerStyle?: IStyleOption;
  dragOrder?: boolean;
  disableColumnResize?: boolean;
}

/** 自定义合并单元格 */
export type CustomMergeCell = (
  col: number,
  row: number,
  table: any
) =>
  | {
      range: { start: { col: number; row: number }; end: { col: number; row: number } };
      text?: string;
      style?: IStyleOption;
      customLayout?: ICustomLayout;
      customRender?: ICustomRender;
    }
  | undefined;

/** 自定义渲染（详见 custom-render.md） */
export type ICustomRender = (args: CustomRenderFunctionArg) => ICustomRenderObj | null;

/** 自定义布局（详见 custom-layout.md） */
export type ICustomLayout = (args: CustomRenderFunctionArg) => ICustomLayoutObj;

/** 出场动画 */
export interface IAnimationAppear {
  type?: 'all' | 'one-by-one';
  direction?: 'row' | 'column';
  duration?: number;
  delay?: number;
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

/** Ctrl+A 全选选项 */
export type SelectAllOnCtrlAOption = {
  includeHeader?: boolean;
};
```

## 其他依赖

- [ITableThemeDefine](./style-defines.md#主题定义)
- [CustomCellStyle](./style-defines.md)
