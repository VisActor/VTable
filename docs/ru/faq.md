# ЧаВо - Часто задаваемые вопросы

## Установка и настройка

### В: Как установить VTable?
**О:** Вы можете установить VTable используя npm, yarn или pnpm:
```bash
npm install @visactor/vtable
yarn add @visactor/vtable
pnpm add @visactor/vtable
```

### В: Могу ли я использовать VTable с CDN?
**О:** Да, вы можете подключить VTable через CDN:
```html
<script src="https://unpkg.com/@visactor/vtable@latest/build/index.min.js"></script>
```

### В: Какие браузеры поддерживает VTable?
**О:** VTable поддерживает все современные браузеры, включая Chrome, Firefox, Safari и Edge. IE11 не поддерживается.

### В: Нужно ли подключать CSS файлы?
**О:** Нет, VTable основан на canvas и не требует отдельных CSS файлов. Вся стилизация обрабатывается через JavaScript API.

## Базовое использование

### В: Как создать простую таблицу?
**О:** Вот базовый пример:
```javascript
import { ListTable } from '@visactor/vtable';

const table = new ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'name', caption: 'Имя', width: 150 },
    { field: 'age', caption: 'Возраст', width: 80 }
  ],
  records: [
    { name: 'Иван', age: 30 },
    { name: 'Мария', age: 25 }
  ]
});
```

### Q: How do I update data in the table?
**A:** Use the `updateRecords` method:
```javascript
table.updateRecords(newData);
```

### Q: How do I add new rows?
**A:** Use `addRecord` or `addRecords`:
```javascript
table.addRecord({ name: 'Bob', age: 35 });
table.addRecords([{ name: 'Alice', age: 28 }, { name: 'Charlie', age: 32 }]);
```

## Performance

### Q: How many rows can VTable handle?
**A:** VTable can efficiently handle millions of rows using virtual scrolling. The exact number depends on your data complexity and hardware.

### Q: My table is slow with large datasets. What can I do?
**A:** 
1. Enable virtual scrolling: `scrollMode: 'virtual'`
2. Use fixed row heights: `defaultRowHeight: 40`
3. Minimize complex styling functions
4. Consider pagination for very large datasets

### Q: How do I enable virtual scrolling?
**A:** Set the `scrollMode` option:
```javascript
const table = new ListTable({
  // ... other options
  scrollMode: 'virtual'
});
```

## Styling and Themes

### Q: How do I change the table theme?
**A:** Use the `theme` option:
```javascript
const table = new ListTable({
  // ... other options
  theme: 'DARK' // 'DEFAULT', 'ARCO', 'BRIGHT', 'DARK', 'SIMPLIFY'
});
```

### Q: Can I create custom themes?
**A:** Yes, you can register custom themes:
```javascript
import { themes } from '@visactor/vtable';

const customTheme = {
  defaultStyle: {
    color: '#333',
    bgColor: '#fff',
    fontSize: 14
  },
  // ... more style definitions
};

themes.register('CUSTOM', customTheme);

const table = new ListTable({
  theme: 'CUSTOM'
});
```

### Q: How do I style individual cells?
**A:** Use style functions in column definitions:
```javascript
{
  field: 'status',
  caption: 'Status',
  style: {
    bgColor: (args) => {
      return args.dataValue === 'Active' ? '#d4edda' : '#f8d7da';
    }
  }
}
```

## Column Types

### Q: What column types are available?
**A:** VTable supports several column types:
- `text` - Regular text display
- `link` - Clickable links
- `image` - Image display
- `progressbar` - Progress bars
- `chart` - Embedded charts
- `checkbox` - Checkboxes

### Q: How do I create a progress bar column?
**A:** Set the `cellType` to `progressbar`:
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

### Q: Can I embed charts in cells?
**A:** Yes, use the `chart` cell type:
```javascript
{
  field: 'chartData',
  caption: 'Trend',
  cellType: 'chart',
  chartSpec: {
    type: 'line',
    data: { values: [] },
    xField: 'x',
    yField: 'y'
  }
}
```

## Events and Interaction

### Q: How do I handle cell clicks?
**A:** Use the `click_cell` event:
```javascript
table.on('click_cell', (args) => {
  console.log('Cell clicked:', args.col, args.row, args.value);
});
```

### Q: How do I enable cell editing?
**A:** Set the `editor` property on columns:
```javascript
{
  field: 'name',
  caption: 'Name',
  editor: 'input'
}
```

### Q: How do I detect when cell values change?
**A:** Use the `change_cell_value` event:
```javascript
table.on('change_cell_value', (args) => {
  console.log('Value changed:', args.oldValue, '->', args.newValue);
});
```

## Data Handling

### Q: What data formats does VTable accept?
**A:** VTable accepts arrays of objects:
```javascript
const records = [
  { field1: 'value1', field2: 'value2' },
  { field1: 'value3', field2: 'value4' }
];
```

### Q: Can I load data from APIs?
**A:** Yes, load data asynchronously:
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    table.updateRecords(data);
  });
