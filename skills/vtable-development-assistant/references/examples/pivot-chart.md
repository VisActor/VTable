# PivotChart 透视组合图示例

## 1. 基础 PivotChart

```javascript
import * as VTable from '@visactor/vtable';
import VChart from '@visactor/vchart';

// 注册 VChart 模块
VTable.register.chartModule('vchart', VChart);

const records = [
  { region: '华东', product: '手机', sales: 12000, profit: 3000 },
  { region: '华东', product: '电脑', sales: 8000, profit: 2000 },
  { region: '华北', product: '手机', sales: 9000, profit: 2500 },
  { region: '华北', product: '电脑', sales: 11000, profit: 3500 }
];

const table = new VTable.PivotChart({
  container: document.getElementById('tableContainer'),
  records,
  rows: [{ dimensionKey: 'region', title: '区域', width: 100 }],
  columns: [{ dimensionKey: 'product', title: '产品' }],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      width: 250,
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'bar',
        xField: 'region',
        yField: 'sales',
        bar: {
          style: {
            fill: '#1890ff'
          }
        }
      }
    }
  ],
  axes: [
    {
      orient: 'bottom',
      visible: true,
      label: { visible: true }
    },
    {
      orient: 'left',
      visible: true,
      title: { visible: true, text: '销售额' }
    }
  ]
});
```

## 2. 多指标（柱形 + 折线）

```javascript
const table = new VTable.PivotChart({
  container: document.getElementById('tableContainer'),
  records: monthlyData,
  rows: [{ dimensionKey: 'category', title: '品类', width: 100 }],
  columns: [{ dimensionKey: 'month', title: '月份' }],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      width: 200,
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'bar',
        xField: 'month',
        yField: 'sales',
        bar: { style: { fill: '#5B8FF9' } }
      }
    },
    {
      indicatorKey: 'growth',
      title: '增长率',
      width: 200,
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'line',
        xField: 'month',
        yField: 'growth',
        line: { style: { stroke: '#5AD8A6' } },
        point: { style: { fill: '#5AD8A6' } }
      }
    }
  ],
  indicatorsAsCol: true,
  axes: [
    { orient: 'bottom', visible: true },
    { orient: 'left', visible: true, title: { visible: true, text: '销售额' } },
    { orient: 'right', visible: true, title: { visible: true, text: '增长率' } }
  ]
});
```

## 3. 组合图 + 图例联动

```javascript
const table = new VTable.PivotChart({
  container: document.getElementById('tableContainer'),
  records: data,
  rows: [{ dimensionKey: 'region', title: '区域', width: 100 }],
  columns: [{ dimensionKey: 'quarter', title: '季度' }],
  indicators: [
    {
      indicatorKey: 'revenue',
      title: '营收分析',
      width: 300,
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'common',
        seriesField: 'type',
        series: [
          {
            type: 'bar',
            data: { id: 'bar' },
            xField: 'quarter',
            yField: 'revenue',
            bar: { style: { fill: { field: 'type', scale: 'color' } } }
          },
          {
            type: 'line',
            data: { id: 'line' },
            xField: 'quarter',
            yField: 'target',
            line: { style: { stroke: '#FF6B6B', lineDash: [5, 5] } }
          }
        ],
        legends: { visible: true, orient: 'top' }
      }
    }
  ],
  chartDimensionLinkage: true // 跨单元格维度联动高亮
});

// 监听图例事件
table.on('legend_item_click', args => {
  console.log('图例点击:', args);
});
```

## 4. PivotChart records 对象格式（分指标分组时的注意事项）

```javascript
// 当 records 是对象格式时，key 必须与每个 indicator 的 indicatorKey 严格一致
// 否则图表只渲染轴，不渲染柱/折线等图形元素

const table = new VTable.PivotChart({
  container: document.getElementById('tableContainer'),
  indicatorsAsCol: false,
  columnTree: [],
  rowTree: [],
  rows: [],
  columns: [],
  indicators: [
    { indicatorKey: 'METRIC_A', cellType: 'chart', chartModule: 'vchart',
      chartSpec: { type: 'bar', xField: 'date', yField: 'value' } },
    { indicatorKey: 'METRIC_B', cellType: 'chart', chartModule: 'vchart',
      chartSpec: { type: 'bar', xField: 'date', yField: 'count' } }
  ],
  // ✅ 正确：records 的 key 与 indicatorKey 完全一致
  records: {
    'METRIC_A': [ { date: '2024-01', value: 100 }, ... ],
    'METRIC_B': [ { date: '2024-01', count: 50 }, ... ]
  }
  // ❌ 错误示例（会导致图表无数据）：
  // records: { 'METRICA': [...], 'METRICB': [...] }  // 缺少下划线
});
```

**副作用对照表：**

| 配置                       | 现象                          |
| -------------------------- | ----------------------------- |
| records key = indicatorKey | ✅ 柱/线等图形正常渲染        |
| records key ≠ indicatorKey | ❌ 只渲染坐标轴，图形区域空白 |

## 5. 迷你图 + 进度条混用

```javascript
// PivotTable 中直接使用 sparkline 和 progressbar（不需要 PivotChart）
const table = new VTable.PivotTable({
  container: document.getElementById('tableContainer'),
  records: data,
  rows: [{ dimensionKey: 'department', title: '部门', width: 120 }],
  columns: [{ dimensionKey: 'metric', title: '指标' }],
  indicators: [
    {
      indicatorKey: 'trend',
      title: '趋势',
      width: 180,
      cellType: 'sparkline',
      sparklineSpec: {
        type: 'line',
        xField: 'day',
        yField: 'value',
        line: { style: { stroke: '#1890ff' } },
        point: { style: { fill: '#1890ff', size: 3 } }
      }
    },
    {
      indicatorKey: 'completion',
      title: '完成率',
      width: 150,
      cellType: 'progressbar',
      min: 0,
      max: 100,
      style: {
        barColor: args => (args.dataValue >= 80 ? '#52c41a' : args.dataValue >= 50 ? '#faad14' : '#ff4d4f')
      }
    }
  ]
});
```
