---
category: examples
group: table-type
title: Pivot Table Grid Tree Mode
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-grid-tree.gif
link: data_analysis/pivot_table_tree
option: PivotTable#rowHierarchyType('grid'%20%7C%20'tree'%7C'grid-tree')
---

# Pivot Table Grid Tree Mode

Pivot analysis table with grid tree display mode

## Key Configurations

- `PivotTable` Table type
- `rowHierarchyType` Set the hierarchical display to `grid-tree`, defaults to tiling mode `grid`.
- `columnHierarchyType` Set the hierarchical display to `grid-tree`, defaults to tiling mode `grid`.
- `rowExpandLevel` Set default expanded level, defaults to `1`.
- `columnExpandLevel` Set default expanded level, defaults to `1`.
- `indicatorsAsCol` Whether to display indicators as column headers, defaults to `true`.
- `columns` Column dimension configuration
- `rows` Row dimension configuration
- `indicators` Indicator configuration
- `dataConfig` Configure data rules, optional configuration items

## Code Demo

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
