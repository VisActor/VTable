---
категория: примеры
группа: таблица-тип
заголовок: сводный таблица Grid Tree Mode
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-таблица-grid-tree.gif
ссылка: данные_analysis/сводный_таблица_tree
опция: сводныйтаблица#rowHierarchyType('grid'%20%7C%20'tree'%7C'grid-tree')
---

# сводный таблица Grid Tree Mode

сводный analysis таблица с grid tree display mode

## Ключевые Конфигурации

- `сводныйтаблица` таблица тип
- `rowHierarchyType` Set the hierarchical display к `grid-tree`, defaults к tiling mode `grid`.
- `columnHierarchyType` Set the hierarchical display к `grid-tree`, defaults к tiling mode `grid`.
- `rowExpandLevel` Set по умолчанию expanded level, defaults к `1`.
- `columnExpandLevel` Set по умолчанию expanded level, defaults к `1`.
- `indicatorsAsCol` Whether к display indicators as column headers, defaults к `true`.
- `columns` Column dimension configuration
- `rows` Row dimension configuration
- `indicators` Indicator configuration
- `данныеConfig` Configure данные rules, необязательный configuration items

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
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
    rowHierarchyType:'grid-tree',
    columnHierarchyType:'grid-tree',
    corner: { titleOnDimension: 'column' },
    данныеConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Order Year','Регион', 'Segment'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'SubTotal'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Категория'],
          grandTotalLabel: 'Total',
          subTotalLabel: 'SubTotal'
        }
      }
    },
    records:данные,
    ширинаMode: 'автоширина' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
