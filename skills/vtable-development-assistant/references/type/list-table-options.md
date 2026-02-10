# VTable ListTable 配置

> ListTable 继承 BaseTableConstructorOptions（见 base-table-options.md），以下仅列出 ListTable 专有配置。

## ListTableConstructorOptions

```typescript
/** ListTable 专有配置 */
export interface ListTableConstructorOptions extends BaseTableConstructorOptions {
  /** 数据数组 */
  records?: any[];
  /** 列定义（详见 column-defines.md） */
  columns?: ColumnsDefine;
  /** 是否转置（行列互换） */
  transpose?: boolean;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 分页 */
  pagination?: IPagination;
  /** 排序状态 */
  sortState?: SortState | SortState[];
  /** 多列排序 */
  multipleSort?: boolean;
  /** 全局编辑器 */
  editor?: string | IEditor | ((args: BaseCellInfo & { table: any }) => string | IEditor);
  /** 全局表头编辑器 */
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: any }) => string | IEditor);
  /** 编辑触发方式 */
  editCellTrigger?: 'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];
  /** 树形缩进像素 */
  hierarchyIndent?: number;
  /** 树形默认展开层级 */
  hierarchyExpandLevel?: number;
  /** 同层级节点文字对齐 */
  hierarchyTextStartAlignment?: boolean;
  /** 聚合计算 */
  aggregation?:
    | Aggregation
    | Aggregation[]
    | ((args: { col: number; field: string }) => Aggregation | Aggregation[] | null);
  /** 分组配置 */
  groupConfig?: {
    groupBy: string | string[];
    titleCustomLayout?: ICustomLayout;
    titleFieldFormat?: (record: any, col?: number, row?: number, table?: any) => string;
    enableTreeStickCell?: boolean;
    titleCheckbox?: boolean;
  };
  /** 列宽预配置 */
  columnWidthConfig?: { key: string | number; width: number }[];
}
```

## 分页配置

```typescript
/** 分页配置 */
export interface IPagination {
  /** 数据总条数 */
  totalCount?: number;
  /** 每页显示条数 */
  perPageCount: number;
  /** 当前页码（从1开始） */
  currentPage?: number;
}
```

## 排序状态

```typescript
/** 排序状态 */
export interface SortState {
  /** 排序字段 */
  field: string | number;
  /** 排序方向 */
  order: 'asc' | 'desc' | 'normal';
  /** 自定义排序函数 */
  orderFn?: (a: any, b: any, order: string) => -1 | 0 | 1;
}
```

## 依赖类型说明

```typescript
/** 编辑器接口 — 来自 @visactor/vtable-editors */
export interface IEditor {
  /** 进入编辑 */
  onStart: (context: EditContext) => void;
  /** 退出编辑 */
  onEnd: () => void;
  /** 获取编辑值 */
  getValue: () => any;
  /** 是否有效 */
  isEditorElement?: (target: HTMLElement) => boolean;
}

/** 编辑上下文 */
export interface EditContext {
  container: HTMLElement;
  referencePosition: { rect: RectProps; placement?: string };
  value: any;
  col: number;
  row: number;
  table: any;
}

/** 单元格基础信息 */
export interface BaseCellInfo {
  col: number;
  row: number;
  dataValue: any;
  value: any;
}

/** 聚合配置 */
export interface Aggregation {
  /** 聚合类型 */
  aggregationType: 'SUM' | 'COUNT' | 'MAX' | 'MIN' | 'AVG' | 'NONE' | 'CUSTOM' | 'RECALCULATE';
  /** 是否在顶部显示 */
  showOnTop?: boolean;
  /** 自定义聚合函数 */
  aggregationFun?: (values: any[], records: any[]) => any;
  /** 格式化 */
  formatFun?: (value: any) => string;
}
```
