# VTable 列定义类型

```typescript
/** 列定义数组 */
export type ColumnsDefine = (
  | ITextColumnBodyDefine
  | ILinkColumnBodyDefine
  | IImageColumnBodyDefine
  | IVideoColumnBodyDefine
  | IProgressbarColumnBodyDefine
  | ISparklineColumnBodyDefine
  | IChartColumnBodyDefine
  | ICheckboxColumnBodyDefine
  | IRadioColumnBodyDefine
  | ISwitchColumnBodyDefine
  | IButtonColumnBodyDefine
  | ICompositeColumnBodyDefine
  | IMultilineTextColumnBodyDefine
  | GroupColumnDefine
)[];
```

## 通用表头属性

```typescript
/** 所有列共有的表头属性 */
export interface IHeaderDefine {
  /** 表头显示文字 */
  title?: string;
  /** 表头自定义渲染 */
  headerCustomRender?: ICustomRender;
  /** 表头自定义布局（JSX） */
  headerCustomLayout?: ICustomLayout;
  /** 表头样式 */
  headerStyle?: ColumnStyleOption;
  /** 表头类型 */
  headerType?: 'text' | 'link' | 'image' | 'video' | 'checkbox' | 'multilinetext';
  /** 排序 */
  sort?: boolean | SortOption;
  /** 表头图标 */
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  /** 是否显示排序图标 */
  showSort?: boolean;
  /** 表头描述（悬停提示） */
  description?: string;
  /** 是否允许拖拽列 */
  dragHeader?: boolean;
  /** 列隐藏 */
  hide?: boolean;
  /** 列宽 */
  width?: number | string | 'auto';
  /** 最大列宽 */
  maxWidth?: number | string;
  /** 最小列宽 */
  minWidth?: number | string;
}
```

## 通用 body 属性

```typescript
/** 所有列共有的 body 属性 */
export interface IColumnBodyDefine extends IHeaderDefine {
  /** 数据字段名 */
  field?: string | number;
  /** 数据格式化 */
  fieldFormat?: (record: any, col?: number, row?: number, table?: any) => any;
  /** 单元格类型 */
  cellType?: CellType;
  /** body 样式 */
  style?: ColumnStyleOption;
  /** 自定义渲染 */
  customRender?: ICustomRender;
  /** 自定义布局 */
  customLayout?: ICustomLayout;
  /** 图标 */
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
  /** 编辑器 */
  editor?: string | IEditor | ((args: BaseCellInfo & { table: any }) => string | IEditor);
  /** 聚合 */
  aggregation?: Aggregation | Aggregation[];
  /** 是否禁用列宽调整 */
  disableColumnResize?: boolean;
  /** 是否允许点击后选中单元格 */
  disableSelect?: boolean;
  /** 是否禁用表头菜单 */
  disableHeaderSelect?: boolean;
  /** 合并单元格规则 */
  mergeCell?: boolean | CustomMergeCell;
}
```

```typescript
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
```

## 各类型列定义

```typescript
/** 文本列 — 最基础 */
export interface ITextColumnBodyDefine extends IColumnBodyDefine {
  cellType?: 'text';
}
```

```typescript
/** 链接列 */
export interface ILinkColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'link';
  /** 跳转模板 */
  linkJump?: boolean;
  /** 检测是否为链接 */
  linkDetect?: boolean;
  /** 自定义链接模板 */
  templateLink?: string;
}
```

```typescript
/** 图片列 */
export interface IImageColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'image';
  /** 图片保持宽高比 */
  keepAspectRatio?: boolean;
  /** 图片拉伸方式 */
  imageAutoSizing?: boolean;
}
```

```typescript
/** 视频列 */
export interface IVideoColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'video';
  /** 视频保持宽高比 */
  keepAspectRatio?: boolean;
}
```

```typescript
/** 进度条列 */
export interface IProgressbarColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'progressbar';
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 进度条颜色 */
  barType?: 'default' | 'negative' | 'both';
  /** 是否在进度条上方显示文字 */
  showBarMark?: boolean;
  /** 依赖另一个字段 */
  dependField?: string;
}
```

```typescript
/** 迷你图列 */
export interface ISparklineColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'sparkline';
  /** 迷你图规格（VChart spec 子集） */
  sparklineSpec?: SparklineSpec;
}
```

```typescript
/** 图表列 */
export interface IChartColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'chart';
  /** VChart 图表规格 */
  chartModule?: string;
  /** 图表 spec */
  chartSpec?: any;
}
```

