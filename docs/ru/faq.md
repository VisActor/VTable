# ЧаВо - Часто задаваемые вопросы

## Установка и настройка

### В: Как установить VTable?
**О:** Вы можете установить VTable используя npm, yarn или pnpm:
```bash
npm install @visactor/VTable
yarn add @visactor/VTable
pnpm add @visactor/VTable
```

### В: Могу ли я использовать VTable с CDN?
**О:** Да, вы можете подключить VTable через CDN:
```html
<script src="https://unpkg.com/@visactor/VTable@latest/build/index.min.js"></script>
```

### В: Какие браузеры поддерживает VTable?
**О:** VTable поддерживает все современные браузеры, включая Chrome, Firefox, Safari и Edge. IE11 не поддерживается.

### В: Нужно ли подключать CSS файлы?
**О:** Нет, VTable основан на canvas и не требует отдельных CSS файлов. Вся стилизация обрабатывается через JavaScript API.

## Базовое использование

### В: Как создать простую таблицу?
**О:** Вот базовый пример:
```javascript
import { ListTable } от '@visactor/VTable';

const table = новый ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'name', caption: 'Имя', ширина: 150 },
    { field: 'age', caption: 'Возраст', ширина: 80 }
  ],
  records: [
    { name: 'Иван', age: 30 },
    { name: 'Мария', age: 25 }
  ]
});
```

### Q: How do I update data в the table?
**A:** Use the `updateRecords` method:
```javascript
table.updateRecords(newData);
```

### Q: How do I add новый rows?
**A:** Use `addRecord` или `addRecords`:
```javascript
table.addRecord({ name: 'Bob', age: 35 });
table.addRecords([{ name: 'Alice', age: 28 }, { name: 'Charlie', age: 32 }]);
```

## Performance

### Q: How many rows can VTable handle?
**A:** VTable can efficiently handle millions из rows using virtual scrolling. The exact число depends на your data complexity и hardware.

### Q: My table is slow с large datasets. What can I do?
**A:** 
1. включить virtual scrolling: `scrollMode: 'virtual'`
2. Use fixed row heights: `defaultRowHeight: 40`
3. Minimize complex styling functions
4. Consider pagination для very large datasets

### Q: How do I включить virtual scrolling?
**A:** Set the `scrollMode` option:
```javascript
const table = новый ListTable({
  // ... other options
  scrollMode: 'virtual'
});
```

## Styling и Themes

### Q: How do I change the table theme?
**A:** Use the `theme` option:
```javascript
const table = новый ListTable({
  // ... other options
  theme: 'DARK' // 'по умолчанию', 'ARCO', 'BRIGHT', 'DARK', 'SIMPLIFY'
});
```

### Q: Can I create custom themes?
**A:** Yes, Вы можете register custom themes:
```javascript
import { themes } от '@visactor/VTable';

const customTheme = {
  defaultStyle: {
    цвет: '#333',
    bgColor: '#fff',
    fontSize: 14
  },
  // ... more style definitions
};

themes.register('CUSTOM', customTheme);

const table = новый ListTable({
  theme: 'CUSTOM'
});
```

### Q: How do I style individual cells?
**A:** Use style functions в column definitions:
```javascript
{
  field: 'status',
  caption: 'Status',
  style: {
    bgColor: (args) => {
      возврат args.dataValue === 'активный' ? '#d4edda' : '#f8d7da';
    }
  }
}
```

## Column Types

### Q: What column types are доступный?
**A:** VTable supports several column types:
- `текст` - Regular текст display
- `link` - Clickable links
- `image` - Image display
- `progressbar` - Progress bars
- `chart` - Embedded charts
- `флажок` - Checkboxes

### Q: How do I create a progress bar column?
**A:** Set the `cellType` к `progressbar`:
```javascript
{
  field: 'progress',
  caption: 'Progress',
  cellType: 'progressbar',
  min: 0,
  max: 100,
  style: {
    barColor: '#4caf50'
  }
}
```

### Q: Can I embed charts в cells?
**A:** Yes, use the `chart` cell тип:
```javascript
{
  field: 'chartData',
  caption: 'Trend',
  cellType: 'chart',
  chartSpec: {
    тип: 'line',
    data: { values: [] },
    xField: 'x',
    yField: 'y'
  }
}
```

## Events и Interaction

### Q: How do I handle cell clicks?
**A:** Use the `click_cell` event:
```javascript
table.на('click_cell', (args) => {
  console.log('Cell clicked:', args.col, args.row, args.значение);
});
```

### Q: How do I включить cell editing?
**A:** Set the `editor` property на columns:
```javascript
{
  field: 'name',
  caption: 'Name',
  editor: 'ввод'
}
```

### Q: How do I detect when cell values change?
**A:** Use the `change_cell_value` event:
```javascript
table.на('change_cell_value', (args) => {
  console.log('значение changed:', args.oldValue, '->', args.newValue);
});
```

## Data Handling

### Q: What data formats does VTable accept?
**A:** VTable accepts arrays из objects:
```javascript
const records = [
  { field1: 'value1', field2: 'value2' },
  { field1: 'value3', field2: 'value4' }
];
```

### Q: Can I load data от APIs?
**A:** Yes, load data asynchronously:
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    table.updateRecords(data);
  });
```

### Q: How do I sort data?
**A:** включить sorting на columns:
```javascript
{
  field: 'name',
  caption: 'Name',
  sort: true
}
```

или set initial sort state:
```javascript
const table = новый ListTable({
  // ... other options
  sortState: {
    field: 'name',
    order: 'asc'
  }
});
```

## PivotTable

### Q: When should I use PivotTable instead из ListTable?
**A:** Use PivotTable when you need к:
- Analyze multidimensional data
- Create cross-tabulations
- Perform data aggregation
- Build analytical reports

### Q: How do I create a pivot table?
**A:** Use the PivotTable class:
```javascript
import { PivotTable } от '@visactor/VTable';

