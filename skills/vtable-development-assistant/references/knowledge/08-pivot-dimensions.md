# 透视表维度与指标

## 一、概念说明

透视表（PivotTable/PivotChart）通过 **维度**（Dimension）和 **指标**（Indicator）组织多维数据：

- **行维度** (`rows`): 决定行表头结构，如"地区"、"城市"
- **列维度** (`columns`): 决定列表头结构，如"年份"、"季度"
- **指标** (`indicators`): 需要展示的度量值，如"销售额"、"利润"

```
              ┌── 列维度（category） ──┐
              │ 办公用品 │    家具    │
┌─ 行维度 ──┐ ├──────────┼───────────┤
│ 华东      │ │  ¥1,200  │  ¥3,400   │ ← 指标值（sales）
│ 华北      │ │  ¥800    │  ¥2,100   │
└───────────┘ └──────────┴───────────┘
```

## 二、维度定义 IDimension

定义于 `packages/vtable/src/ts-types/pivot-table/dimension/`。

### 基础维度属性 (IBasicDimension)

| 属性 | 类型 | 说明 |
|---|---|---|
| `dimensionKey` | `string \| number` | **必填**。维度字段名，对应 records 中的 key |
| `title` | `string` | 维度标题（显示在角头或表头标题行） |
| `headerFormat` | `(value: any) => string` | 表头值格式化 |
| `width` | `number \| string` | 列宽（仅行维度有效） |
| `minWidth` | `number \| string` | 最小宽度 |
| `maxWidth` | `number \| string` | 最大宽度 |
| `headerStyle` | `ColumnStyleOption \| Function` | 表头样式 |
| `headerIcon` | `string \| ColumnIconOption \| Array` | 表头图标 |
| `headerCustomRender` | `ICustomRender` | 表头自定义渲染 |
| `headerCustomLayout` | `ICustomLayout` | 表头自定义布局 |
| `headerEditor` | `string \| IEditor` | 表头编辑器 |
| `description` | `string` | 维度描述（hover 提示） |
| `drillDown` | `boolean` | 显示下钻按钮 |
| `drillUp` | `boolean` | 显示上钻按钮 |
| `dropDownMenu` | `MenuListItem[]` | 下拉菜单 |
| `showSort` | `boolean` | 显示排序图标 |
| `sort` | `boolean` | 开启排序功能 |
| `disableHeaderHover` | `boolean` | 禁用 hover |
| `disableHeaderSelect` | `boolean` | 禁用选中 |
| `dragHeader` | `boolean` | 是否允许拖拽 |

### 维度类型变体

```typescript
// 行维度：支持 width/minWidth/maxWidth
type IRowDimension = ILinkDimension | IImageDimension | ITextDimension;

// 列维度：不支持 width（由指标决定）
type IColumnDimension = Omit<IRowDimension, 'width' | 'minWidth' | 'maxWidth'>;

// 联合类型
type IDimension = IRowDimension | IColumnDimension;
```

不同表头类型对应不同维度变体：
- `ITextDimension`: 默认文本维度
- `ILinkDimension`: 链接维度（表头显示为链接）
- `IImageDimension`: 图片维度（表头显示为图片）

### 维度配置示例

```typescript
rows: [
  {
    dimensionKey: 'region',
    title: '地区',
    width: 120,
    headerStyle: { fontWeight: 'bold' },
    drillDown: true,  // 下钻
    sort: true
  },
  {
    dimensionKey: 'city',
    title: '城市',
    width: 100,
    headerFormat: (value) => `📍 ${value}`
  }
],
columns: [
  {
    dimensionKey: 'category',
    title: '品类'
  },
  {
    dimensionKey: 'year',
    title: '年份'
  }
]
```

## 三、指标定义 IIndicator

定义于 `packages/vtable/src/ts-types/pivot-table/indicator/`。

### 基础指标属性

**表头部分 (HeaderIndicator)**:

| 属性 | 类型 | 说明 |
|---|---|---|
| `indicatorKey` | `string \| number` | **必填**。指标字段名，对应 records 中的 key |
| `title` | `string` | 指标标题 |
| `headerIcon` | `string \| ColumnIconOption \| Array` | 表头图标 |
| `headerStyle` | `ColumnStyleOption \| Function` | 表头样式 |
| `headerCustomRender` | `ICustomRender` | 表头自定义渲染 |
| `headerCustomLayout` | `ICustomLayout` | 表头自定义布局 |
| `sort` | `boolean` | 排序配置 |
| `showSort` | `boolean` | 显示排序图标 |
| `dropDownMenu` | `MenuListItem[]` | 下拉菜单 |
| `hide` | `boolean` | 隐藏该指标列 |
| `description` | `string` | 描述 |
| `disableHeaderHover` | `boolean` | 禁用 hover |
| `disableHeaderSelect` | `boolean` | 禁用选中 |

