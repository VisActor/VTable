# 表格类型与配置详解

## 一、公共配置 BaseTableConstructorOptions

所有表格类型共享的配置项，定义于 `packages/vtable/src/ts-types/table-engine.ts`。

### 容器与尺寸

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `container` | `HTMLElement \| string` | **必填** | DOM 容器元素 |
| `widthMode` | `'standard' \| 'adaptive' \| 'autoWidth'` | `'standard'` | 列宽模式：固定/自适应容器/按内容 |
| `heightMode` | `'standard' \| 'adaptive' \| 'autoHeight'` | `'standard'` | 行高模式：固定/自适应容器/按内容 |
| `autoFillWidth` | `boolean` | `false` | 列总宽不足时自动拉伸填满容器 |
| `autoFillHeight` | `boolean` | `false` | 行总高不足时自动拉伸填满容器 |
| `defaultRowHeight` | `number \| 'auto'` | `40` | 默认行高 |
| `defaultColWidth` | `number` | `80` | 默认列宽 |
| `defaultHeaderRowHeight` | `number \| (number \| 'auto')[]` | — | 表头行高（可按行设置） |
| `defaultHeaderColWidth` | `(number \| 'auto') \| (number \| 'auto')[]` | — | 表头列宽 |
| `limitMaxAutoWidth` | `boolean \| number` | `450` | 自动计算列宽时的最大列宽限制 |
| `limitMinWidth` | `number` | — | 最小列宽限制 |
| `pixelRatio` | `number` | `devicePixelRatio` | 画布像素比 |

### 冻结

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `frozenColCount` | `number` | `0` | 左侧冻结列数（含表头） |
| `frozenRowCount` | `number` | — | 顶部冻结行数 |
| `rightFrozenColCount` | `number` | `0` | 右侧冻结列数 |
| `bottomFrozenRowCount` | `number` | `0` | 底部冻结行数 |

### 文字

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `autoWrapText` | `boolean` | `false` | 全局文字自动换行 |
| `enableLineBreak` | `boolean` | `false` | 是否识别换行符 `\n` |

### 交互 — hover

```typescript
hover: {
  highlightMode: 'cross' | 'column' | 'row' | 'cell';  // 高亮模式，默认 'cross'
  disableHover?: boolean;         // 禁用 hover 效果
  disableHeaderHover?: boolean;   // 禁用表头 hover
  enableSingleCell?: boolean;     // 是否使能单单元格 hover
}
```

### 交互 — select

```typescript
select: {
  disableSelect?: boolean;         // 禁用选择
  disableHeaderSelect?: boolean;   // 禁用表头选择
  highlightMode?: 'cross' | 'column' | 'row' | 'cell';
  headerSelectMode?: 'inline' | 'cell'; // 点击表头是选中整行/列还是单个表头
  blankAreaClickDeselect?: boolean;      // 点击空白区域取消选中
}
```

### 交互 — 键盘

```typescript
keyboardOptions: {
  moveFocusCellOnTab?: boolean;        // Tab 键移动焦点，默认 true
  editCellOnEnter?: boolean;           // Enter 键进入编辑，默认 true
  moveFocusCellOnEnter?: boolean;      // Enter 键移动焦点（与 editCellOnEnter 互斥）
  moveEditCellOnArrowKeys?: boolean;   // 方向键在编辑态切换单元格
  selectAllOnCtrlA?: boolean;          // Ctrl+A 全选
  copySelected?: boolean;             // Ctrl+C 复制
  pasteValueToCell?: boolean;          // Ctrl+V 粘贴
  cutSelected?: boolean;              // Ctrl+X 剪切
  moveSelectedCellOnArrowKeys?: boolean; // 方向键切换选中，默认 true
  ctrlMultiSelect?: boolean;           // Ctrl 多选
  shiftMultiSelect?: boolean;          // Shift 范围选
}
```

### 交互 — 列宽/行高调整

```typescript
resize: {
  columnResizeMode?: 'all' | 'none' | 'header' | 'body';  // 列宽调整范围
  rowResizeMode?: 'all' | 'none' | 'header' | 'body';
  columnResizeWidth?: number;  // 触发调整的热区宽度
}
```

### 交互 — 拖拽

