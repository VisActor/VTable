---
category: examples
group: table-type
title: 透视表平铺树形展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-grid-tree.gif
link: data_analysis/pivot_table_tree
option: PivotTable#rowHierarchyType('grid'%20%7C%20'tree'%7C'grid-tree')
---

# 透视表平铺树形展示

透视分析表格平铺树形展示

## 关键配置

- `PivotTable` 表格类型
- `rowHierarchyType` 将层级展示设置为`grid-tree`，默认为平铺模式`grid`。
- `columnHierarchyType` 将层级展示设置为`grid-tree`，默认为平铺模式`grid`。
- `rowExpandLevel` 设置默认展开层级，默认为`1`。
- `columnExpandLevel` 设置默认展开层级，默认为`1`。
- `indicatorsAsCol` 指标是否作为列表头展示，默认为`true`。
- `columns` 列维度配置
- `rows` 行维度配置
- `indicators` 指标配置
- `dataConfig` 配置数据规则，可选配置项

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then((res) => res.json())
    .then((data) => {
const option = {
    rows: ['Order Year','Region', 'Segment','Ship Mode'],
    columns: ['Category', 'Sub-Category'],
    indicators: ['Sales', 'Profit'],
    enableDataAnalysis: true,
    indicatorTitle: 'Indicators',
    //indicatorsAsCol: false,
    rowHierarchyType:'grid-tree',
    columnHierarchyType:'grid-tree',
    corner: { titleOnDimension: 'column' },
    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Order Year','Region', 'Segment'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'SubTotal'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Category'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'SubTotal'
        }
      }
    },
    records:data,
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
