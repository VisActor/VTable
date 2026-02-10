# VTable PivotChart 配置

> PivotChart 继承 PivotTableConstructorOptions（见 pivot-table-options.md），以下仅列出 PivotChart 专有配置。

## PivotChartConstructorOptions

```typescript
/** 透视组合图配置 — 在透视表基础上扩展图表能力 */
export interface PivotChartConstructorOptions extends PivotTableConstructorOptions {
  /** 轴配置 */
  axes?: ITableAxisOption[];
  /** 图表维度联动高亮 */
  chartDimensionLinkage?: boolean;
}
```

## 轴配置

```typescript
/** 轴配置 */
export interface ITableAxisOption {
  /** 轴方向 */
  orient: 'left' | 'right' | 'top' | 'bottom';
  /** 是否可见 */
  visible?: boolean;
  /** 轴标题 */
  title?: { visible?: boolean; text?: string };
  /** 轴标签 */
  label?: { visible?: boolean; formatter?: (text: string) => string };
  /** 轴线 */
  domainLine?: { visible?: boolean };
  /** 网格线 */
  grid?: { visible?: boolean };
  /** 轴范围 */
  range?: { min?: number; max?: number };
  /** 是否同步不同指标的零值 */
  sync?: { axisId: string; zeroAlign?: boolean };
  /** 轴类型 */
  type?: 'linear' | 'band' | 'time' | 'log' | 'symlog';
  /** 是否 nice 处理 */
  nice?: boolean;
  /** 是否反向 */
  inverse?: boolean;
}
```

## 使用说明

PivotChart 需要先注册 VChart 模块：

```typescript
import * as VTable from '@visactor/vtable';
import VChart from '@visactor/vchart';

// 注册图表模块
VTable.register.chartModule('vchart', VChart);

// 在 indicators 中使用 cellType: 'chart'
const table = new VTable.PivotChart({
  container: document.getElementById('tableContainer'),
  records: data,
  rows: [{ dimensionKey: 'region', title: '区域', width: 100 }],
  columns: [{ dimensionKey: 'product', title: '产品' }],
  indicators: [
    {
      indicatorKey: 'sales',
      title: '销售额',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'bar',
        xField: 'region',
        yField: 'sales'
      }
    }
  ],
  axes: [
    { orient: 'bottom', visible: true },
    { orient: 'left', visible: true }
  ]
});
```