```typescript
dragOrder: {
  dragHeaderMode?: 'all' | 'none' | 'column' | 'row'; // 拖拽表头模式
  frozenColDragHeaderMode?: 'disabled' | 'adjustFrozenCount' | 'fixedFrozenCount';
}
```

### 菜单

```typescript
menu: {
  renderMode?: 'canvas' | 'html';
  defaultHeaderMenuItems?: MenuListItem[] | ((args) => MenuListItem[]);
  contextMenuItems?: MenuListItem[] | ((field, row, col, table) => MenuListItem[]);
  dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
}
```

### 提示框

```typescript
tooltip: {
  renderMode?: 'html' | 'canvas';
  isShowOverflowTextTooltip?: boolean;  // 省略文字悬浮提示
  confine?: boolean;                    // 限制在表格区域内
  overflowTextTooltipDisappearDelay?: number;
}
```

### 主题与标题

| 配置项 | 类型 | 说明 |
|---|---|---|
| `theme` | `ITableThemeDefine` | 主题配置（详见 `03-style-theme.md`） |
| `title` | `ITitle` | 表格标题（text, subtext, orient, padding） |
| `emptyTip` | `IEmptyTip` | 数据为空提示 |

### 其他

| 配置项 | 类型 | 说明 |
|---|---|---|
| `customMergeCell` | `CustomMergeCell` | 自定义合并单元格规则 |
| `rowSeriesNumber` | `IRowSeriesNumber` | 行序号列配置 |
| `overscrollBehavior` | `'auto' \| 'none'` | 滚动到边界的行为 |
| `renderChartAsync` | `boolean` | 图表异步渲染 |
| `animationAppear` | `IAnimationAppear` | 出场动画 |
| `customCellStyle` | `CustomCellStyle[]` | 预注册自定义样式 |
| `customCellStyleArrangement` | `CustomCellStyleArrangement[]` | 预分配自定义样式 |

---

## 二、ListTable — 基本表格

定义于 `ListTableConstructorOptions`，继承 `BaseTableConstructorOptions`。

### 专有配置

| 配置项 | 类型 | 说明 |
|---|---|---|
| `records` | `any[]` | 数据数组，每项为一个记录对象 |
| `columns` | `ColumnsDefine` | 列定义数组（详见 `02-column-cell-types.md`） |
| `transpose` | `boolean` | 是否转置（行列互换） |
| `showHeader` | `boolean` | 是否显示表头 |
| `pagination` | `IPagination` | 分页配置 |
| `sortState` | `SortState \| SortState[]` | 排序状态 |
| `multipleSort` | `boolean` | 是否开启多列排序 |
| `editor` | `string \| IEditor \| Function` | 全局编辑器 |
| `headerEditor` | `string \| IEditor \| Function` | 全局表头编辑器 |
| `editCellTrigger` | `'doubleclick' \| 'click' \| 'api' \| 'keydown'` | 编辑触发方式 |
| `hierarchyIndent` | `number` | 树形缩进像素 |
| `hierarchyExpandLevel` | `number` | 树形默认展开层级 |
| `aggregation` | `Aggregation \| Aggregation[]` | 聚合汇总配置 |
| `groupConfig` | `GroupConfig` | 分组配置 |

### 分页 IPagination

```typescript
interface IPagination {
  totalCount?: number;     // 数据总条数
  perPageCount: number;    // 每页条数
  currentPage?: number;    // 当前页码（从 1 开始）
}
```

### 排序 SortState

```typescript
interface SortState {
  field: FieldDef;                                      // 排序字段
  order: 'asc' | 'desc' | 'normal';                    // 排序方向
  orderFn?: (a: any, b: any, order: string) => -1|0|1; // 自定义排序函数
}
```

### 最小示例

```typescript
import { ListTable } from '@visactor/vtable';

const table = new ListTable({
  container: document.getElementById('container'),
  records: [
    { id: 1, name: 'Alice', age: 25, city: 'Beijing' },
    { id: 2, name: 'Bob', age: 30, city: 'Shanghai' }
  ],
  columns: [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '姓名', width: 120 },
    { field: 'age', title: '年龄', width: 80, sort: true },
    { field: 'city', title: '城市', width: 120 }
  ],
  widthMode: 'standard',
  defaultRowHeight: 40
});
```

