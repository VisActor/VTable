# VTable 透视表维度/指标类型定义

> 本文件定义透视表（PivotTable / PivotChart）的行维度、列维度、指标、角表头、表头树节点等类型。

## 维度定义

```typescript
/** 基础维度 — 行维度和列维度的公共属性 */
export interface IDimension {
  /** 维度唯一标识 */
  dimensionKey: string;
  /** 维度显示名称 */
  title: string;
  /** 表头类型 */
  headerType?: 'text' | 'link' | 'image' | 'video' | 'checkbox' | 'multilinetext';
  /** 表头样式 */
  headerStyle?: ColumnStyleOption;
  /** 表头自定义渲染（详见 custom-render.md） */
  headerCustomRender?: ICustomRender;
  /** 表头自定义布局（详见 custom-layout.md） */
  headerCustomLayout?: ICustomLayout;
  /** 宽度 */
  width?: number | string | 'auto';
  /** 最大宽度 */
  maxWidth?: number | string;
  /** 最小宽度 */
  minWidth?: number | string;
  /** 是否显示排序图标 */
  showSort?: boolean;
  /** 排序 */
  sort?: boolean;
  /** 表头图标 */
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  /** 隐藏 */
  hide?: boolean;
  /** 描述（悬停提示） */
  description?: string;
  /** 角表头文字 */
  cornerDescription?: string;
  /** 拖拽 */
  dragHeader?: boolean;
  /** 编辑器 */
  headerEditor?: string | IEditor;
  /** 下钻按钮 */
  drillDown?: boolean;
  /** 上卷按钮 */
  drillUp?: boolean;
}

/** 行维度 — 增加行特有属性 */
export interface IRowDimension extends IDimension {
  /** 行维度类型: grid（平铺）或 tree（树形） */
  hierarchyType?: 'grid' | 'tree';
  /** 默认展开层级 */
  expandLevel?: number;
  /** body 样式 */
  style?: ColumnStyleOption;
  /** body 格式化 */
  format?: (value: any) => string;
}

/** 列维度 */
export interface IColumnDimension extends IDimension {
  /** body 样式 */
  style?: ColumnStyleOption;
  /** body 格式化 */
  format?: (value: any) => string;
}
```

## 指标定义

```typescript
/** 指标 — 定义数据展示方式 */
export interface IIndicator {
  /** 指标唯一标识 */
  indicatorKey: string;
  /** 指标显示名称 */
  title: string;
  /** 宽度 */
  width?: number | string | 'auto';
  /** 最大宽度 */
  maxWidth?: number | string;
  /** 最小宽度 */
  minWidth?: number | string;
  /** 表头样式 */
  headerStyle?: ColumnStyleOption;
  /** body 样式 */
  style?: ColumnStyleOption;
  /** 表头类型 */
  headerType?: 'text' | 'link' | 'image' | 'video' | 'checkbox' | 'multilinetext';
  /** body 单元格类型 */
  cellType?: CellType;
  /** 格式化 */
  format?: (value: any, col?: number, row?: number, table?: any) => any;
  /** 自定义渲染 */
  customRender?: ICustomRender;
  /** 自定义布局 */
  customLayout?: ICustomLayout;
  /** 表头自定义渲染 */
  headerCustomRender?: ICustomRender;
  /** 表头自定义布局 */
  headerCustomLayout?: ICustomLayout;
  /** 图标 */
  icon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  /** 表头图标 */
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  /** 排序 */
  sort?: boolean;
  /** 是否显示排序图标 */
  showSort?: boolean;
  /** 隐藏 */
  hide?: boolean;
  /** 编辑器 */
  editor?: string | IEditor;
  /** 表头编辑器 */
  headerEditor?: string | IEditor;
  /** 描述 */
  description?: string;
  /** 禁用列宽调整 */
  disableColumnResize?: boolean;
}

/** PivotChart 专用指标 — 增加图表 spec */
export interface IChartIndicator extends IIndicator {
  /** 图表模块名（需先注册 VTable.register.chartModule） */
  chartModule?: string;
  /** VChart 图表 spec */
  chartSpec?: any;
}
```

## 角表头

```typescript
/** 角表头定义 — 行列交汇处的单元格 */
export interface ICornerDefine {
  /** 角表头标题显示方式 */
  titleOnDimension?: 'row' | 'column' | 'none' | 'all';
  /** 角表头样式 */
  headerStyle?: ColumnStyleOption;
  /** 角表头自定义渲染 */
  headerCustomRender?: ICustomRender;
  /** 角表头自定义布局 */
  headerCustomLayout?: ICustomLayout;
}
```

## 表头树

```typescript
/** 表头树节点 — 用于 rowTree / columnTree 自定义表头结构 */
export type IHeaderTreeDefine = IDimensionHeaderNode | IIndicatorHeaderNode;

/** 维度表头节点 */
export interface IDimensionHeaderNode {
  /** 维度标识 */
  dimensionKey: string;
  /** 维度值 */
  value: string;
  /** 子节点 */
  children?: IHeaderTreeDefine[];
  /** 是否折叠 */
  hierarchyState?: 'expand' | 'collapse';
  /** 虚拟节点（跨多层级） */
  virtual?: boolean;
}

/** 指标表头节点 */
export interface IIndicatorHeaderNode {
  /** 指标标识 */
  indicatorKey: string;
  /** 指标值（显示文字） */
  value?: string;
}
```

## 依赖类型说明

```typescript
/** 列样式（详见 style-defines.md） */
export type ColumnStyleOption = IStyleOption | ((args: StylePropertyFunctionArg) => IStyleOption);

/** 单元格类型 */
export type CellType =
  | 'text'
  | 'link'
  | 'image'
  | 'video'
  | 'progressbar'
  | 'sparkline'
  | 'chart'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'button'
  | 'composite'
  | 'multilinetext';

/** 自定义渲染函数（详见 custom-render.md） */
export type ICustomRender = (args: CustomRenderFunctionArg) => ICustomRenderObj | null;

/** 自定义布局函数（详见 custom-layout.md） */
export type ICustomLayout = (args: CustomRenderFunctionArg) => ICustomLayoutObj;

/** 图标配置 */
export interface ColumnIconOption {
  /** 图标类型 */
  type: 'svg' | 'image' | 'path';
  /** SVG 字符串或图片 URL */
  svg?: string;
  src?: string;
  /** 宽高 */
  width?: number;
  height?: number;
  /** 名称标识 */
  name?: string;
  /** 位置 */
  positionType?: 'left' | 'right' | 'contentLeft' | 'contentRight' | 'absoluteRight';
  /** 功能类型 */
  funcType?: 'sort' | 'frozen' | 'drillDown' | 'collapse' | 'expand';
  /** 外边距 */
  marginLeft?: number;
  marginRight?: number;
  /** hover 图标 */
  hover?: { svg?: string; src?: string; width?: number; height?: number };
  /** tooltip */
  tooltip?: { title?: string; style?: any };
  /** 光标 */
  cursor?: string;
}

/** 编辑器接口（见 list-table-options.md） */
export interface IEditor {
  onStart: (context: any) => void;
  onEnd: () => void;
  getValue: () => any;
  isEditorElement?: (target: HTMLElement) => boolean;
}
```
