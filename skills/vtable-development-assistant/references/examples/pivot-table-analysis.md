# PivotTable 多维分析示例

## 1. 基础透视表（自动聚合）

```javascript
import * as VTable from '@visactor/vtable';

const records = [
  { region: '华东', product: '手机', quarter: 'Q1', sales: 12000 },
  { region: '华东', product: '手机', quarter: 'Q2', sales: 15000 },
  { region: '华东', product: '电脑', quarter: 'Q1', sales: 8000 },
  { region: '华北', product: '手机', quarter: 'Q1', sales: 9000 },
  { region: '华北', product: '电脑', quarter: 'Q2', sales: 11000 }
];

const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records,
  rows: [
    { dimensionKey: 'region', title: '区域', width: 120 }
  ],
  columns: [
    { dimensionKey: 'product', title: '产品' },
    { dimensionKey: 'quarter', title: '季度' }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      width: 120,
      format: (value) => `¥${value?.toLocaleString() ?? '-'}`
    }
  ],
  dataConfig: {
    aggregationRules: [
      { indicatorKey: 'sales', field: 'sales', aggregationType: VTable.TYPES.AggregationType.SUM }
    ]
  }
});
```

## 2. 多指标 + 合计

```javascript
const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records: salesData,
  rows: [
    { dimensionKey: 'region', title: '区域', width: 100 },
    { dimensionKey: 'city', title: '城市', width: 100 }
  ],
  columns: [
    { dimensionKey: 'category', title: '品类' }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      width: 110,
      format: (v) => `¥${(v ?? 0).toLocaleString()}`,
      style: { textAlign: 'right' }
    },
    {
      indicatorKey: 'profit',
      title: '利润',
      width: 110,
      format: (v) => `¥${(v ?? 0).toLocaleString()}`,
      style: {
        textAlign: 'right',
        color: (args) => args.dataValue < 0 ? '#ff4d4f' : '#52c41a'
      }
    }
  ],
  indicatorsAsCol: true,  // 指标在列方向
  dataConfig: {
    aggregationRules: [
      { indicatorKey: 'sales', field: 'sales', aggregationType: VTable.TYPES.AggregationType.SUM },
      { indicatorKey: 'profit', field: 'profit', aggregationType: VTable.TYPES.AggregationType.SUM }
    ],
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        grandTotalLabel: '总计',
        subTotalLabel: '小计'
      },
      column: {
        showGrandTotals: true,
        grandTotalLabel: '汇总'
      }
    }
  },
  corner: {
    titleOnDimension: 'row'
  }
});
```

## 3. 树形行表头

```javascript
const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records: data,
  rows: [
    {
      dimensionKey: 'department',
      title: '部门',
      width: 180,
      hierarchyType: 'tree'  // 树形显示
    },
    { dimensionKey: 'team', title: '团队', width: 120 }
  ],
  columns: [
    { dimensionKey: 'month', title: '月份' }
  ],
  indicators: [
    { indicatorKey: 'headcount', title: '人数', width: 80 },
    { indicatorKey: 'budget', title: '预算', width: 100 }
  ],
  rowExpandLevel: 1,        // 默认展开1层
  rowHierarchyIndent: 20    // 缩进像素
});
```

## 4. 自定义表头树（rowTree / columnTree）

```javascript
const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records: data,
  // 手动定义行表头树
  rowTree: [
    {
      dimensionKey: 'region',
      value: '华东',
      children: [
        { dimensionKey: 'city', value: '上海' },
        { dimensionKey: 'city', value: '杭州' }
      ]
    },
    {
      dimensionKey: 'region',
      value: '华北',
      children: [
        { dimensionKey: 'city', value: '北京' },
        { dimensionKey: 'city', value: '天津' }
      ]
    }
  ],
  // 手动定义列表头树
  columnTree: [
    {
      dimensionKey: 'quarter',
      value: 'Q1',
      children: [
        { indicatorKey: 'sales', value: '销售额' },
        { indicatorKey: 'profit', value: '利润' }
      ]
    },
    {
      dimensionKey: 'quarter',
      value: 'Q2',
      children: [
        { indicatorKey: 'sales', value: '销售额' },
        { indicatorKey: 'profit', value: '利润' }
      ]
    }
  ],
  rows: [
    { dimensionKey: 'region', title: '区域', width: 120 },
    { dimensionKey: 'city', title: '城市', width: 100 }
  ],
  columns: [
    { dimensionKey: 'quarter', title: '季度' }
  ],
  indicators: [
    { indicatorKey: 'sales', title: '销售额', width: 100 },
    { indicatorKey: 'profit', title: '利润', width: 100 }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: { fontWeight: 'bold' }
  }
});
```

## 5. 排序和过滤

```javascript
const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records: data,
  rows: [
    { dimensionKey: 'category', title: '品类', width: 120, showSort: true }
  ],
  columns: [
    { dimensionKey: 'year', title: '年份' }
  ],
  indicators: [
    { indicatorKey: 'amount', title: '金额', width: 100, showSort: true }
  ],
  dataConfig: {
    aggregationRules: [
      { indicatorKey: 'amount', field: 'amount', aggregationType: VTable.TYPES.AggregationType.SUM }
    ],
    sortRules: [
      { sortField: 'category', sortType: 'ASC' }  // 按品类升序
    ],
    filterRules: [
      { filterFunc: (record) => record.amount > 0 }  // 过滤掉负值
    ]
  }
});

// 监听排序事件
table.on('pivot_sort_click', (args) => {
  console.log('排序:', args);
});
```
