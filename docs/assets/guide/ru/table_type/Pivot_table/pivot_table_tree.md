# Pivot Table Tree Structure

Pivot tables support tree structures in both row and column headers, offering multiple display modes to meet different data presentation needs.

## Tree Display Modes

### Row Header Tree Display Mode (rowHierarchyType)

Row headers support three display modes:

1. `grid` - Default mode, displays all levels in grid format
2. `tree` - Traditional tree structure, showing parent-child hierarchy relationships through indentation in a single column
3. `grid-tree` - Grid tree structure, combining grid and tree features, with each dimension occupying a column and supporting expand/collapse operations

Specific configuration options:

- indicatorsAsCol: Whether to display indicators as column headers, defaults to true; Note: When rowHierarchyType is `tree`, indicators must be displayed in column headers
- rowHierarchyType: Sets the display format for row header hierarchical dimension structure, set to 'tree' for tree display
- rowExpandLevel: Sets the default number of expanded levels
- rowHierarchyIndent: Sets the indentation distance of child-level dimension values relative to parent-level values in cells
- rowHierarchyTextStartAlignment: Whether to align text for nodes at the same level, such as aligning text for nodes with and without expand/collapse icons, defaults to false
- hierarchyState: Sets node collapse state, configured in rowTree or columnTree nodes
- extensionRows: Special tree structure display for cases requiring multiple column tree structures. Note:
  - rowExpandLevel only affects the outer main rowTree, not trees in extensionRows
  - Drag-and-drop header movement is not supported for this type of multi-column tree structure
  - After calling updateOption, state maintenance for expanded/collapsed non-rowTree nodes is not supported

### Column Header Tree Display Mode (columnHierarchyType)

Column headers support two display modes:

1. `grid` - Default mode, displays all levels in grid format
2. `grid-tree` - Grid tree structure, with each dimension occupying a row and supporting expand/collapse operations

Specific configuration options:

- indicatorsAsCol: Whether to display indicators as column headers, defaults to true
- columnHierarchyType: Sets the display format for column header hierarchical dimension structure, set to 'tree' for tree display
- columnExpandLevel: Sets the default number of expanded levels

## Usage Example

Here's a complete configuration example code and its effect:


```javascript livedemo   template=vtable
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
    rowHierarchyType:'tree',
    columnHierarchyType:'grid-tree',
    corner: { titleOnDimension: 'row' },
    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Order Year','Region', 'Segment'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'Subtotal'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Category'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'Subtotal'
        }
      }
    },
    records:data,
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };


const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);

    })
```

As shown in the example, the row header tree display mode is set to `tree` and the column header tree display mode is set to `grid-tree`.

## Specifying Collapse/Expand State for Header Nodes

In the above example, you can set the `hierarchyState` of data nodes to specify whether they are collapsed or expanded, with values of either `expand` or `collapse`.

For example, to specify a rowTree node as expanded: `hierarchyState: 'expand'`.

```
    extensionRows: [
      //扩展的行表头维度组，因为可能扩展多个所以这里是个数组形式
      {
        rows: [
          {
            dimensionKey: 'region',
            title: 'region',
            headerStyle: { color: 'red', textStick: true },
            width: '200'
          },
          { dimensionKey: 'province', title: 'province', headerStyle: { color: 'purple' }, width: 300 }
        ],
        rowTree: [
          {
            dimensionKey: 'region',
            value: '东北',
            children: [
              { dimensionKey: 'province', value: '黑龙江' },
              { dimensionKey: 'province', value: '吉林' }
            ]
          },
          {
            dimensionKey: 'region',
            value: '华北',
            children: [{ dimensionKey: 'province', value: '河北' }]
          }
        ]
      },
      {
        rows: [
          { dimensionKey: 'year', title: 'year', headerStyle: { color: 'pink' }, width: 'auto' },
          'quarter'
        ],
        rowTree(args) {
          if (args[1]?.value === '黑龙江') {
            return [
              {
                dimensionKey: 'year',
                value: '2019',
                children: [
                  { dimensionKey: 'quarter', value: '2019Q2' },
                  { dimensionKey: 'quarter', value: '2019Q3' }
                ]
              }
            ];
          }
          return [
            {
              dimensionKey: 'year',
              value: '2018',
              children: [
                { dimensionKey: 'quarter', value: '2018Q1' },
                { dimensionKey: 'quarter', value: '2018Q2' }
              ]
            }
          ];
        }
      }
    ],
```

The result is shown in the following image:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/multi-tree.jpeg)

This concludes the tutorial. We hope it helps you better understand how to use the tree structure features in pivot tables!