```typescript
/** 复选框列 */
export interface ICheckboxColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'checkbox';
  /** 选中时文字 */
  checkedValue?: string;
  /** 未选中时文字 */
  uncheckedValue?: string;
  /** 是否禁用 */
  disable?: boolean | ((args: CellInfo) => boolean);
}
```

```typescript
/** 单选框列 */
export interface IRadioColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'radio';
  /** 是否禁用 */
  disable?: boolean | ((args: CellInfo) => boolean);
}
```

```typescript
/** 开关列 */
export interface ISwitchColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'switch';
  /** 是否禁用 */
  disable?: boolean | ((args: CellInfo) => boolean);
}
```

```typescript
/** 按钮列 */
export interface IButtonColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'button';
  /** 按钮文字 */
  text?: string;
}
```

```typescript
/** 组合类型列 */
export interface ICompositeColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'composite';
}
```

```typescript
/** 多行文本列 */
export interface IMultilineTextColumnBodyDefine extends IColumnBodyDefine {
  cellType: 'multilinetext';
}
```

```typescript
// ========================
// 分组列
// ========================

/** 分组列 — columns 嵌套实现多级表头 */
export interface GroupColumnDefine extends IHeaderDefine {
  /** 子列 */
  columns: ColumnsDefine;
}
```

## 列样式相关

```typescript
/** 列样式可为静态对象或函数（详见 style-defines.md） */
export type ColumnStyleOption = IStyleOption | ((args: StylePropertyFunctionArg) => IStyleOption);

/** 样式回调参数 */
export interface StylePropertyFunctionArg {
  col: number;
  row: number;
  /** 当前单元格的原始数据 */
  dataValue: any;
  /** 完整数据记录 */
  value: any;
  /** 表头路径 */
  cellHeaderPaths: ICellHeaderPaths;
  table: any;
}

/** 表头路径信息 */
export interface ICellHeaderPaths {
  colHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
  rowHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
}
```

## 依赖类型说明

```typescript
/** 排序选项 */
export interface SortOption {
  /** 自定义排序函数 */
  orderFn?: (a: any, b: any, order: string) => -1 | 0 | 1;
}

/** 图标配置 */
export interface ColumnIconOption {
  type: 'svg' | 'image' | 'path';
  svg?: string;
  src?: string;
  width?: number;
  height?: number;
  name?: string;
  positionType?: 'left' | 'right' | 'contentLeft' | 'contentRight' | 'absoluteRight';
  funcType?: 'sort' | 'frozen' | 'drillDown' | 'collapse' | 'expand';
  marginLeft?: number;
  marginRight?: number;
  hover?: { svg?: string; src?: string; width?: number; height?: number };
  tooltip?: { title?: string; style?: any };
  cursor?: string;
}

/** 单元格信息（icon 回调参数） */
export interface CellInfo {
  col: number;
  row: number;
  dataValue: any;
  value: any;
  table: any;
}

/** 单元格基础信息（editor 回调参数） */
export interface BaseCellInfo {
  col: number;
  row: number;
  dataValue: any;
  value: any;
}

/** 编辑器接口（详见 list-table-options.md） */
export interface IEditor {
  onStart: (context: any) => void;
  onEnd: () => void;
  getValue: () => any;
  isEditorElement?: (target: HTMLElement) => boolean;
}

/** 聚合配置 */
export interface Aggregation {
  aggregationType: 'SUM' | 'COUNT' | 'MAX' | 'MIN' | 'AVG' | 'NONE' | 'CUSTOM' | 'RECALCULATE';
  showOnTop?: boolean;
  aggregationFun?: (values: any[], records: any[]) => any;
  formatFun?: (value: any) => string;
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
      style?: any;
    }
  | undefined;

/** 自定义渲染（详见 ./custom-render.md） */
export type ICustomRender = (args: any) => any;

/** 自定义布局（详见 ./custom-layout.md） */
export type ICustomLayout = (args: any) => any;

/** 迷你图规格 */
export interface SparklineSpec {
  type: 'line' | 'area' | 'bar';
  xField?: string | { field: string };
  yField?: string | { field: string };
  pointShowRule?: 'all' | 'none' | 'isolatedPoint';
  line?: { style?: { stroke?: string; strokeWidth?: number } };
  point?: { style?: { fill?: string; size?: number } };
  area?: { style?: { fill?: string } };
  bar?: { style?: { fill?: string } };
}

/** 单元格样式（详见 style-defines.md） */
// IStyleOption → 见 style-defines.md
```

```

```