```

### Q: How do I sort data?
**A:** Enable sorting on columns:
```javascript
{
  field: 'name',
  caption: 'Name',
  sort: true
}
```

Or set initial sort state:
```javascript
const table = new ListTable({
  // ... other options
  sortState: {
    field: 'name',
    order: 'asc'
  }
});
```

## PivotTable

### Q: When should I use PivotTable instead of ListTable?
**A:** Use PivotTable when you need to:
- Analyze multidimensional data
- Create cross-tabulations
- Perform data aggregation
- Build analytical reports

### Q: How do I create a pivot table?
**A:** Use the PivotTable class:
```javascript
import { PivotTable } from '@visactor/vtable';

const pivotTable = new PivotTable({
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
**A:** Built-in aggregations include:
- `SUM` - Sum of values
- `AVG` - Average of values
- `COUNT` - Count of records
- `MAX` - Maximum value
- `MIN` - Minimum value
- Custom functions

## Framework Integration

### Q: Can I use VTable with React?
**A:** Yes, here's a basic React component:
```javascript
import React, { useEffect, useRef } from 'react';
import { ListTable } from '@visactor/vtable';

function VTableComponent({ data, columns }) {
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      tableRef.current = new ListTable({
        container: containerRef.current,
        records: data,
        columns: columns
      });
    }

    return () => {
      if (tableRef.current) {
        tableRef.current.release();
      }
    };
  }, [data, columns]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
}
```

### Q: Does VTable work with Vue.js?
**A:** Yes, VTable works with Vue.js. See the [Vue Integration Guide](../integration/vue.md) for details.

### Q: Is there an Angular wrapper?
**A:** While there's no official Angular wrapper, you can easily integrate VTable with Angular. See the [Angular Integration Guide](../integration/angular.md).

## Troubleshooting

### Q: The table doesn't appear. What could be wrong?
**A:** Check these common issues:
1. Container element exists and has dimensions
2. Data and columns are properly formatted
3. No JavaScript errors in console
4. VTable is properly imported

### Q: Table performance is poor. How can I optimize it?
**A:** Try these optimizations:
1. Enable virtual scrolling
2. Use fixed row heights
3. Minimize complex style functions
4. Reduce the number of visible columns
5. Consider data pagination

### Q: Cell editing doesn't work. What's wrong?
**A:** Ensure:
1. Column has `editor` property set
2. Cell is not in a frozen area (if there are issues)
3. Data is mutable
4. No conflicting event handlers

### Q: How do I handle memory leaks?
**A:** Always call `table.release()` when destroying tables:
```javascript
// In React useEffect cleanup
useEffect(() => {
  return () => {
    if (tableRef.current) {
      tableRef.current.release();
    }
  };
}, []);
```

### Q: Custom themes don't apply. What's the issue?
**A:** Ensure:
1. Theme is registered before table creation
2. Theme name matches exactly
3. Theme object has correct structure
4. No typos in style property names

## Advanced Features

### Q: Can I freeze columns?
**A:** Yes, use frozen column options:
```javascript
const table = new ListTable({
  // ... other options
  frozenColCount: 2, // Freeze first 2 columns
  rightFrozenColCount: 1 // Freeze last column
});
```

### Q: How do I implement custom cell renderers?
**A:** Use custom layout functions or chart specifications for complex rendering needs.

### Q: Can I export table data?
**A:** While VTable doesn't have built-in export, you can access data via `table.records` and use libraries like `xlsx` or `csv-writer` to export.

### Q: How do I implement row selection?
**A:** Configure selection options:
```javascript
const table = new ListTable({
  // ... other options
  select: {
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
1. Use virtual scrolling for large datasets
2. Minimize complex styling functions
3. Use fixed row heights when possible
4. Implement proper cleanup in framework integrations
5. Consider data pagination for very large datasets

### Q: How should I structure my data?
**A:**
1. Use consistent field names
2. Ensure data types are appropriate
3. Handle null/undefined values
4. Normalize data structure before passing to VTable

### Q: What's the recommended way to handle real-time updates?
**A:**
1. Use WebSockets or Server-Sent Events for data updates
2. Update table data incrementally rather than replacing all data
3. Implement proper error handling for connection issues
4. Consider update frequency to avoid performance issues

## Getting Help

### Q: Where can I find more examples?
**A:** Check out:
- [Interactive Examples](../../english-demo/index.html)
- [GitHub Repository Examples](https://github.com/VisActor/VTable/tree/main/packages/vtable/examples)
- [Official Documentation](https://visactor.io/vtable)

### Q: How do I report bugs?
**A:** Report bugs on the [GitHub Issues page](https://github.com/VisActor/VTable/issues) with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Code sample or demo if possible

### Q: Is there a community forum?
**A:** You can:
- Ask questions in GitHub Discussions
- Join the VisActor community channels
- Follow updates on the official website

### Q: How do I contribute to VTable?
**A:** See the [Contributing Guide](https://github.com/VisActor/VTable/blob/main/CONTRIBUTING.md) for information on:
- Setting up the development environment
- Submitting pull requests
- Reporting issues
- Code style guidelines