---

## 三、PivotTable — 透视表

定义于 `PivotTableConstructorOptions`，继承 `BaseTableConstructorOptions`。

### 专有配置

| 配置项 | 类型 | 说明 |
|---|---|---|
| `records` | `any[]` | 平坦数据集 |
| `rows` | `(IRowDimension \| string)[]` | 行维度定义 |
| `columns` | `(IColumnDimension \| string)[]` | 列维度定义 |
| `indicators` | `(IIndicator \| string)[]` | 指标定义 |
| `rowTree` | `IHeaderTreeDefine[]` | 自定义行表头树 |
| `columnTree` | `IHeaderTreeDefine[]` | 自定义列表头树 |
| `indicatorsAsCol` | `boolean` | 指标按列展示 |
| `hideIndicatorName` | `boolean` | 隐藏指标名 |
| `corner` | `ICornerDefine` | 角头配置 |
| `showColumnHeader` | `boolean` | 显示列表头 |
| `showRowHeader` | `boolean` | 显示行表头 |
| `columnHeaderTitle` | `ITitleDefine` | 列表头维度名行 |
| `rowHeaderTitle` | `ITitleDefine` | 行表头维度名列 |
| `dataConfig` | `IPivotTableDataConfig` | 数据分析配置（聚合、排序、筛选规则） |
| `rowHierarchyType` | `'grid' \| 'tree' \| 'grid-tree'` | 行表头展示形式 |
| `rowExpandLevel` | `number` | 行展开层数 |
| `columnExpandLevel` | `number` | 列展开层数 |
| `rowHierarchyIndent` | `number` | 行缩进距离 |
| `pivotSortState` | `{ dimensions, order }[]` | 排序状态 |
| `pagination` | `IPagination` | 分页 |
| `editor` | `string \| IEditor \| Function` | 编辑器 |

### 数据分析配置 dataConfig

```typescript
interface IPivotTableDataConfig {
  aggregationRules?: AggregationRule[];   // 聚合规则
  sortRules?: SortRule[];                 // 排序规则
  filterRules?: FilterRule[];             // 筛选规则
  derivedFieldRules?: DerivedFieldRule[]; // 派生字段规则
  totals?: Totals;                        // 小计/总计配置
  mappingRules?: MappingRule[];           // 数据映射规则
}
```

### 最小示例

```typescript
import { PivotTable } from '@visactor/vtable';

const table = new PivotTable({
  container: document.getElementById('container'),
  records: [
    { region: '华东', category: '办公用品', sales: 1200 },
    { region: '华东', category: '家具', sales: 3400 },
    { region: '华北', category: '办公用品', sales: 800 },
    { region: '华北', category: '家具', sales: 2100 }
  ],
  rows: ['region'],
  columns: ['category'],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额',
    width: 'auto',
    format: (value) => `¥${value?.toLocaleString() ?? ''}`
  }],
  corner: {
    titleOnDimension: 'row'
  }
});
```

---

## 四、PivotChart — 透视图

定义于 `PivotChartConstructorOptions`，继承 `BaseTableConstructorOptions`。

### 与 PivotTable 的差异

| 差异点 | PivotTable | PivotChart |
|---|---|---|
| `indicators` | `IIndicator` | `IChartIndicator`（含 chartSpec） |
| `axes` | 无 | `ITableAxisOption[]` 坐标轴配置 |
| `chartDimensionLinkage` | 无 | 多图表联动交互 |
| `dataConfig` | 可选 | 内部自动开启 |

### 最小示例

```typescript
import { PivotChart, register } from '@visactor/vtable';
import VChart from '@visactor/vchart';

// 必须先注册 VChart 模块
register.bindChartModule(VChart);

const table = new PivotChart({
  container: document.getElementById('container'),
  records: data,
  rows: ['region'],
  columns: ['category'],
  indicators: [{
    indicatorKey: 'sales',
    title: '销售额',
    cellType: 'chart',
    chartModule: 'vchart',
    chartSpec: {
      type: 'bar',
      xField: ['category'],
      yField: 'sales'
    }
  }],
  axes: [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ]
});
```