const PivotTable = новый PivotTable({
  container: document.getElementById('container'),
  records: data,
  rows: ['region', 'category'],
  columns: ['quarter'],
  indicators: [{
    indicatorKey: 'sales',
    caption: 'Total Sales'
  }]
});
```

### Q: What aggregation functions are supported?
**A:** Built-в aggregations include:
- `SUM` - Sum из values
- `AVG` - Average из values
- `COUNT` - Count из records
- `MAX` - Maximum значение
- `MIN` - Minimum значение
- Custom functions

## Framework Integration

### Q: Can I use VTable с React?
**A:** Yes, here's a basic React component:
```javascript
import React, { useEffect, useRef } от 'react';
import { ListTable } от '@visactor/VTable';

функция VTableComponent({ data, columns }) {
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (containerRef.текущий) {
      tableRef.текущий = новый ListTable({
        container: containerRef.текущий,
        records: data,
        columns: columns
      });
    }

    возврат () => {
      if (tableRef.текущий) {
        tableRef.текущий.release();
      }
    };
  }, [data, columns]);

  возврат <div ref={containerRef} style={{ ширина: '100%', высота: '500px' }} />;
}
```

### Q: Does VTable work с Vue.js?
**A:** Yes, VTable works с Vue.js. See the [Vue Integration Guide](../integration/vue.md) для details.

### Q: Is there an Angular wrapper?
**A:** While there's no official Angular wrapper, Вы можете easily integrate VTable с Angular. See the [Angular Integration Guide](../integration/angular.md).

## Troubleshooting

### Q: The table doesn't appear. What could be wrong?
**A:** Check these common issues:
1. Container element exists и has dimensions
2. Data и columns are properly formatted
3. No JavaScript errors в console
4. VTable is properly imported

### Q: Table performance is poor. How can I optimize it?
**A:** Try these optimizations:
1. включить virtual scrolling
2. Use fixed row heights
3. Minimize complex style functions
4. Reduce the число из видимый columns
5. Consider data pagination

### Q: Cell editing doesn't work. What's wrong?
**A:** Ensure:
1. Column has `editor` property set
2. Cell is не в a frozen area (if there are issues)
3. Data is mutable
4. No conflicting event handlers

### Q: How do I handle memory leaks?
**A:** Always call `table.release()` when destroying tables:
```javascript
// в React useEffect cleanup
useEffect(() => {
  возврат () => {
    if (tableRef.текущий) {
      tableRef.текущий.release();
    }
  };
}, []);
```

### Q: Custom themes don't apply. What's the issue?
**A:** Ensure:
1. Theme is registered before table creation
2. Theme name matches exactly
3. Theme объект has correct structure
4. No typos в style property names

## Advanced Features

### Q: Can I freeze columns?
**A:** Yes, use frozen column options:
```javascript
const table = новый ListTable({
  // ... other options
  frozenColCount: 2, // Freeze первый 2 columns
  rightFrozenColCount: 1 // Freeze последний column
});
```

### Q: How do I implement custom cell renderers?
**A:** Use custom layout functions или chart specifications для complex rendering needs.

### Q: Can I export table data?
**A:** While VTable doesn't have built-в export, Вы можете access data via `table.records` и use libraries like `xlsx` или `csv-writer` к export.

### Q: How do I implement row selection?
**A:** Configure selection options:
```javascript
const table = новый ListTable({
  // ... other options
  выбрать: {
    mode: 'row', // 'cell', 'row', 'column'
    headerSelectMode: true
  }
});
```

### Q: Can I have nested headers?
**A:** Yes, PivotTable supports hierarchical headers through dimension configuration.

## Best Practices

### Q: What are the performance best practices?
**A:**
1. Use virtual scrolling для large datasets
2. Minimize complex styling functions
3. Use fixed row heights when possible
4. Implement proper cleanup в framework integrations
5. Consider data pagination для very large datasets

### Q: How should I structure my data?
**A:**
1. Use consistent field names
2. Ensure data types are appropriate
3. Handle null/undefined values
4. Normalize data structure before passing к VTable

### Q: What's the recommended way к handle real-time updates?
**A:**
1. Use WebSockets или Server-Sent Events для data updates
2. Update table data incrementally rather than replacing все data
3. Implement proper ошибка handling для connection issues
4. Consider update frequency к avoid performance issues

## Getting Help

### Q: Where can I find more examples?
**A:** Check out:
- [Interactive Examples](../../english-demo/index.html)
- [GitHub Repository Examples](https://github.com/VisActor/VTable/tree/main/packages/VTable/examples)
- [Official Documentation](https://visactor.io/VTable)

### Q: How do I report bugs?
**A:** Report bugs на the [GitHub Issues page](https://github.com/VisActor/VTable/issues) с:
- Clear description из the issue
- Steps к reproduce
- Expected vs actual behavior
- Code sample или demo if possible

### Q: Is there a community forum?
**A:** Вы можете:
- Ask questions в GitHub Discussions
- Join the VisActor community channels
- Follow updates на the official website

### Q: How do I contribute к VTable?
**A:** See the [Contributing Guide](https://github.com/VisActor/VTable/blob/main/CONTRIBUTING.md) для information на:
- Setting up the development environment
- Submitting pull requests
- Reporting issues
- Code style guidelines