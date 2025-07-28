# сводный таблица Tree Structure

сводный таблицаs support tree structures в both row и column headers, offering multiple display modes к meet different данные presentation needs.

## Tree Display Modes

### Row Header Tree Display Mode (rowHierarchyType)

Row headers support three display modes:

1. `grid` - по умолчанию mode, displays все levels в grid format
2. `tree` - Traditional tree structure, showing parent-child hierarchy relationships through indentation в a single column
3. `grid-tree` - Grid tree structure, combining grid и tree возможности, с каждый dimension occupying a column и supporting развернуть/свернуть operations

Specific configuration options:

- indicatorsAsCol: Whether к display indicators as column headers, defaults к true; Note: When rowHierarchyType is `tree`, indicators must be displayed в column headers
- rowHierarchyType: Sets the display format для row header hierarchical dimension structure, set к 'tree' для tree display
- rowExpandLevel: Sets the по умолчанию число из expanded levels
- rowHierarchyIndent: Sets the indentation distance из child-level dimension values relative к parent-level values в cells
- rowHierarchyTextStartAlignment: Whether к align текст для nodes в the same level, such as aligning текст для nodes с и без развернуть/свернуть иконкаs, defaults к false
- hierarchyState: Sets node свернуть state, configured в rowTree или columnTree nodes
- extensionRows: Special tree structure display для cases requiring multiple column tree structures. Note:
  - rowExpandLevel only affects the outer main rowTree, не trees в extensionRows
  - перетаскивание-и-отпускание header movement is не supported для this тип из multi-column tree structure
  - After calling updateOption, state maintenance для expanded/collapsed non-rowTree nodes is не supported

### Column Header Tree Display Mode (columnHierarchyType)

Column headers support two display modes:

1. `grid` - по умолчанию mode, displays все levels в grid format
2. `grid-tree` - Grid tree structure, с каждый dimension occupying a row и supporting развернуть/свернуть operations

Specific configuration options:

- indicatorsAsCol: Whether к display indicators as column headers, defaults к true
- columnHierarchyType: Sets the display format для column header hierarchical dimension structure, set к 'tree' для tree display
- columnExpandLevel: Sets the по умолчанию число из expanded levels

## Usвозраст пример

Here's a complete configuration пример код и its effect:


```javascript liveдемонстрация   template=vтаблица
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
    .then((res) => res.json())
    .then((данные) => {
const option = {
    rows: ['Order Year','Регион', 'Segment','Ship Mode'],
    columns: ['Категория', 'Sub-Категория'],
    indicators: ['Продажи', 'Прибыль'],
    enableданныеAnalysis: true,
    indicatorзаголовок: 'Indicators',
    //indicatorsAsCol: false,
    rowHierarchyType:'tree',
    columnHierarchyType:'grid-tree',
    corner: { titleOnDimension: 'row' },
    данныеConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Order Year','Регион', 'Segment'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'Subtotal'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Категория'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'Subtotal'
        }
      }
    },
    records:данные,
    ширинаMode: 'автоширина' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };


const таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);

    })
```

As shown в the пример, the row header tree display mode is set к `tree` и the column header tree display mode is set к `grid-tree`.

## Specifying свернуть/развернуть State для Header Nodes

в the above пример, Вы можете set the `hierarchyState` из данные nodes к specify whether they are collapsed или expanded, с values из either `развернуть` или `свернуть`.

для пример, к specify a rowTree node as expanded: `hierarchyState: 'развернуть'`.

```
    extensionRows: [
      //扩展的行表头维度组，因为可能扩展多个所以这里是个数组形式
      {
        rows: [
          {
            dimensionKey: 'Регион',
            заголовок: 'Регион',
            headerStyle: { цвет: 'red', textStick: true },
            ширина: '200'
          },
          { dimensionKey: 'province', заголовок: 'province', headerStyle: { цвет: 'purple' }, ширина: 300 }
        ],
        rowTree: [
          {
            dimensionKey: 'Регион',
            значение: '东北',
            children: [
              { dimensionKey: 'province', значение: '黑龙江' },
              { dimensionKey: 'province', значение: '吉林' }
            ]
          },
          {
            dimensionKey: 'Регион',
            значение: '华北',
            children: [{ dimensionKey: 'province', значение: '河北' }]
          }
        ]
      },
      {
        rows: [
          { dimensionKey: 'year', заголовок: 'year', headerStyle: { цвет: 'pink' }, ширина: 'авто' },
          'quarter'
        ],
        rowTree(args) {
          if (args[1]?.значение === '黑龙江') {
            возврат [
              {
                dimensionKey: 'year',
                значение: '2019',
                children: [
                  { dimensionKey: 'quarter', значение: '2019Q2' },
                  { dimensionKey: 'quarter', значение: '2019Q3' }
                ]
              }
            ];
          }
          возврат [
            {
              dimensionKey: 'year',
              значение: '2018',
              children: [
                { dimensionKey: 'quarter', значение: '2018Q1' },
                { dimensionKey: 'quarter', значение: '2018Q2' }
              ]
            }
          ];
        }
      }
    ],
```

The result is shown в Следующий imвозраст:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/multi-tree.jpeg)

This concludes the tutorial. We hope it helps you better understand how к use the tree structure возможности в сводный таблицаs!
