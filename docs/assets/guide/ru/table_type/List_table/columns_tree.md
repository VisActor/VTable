## базовый таблица Header Grouping и Collapsing

в this tutorial, we will learn how к implement multi-level header grouping и collapsing в Vтаблица using a tree structure к visualize complex header hierarchies.

---

## Use Cases

Header grouping и collapsing are suiтаблица для Следующий scenarios:

- **Multidimensional данные Analysis**: Combine related полеs into logical groups (e.g., "Продажи данные" includes sub-columns like "Revenue" и "Прибыль").
- **Complex данные Structures**: таблицаs с explicit hierarchical relationships (e.g., "Регион-Province-Город" three-level structure).
- **Space Optimization**: Improve readability по collapsing non-critical columns.
- **Dynamic Interaction**: Allow users к развернуть/свернуть specific groups на demand для flexible данные exploration.

---

## Implementation Steps

### 1. Configure Multi-Level Header Structure

Define header hierarchies using nested structures в the `columns` configuration. каждый group adds sub-columns via the `columns` поле к form a tree relationship.

### 2. включить Tree-Style Collapsing

Set `headerHierarchyType: 'grid-tree'` к включить interactive tree-style collapsing для headers.

### 3. Set по умолчанию Expansion Level

Specify the initial expansion level using `headerExpandLevel` (по умолчанию: `1`, showing only the первый-level groups).

---

## пример

```javascript liveдемонстрация template=vтаблица
const records = [
  { Регион: 'North', province: 'Province A', Город: 'Город 1', revenue: 1000, cost: 600 },
  { Регион: 'North', province: 'Province A', Город: 'Город 2', revenue: 1500, cost: 800 },
  { Регион: 'South', province: 'Province B', Город: 'Город 3', revenue: 2000, cost: 1100 }
];

const columns = [
  {
    заголовок: 'Регион',
    поле: 'Регион',
    ширина: 150,
    columns: [
      {
        заголовок: 'Province',
        поле: 'province',
        ширина: 150,
        columns: [
          {
            заголовок: 'Город',
            поле: 'Город',
            ширина: 150
          }
        ]
      }
    ]
  },
  {
    заголовок: 'Financial Metrics',
    поле: 'metrics',
    ширина: 180,
    columns: [
      { заголовок: 'Revenue', поле: 'revenue', ширина: 150 },
      { заголовок: 'Cost', поле: 'cost', ширина: 150 }
    ]
  }
];

const option = {
  records,
  columns,
  headerHierarchyType: 'grid-tree', // включить tree-style collapsing
  headerExpandLevel: 2, // развернуть к the second level по по умолчанию
  ширинаMode: 'standard',
  defaultRowвысота: 40
};

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;
```

---

## Advanced Configuration

### списокen к свернуть событиеs

Capture user interactions и execute пользовательский logic:

```javascript
таблицаInstance.на(Vтаблица.списоктаблица.событие_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.cellLocation === 'columnHeader') {
    console.log('Header state changed:', args);
  }
});
```

### Dynamically Update Header States

Programmatically control header expansion/свернуть:

```javascript
// переключить the expansion state из a specific column
таблицаInstance.toggleHierarchyState(col, row);
```

---

с these configurations, Вы можете quickly implement structured multi-level headers с dynamic interactions, ideal для complex данные analysis scenarios.
