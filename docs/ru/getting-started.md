# Начало работы с VTable

Это руководство поможет вам начать работу с VTable, от установки до создания вашей первой интерактивной таблицы.

## Предварительные требования

- Node.js 14+ или современный браузер
- Базовые знания JavaScript/TypeScript
- HTML-элемент контейнера для таблицы

## Установка

### Установка через пакетный менеджер

```bash
# npm
npm install @visactor/vtable

# yarn
yarn add @visactor/vtable

# pnpm
pnpm add @visactor/vtable
```

### Установка через CDN

```html
<!-- Для продакшена -->
<script src="https://unpkg.com/@visactor/vtable@latest/build/index.min.js"></script>

<!-- Для разработки -->
<script src="https://unpkg.com/@visactor/vtable@latest/build/index.js"></script>
```

## Ваша первая таблица

### Настройка HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First VTable</title>
    <style>
        #tableContainer {
            width: 800px;
            height: 600px;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div id="tableContainer"></div>
    <script src="your-script.js"></script>
</body>
</html>
```

### JavaScript Implementation

```javascript
import * as VTable from '@visactor/vtable';

// Define your data
const records = [
    { id: 1, name: 'John Doe', department: 'Engineering', salary: 85000, status: 'Active' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 75000, status: 'Active' },
    { id: 3, name: 'Bob Johnson', department: 'Sales', salary: 65000, status: 'Inactive' },
    { id: 4, name: 'Alice Brown', department: 'HR', salary: 70000, status: 'Active' }
];

// Define columns
const columns = [
    {
        field: 'id',
        caption: 'ID',
        width: 80,
        style: {
            textAlign: 'center'
        }
    },
    {
        field: 'name',
        caption: 'Employee Name',
        width: 150,
        style: {
            fontWeight: 'bold'
        }
    },
    {
        field: 'department',
        caption: 'Department',
        width: 120
    },
    {
        field: 'salary',
        caption: 'Salary',
        width: 100,
        style: {
            textAlign: 'right'
        },
        format: (value) => '$' + value.toLocaleString()
    },
    {
        field: 'status',
        caption: 'Status',
        width: 100,
        style: {
            textAlign: 'center'
        }
    }
];

// Create the table
const table = new VTable.ListTable({
    container: document.getElementById('tableContainer'),
    columns: columns,
    records: records,
    autoFillWidth: true,
    hover: {
        highlightMode: 'row'
    }
});
```

## Core Concepts

### 1. Container Element
Every VTable needs a DOM container element:
```javascript
container: document.getElementById('tableContainer')
```

### 2. Data Records
Your data as an array of objects:
```javascript
const records = [
    { field1: 'value1', field2: 'value2' },
    // ... more records
];
```

### 3. Column Definitions
Define how each column should behave:
```javascript
const columns = [
    {
        field: 'fieldName',    // Data field
        caption: 'Display Name', // Header text
        width: 150,            // Column width
        style: { /* styling */ } // Custom styles
    }
];
```

## Basic Configuration Options

### Table Sizing
```javascript
const table = new VTable.ListTable({
    // ... other options
    width: 800,           // Fixed width
    height: 600,          // Fixed height
    autoFillWidth: true,  // Auto-fill container width
    autoFillHeight: true  // Auto-fill container height
});
```

### Row and Column Styling
```javascript
const table = new VTable.ListTable({
    // ... other options
    theme: 'DEFAULT',     // Built-in theme
    rowHeight: 40,        // Row height
    headerHeight: 50,     // Header row height
    alternateRowColor: '#f8f9fa' // Zebra striping
});
```

### Interactive Features
```javascript
const table = new VTable.ListTable({
    // ... other options
    sortState: {
        field: 'name',
        order: 'asc'
    },
    hover: {
        highlightMode: 'row'
    },
    select: {
        mode: 'cell'        // or 'row', 'column'
    }
});
```

## Common Patterns

### Loading Data from API
```javascript
async function loadTableData() {
    try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        const table = new VTable.ListTable({
            container: document.getElementById('tableContainer'),
            columns: columns,
            records: data.employees
        });
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}
```

### Dynamic Updates
```javascript
// Add new record
table.addRecord({ id: 5, name: 'New Employee', department: 'IT' });

// Update existing record
table.updateRecords([{ id: 1, name: 'Updated Name' }], [0]);

// Remove record
table.removeRecord(2); // Remove record at index 2
```

### Event Handling
```javascript
// Cell click event
table.on('click_cell', (event) => {
    console.log('Cell clicked:', event.col, event.row, event.value);
});

// Selection change
table.on('selected_cell', (event) => {
    console.log('Cell selected:', event.col, event.row);
});

// Data change
table.on('change_cell_value', (event) => {
    console.log('Value changed:', event.col, event.row, event.oldValue, event.newValue);
});
```

## Next Steps

Now that you have a basic table running, explore these topics:

1. **[Column Types](./core/columns.md)** - Different column types and configurations
2. **[Styling Guide](./core/styling.md)** - Custom themes and visual design
3. **[Interactive Features](./advanced/interactions.md)** - Sorting, filtering, editing
4. **[Performance Tips](./advanced/performance.md)** - Optimizing large datasets

## Troubleshooting

### Common Issues

**Table not showing:**
- Check if container element exists
- Verify container has dimensions (width/height)
- Check console for JavaScript errors

**Data not displaying:**
- Ensure field names in columns match data properties
- Check data format is array of objects
- Verify records are not empty

**Performance issues:**
- Consider virtual scrolling for large datasets
- Optimize column rendering
- Use appropriate data structures

### Getting Help

- Check the [FAQ](./faq.md)
- Browse [examples](./examples/)
- Search existing [GitHub issues](https://github.com/VisActor/VTable/issues)
- Create a new issue with minimal reproduction case