**Body 部分 (ColumnIndicator)**:

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` | `number \| string` | 列宽 |
| `minWidth` | `number \| string` | 最小宽度 |
| `maxWidth` | `number \| string` | 最大宽度 |
| `format` | `(value, col, row, table) => string` | 值格式化 |
| `cellType` | `ColumnTypeOption` | 单元格类型 |
| `style` | `ColumnStyleOption \| Function` | 单元格样式 |
| `icon` | `string \| ColumnIconOption \| Array \| Function` | 图标 |
| `customRender` | `ICustomRender` | 自定义渲染 |
| `customLayout` | `ICustomLayout` | 自定义布局 |
| `editor` | `string \| IEditor` | 编辑器 |
| `disableHover` | `boolean` | 禁用 hover |
| `disableSelect` | `boolean` | 禁用选中 |

### IChartIndicator（透视图专用）

在 IIndicator 基础上增加图表配置：

| 属性 | 类型 | 说明 |
|---|---|---|
| `cellType` | `'chart'` | 固定为 chart |
| `chartModule` | `string` | 图表模块名（'vchart'） |
| `chartSpec` | `any` | VChart 图表规范配置 |

### 指标配置示例

```typescript
indicators: [
  {
    indicatorKey: 'sales',
    title: '销售额',
    width: 120,
    format: (value) => value ? `¥${Number(value).toLocaleString()}` : '-',
    style: (args) => ({
      bgColor: args.dataValue > 3000 ? '#f6ffed' : '#fff',
      color: args.dataValue > 3000 ? '#52c41a' : '#333'
    }),
    sort: true
  },
  {
    indicatorKey: 'profit',
    title: '利润',
    width: 100,
    format: (value) => value ? `¥${Number(value).toLocaleString()}` : '-'
  }
]
```

## 四、角头配置 ICornerDefine

```typescript
corner: {
  titleOnDimension: 'row' | 'column' | 'all' | 'none';  // 标题显示位置
  headerStyle: ColumnStyleOption;                         // 角头样式
  customLayout: ICustomLayout;                            // 自定义布局
  customRender: ICustomRender;                            // 自定义渲染
}
```

## 五、自定义表头树 IHeaderTreeDefine

除了通过 `rows/columns + records` 自动生成表头，也可以手动定义表头树：

```typescript
type IHeaderTreeDefine = IDimensionHeaderNode | IIndicatorHeaderNode;

// 维度节点
interface IDimensionHeaderNode {
  dimensionKey: string | number;     // 维度字段
  value: string;                      // 维度值
  children?: IHeaderTreeDefine[];     // 子节点
  hierarchyState?: 'expand' | 'collapse';
  virtual?: boolean;                  // 虚拟节点（忽略数据匹配）
  levelSpan?: number;                 // 跨层级合并
}

// 指标节点
interface IIndicatorHeaderNode {
  indicatorKey: string | number;     // 指标 key
  value?: string;                     // 显示值
  children?: IHeaderTreeDefine[];
  hide?: boolean;                     // 隐藏
}
```

### 自定义表头树示例

```typescript
const table = new PivotTable({
  columnTree: [
    {
      dimensionKey: 'year',
      value: '2023',
      children: [
        { indicatorKey: 'sales', value: '销售额' },
        { indicatorKey: 'profit', value: '利润' }
      ]
    },
    {
      dimensionKey: 'year',
      value: '2024',
      children: [
        { indicatorKey: 'sales', value: '销售额' },
        { indicatorKey: 'profit', value: '利润' }
      ]
    }
  ],
  rowTree: [
    {
      dimensionKey: 'region',
      value: '华东',
      children: [
        { dimensionKey: 'city', value: '上海' },
        { dimensionKey: 'city', value: '杭州' }
      ]
    },
    { dimensionKey: 'region', value: '华北' }
  ]
});
```

## 六、数据分析配置 dataConfig

```typescript
dataConfig: {
  // 聚合规则
  aggregationRules: [
    {
      indicatorKey: 'sales',
      field: 'sales',
      aggregationType: VTable.AggregationType.SUM  // SUM | COUNT | AVG | MAX | MIN | NONE
    }
  ],
  
  // 排序规则
  sortRules: [
    {
      sortField: 'region',
      sortType: VTable.SortType.ASC,  // ASC | DESC | NONE
      sortByIndicator: 'sales'        // 按指标值排序
    }
  ],
  
  // 筛选规则
  filterRules: [
    {
      filterFunc: (record) => record.sales > 100
    }
  ],
  
  // 小计/总计
  totals: {
    row: {
      showGrandTotals: true,         // 显示行总计
      showSubTotals: true,           // 显示行小计
      grandTotalLabel: '总计',
      subTotalLabel: '小计',
      subTotalsDimensions: ['region']  // 对哪些维度显示小计
    },
    column: {
      showGrandTotals: true,
      grandTotalLabel: '总计'
    }
  },

  // 派生字段
  derivedFieldRules: [
    {
      fieldName: 'profitRate',
      derivedFunc: (record) => {
        return record.profit / record.sales;
      }
    }
  ]
}
```

## 七、透视表行层级展示

```typescript
// grid 模式（默认）：每个维度独立一列
rowHierarchyType: 'grid'

// tree 模式：所有行维度在一列中树形展示
rowHierarchyType: 'tree'

// grid-tree 模式：grid 布局但支持展开收起
rowHierarchyType: 'grid-tree'
```

### 表头标题行/列

```typescript
// 在列表头顶部增加一行显示维度名称
columnHeaderTitle: {
  title: true,                     // 或自定义字符串
  headerStyle: { fontWeight: 'bold' }
}

// 在行表头左侧增加一列显示维度名称
rowHeaderTitle: {
  title: true,
  headerStyle: { fontWeight: 'bold' }
}
```
