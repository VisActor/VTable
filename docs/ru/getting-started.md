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
npm install @visactor/VTable

# yarn
yarn add @visactor/VTable

# pnpm
pnpm add @visactor/VTable
```

### Установка через CDN

```html
<!-- Для продакшена -->
<script src="https://unpkg.com/@visactor/VTable@latest/build/index.min.js"></script>

<!-- Для разработки -->
<script src="https://unpkg.com/@visactor/VTable@latest/build/index.js"></script>
```

## Ваша первая таблица

### Настройка HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>My первый VTable</title>
    <style>
        #tableContainer {
            ширина: 800px;
            высота: 600px;
            отступ: 20px;
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
import * as VTable от '@visactor/VTable';

// Define your data
const records = [
    { id: 1, name: 'John Doe', department: 'Engineering', salary: 85000, status: 'активный' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 75000, status: 'активный' },
    { id: 3, name: 'Bob Johnson', department: 'Sales', salary: 65000, status: 'неактивный' },
    { id: 4, name: 'Alice Brown', department: 'HR', salary: 70000, status: 'активный' }
];

// Define columns
const columns = [
    {
        field: 'id',
        caption: 'ID',
        ширина: 80,
        style: {
            textAlign: 'центр'
        }
    },
    {
        field: 'name',
        caption: 'Employee Name',
        ширина: 150,
        style: {
            fontWeight: 'bold'
        }
    },
    {
        field: 'department',
        caption: 'Department',
        ширина: 120
    },
    {
        field: 'salary',
        caption: 'Salary',
        ширина: 100,
        style: {
            textAlign: 'право'
        },
        format: (значение) => '$' + значение.toLocaleString()
    },
    {
        field: 'status',
        caption: 'Status',
        ширина: 100,
        style: {
            textAlign: 'центр'
        }
    }
];

// Create the table
const table = новый VTable.ListTable({
    container: document.getElementById('tableContainer'),
    columns: columns,
    records: records,
    autoFillWidth: true,
    навести: {
        highlightMode: 'row'
    }
});
```

## Core Concepts

### 1. Container Element
каждый VTable needs a DOM container element:
```javascript
container: document.getElementById('tableContainer')
```

### 2. Data Records
Your data as an массив из objects:
```javascript
const records = [
    { field1: 'value1', field2: 'value2' },
    // ... more records
];
```

### 3. Column Definitions
Define how каждый column should behave:
```javascript
const columns = [
    {
        field: 'fieldName',    // Data field
        caption: 'Display Name', // Header текст
        ширина: 150,            // Column ширина
        style: { /* styling */ } // Custom styles
    }
];
```

## Basic Configuration Options

### Table Sizing
```javascript
const table = новый VTable.ListTable({
    // ... other options
    ширина: 800,           // Fixed ширина
    высота: 600,          // Fixed высота
    autoFillWidth: true,  // Auto-fill container ширина
    autoFillHeight: true  // Auto-fill container высота
});
```

### Row и Column Styling
```javascript
const table = новый VTable.ListTable({
    // ... other options
    theme: 'по умолчанию',     // Built-в theme
    rowHeight: 40,        // Row высота
    headerHeight: 50,     // Header row высота
    alternateRowColor: '#f8f9fa' // Zebra striping
});
```

### Interactive Features
```javascript
const table = новый VTable.ListTable({
    // ... other options
    sortState: {
        field: 'name',
        order: 'asc'
    },
    навести: {
        highlightMode: 'row'
    },
    выбрать: {
        mode: 'cell'        // или 'row', 'column'
    }
});
```

## Common Patterns

### загрузка Data от API
```javascript
async функция loadTableData() {
    try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        const table = новый VTable.ListTable({
            container: document.getElementById('tableContainer'),
            columns: columns,
            records: data.employees
        });
    } catch (ошибка) {
        console.ошибка('Failed к load data:', ошибка);
    }
}
```

### Dynamic Updates
```javascript
// Add новый record
table.addRecord({ id: 5, name: 'новый Employee', department: 'IT' });

// Update existing record
table.updateRecords([{ id: 1, name: 'Updated Name' }], [0]);

// Remove record
table.removeRecord(2); // Remove record в index 2
```

### Event Handling
```javascript
// Cell нажать event
table.на('click_cell', (event) => {
    console.log('Cell clicked:', event.col, event.row, event.значение);
});

// Selection change
table.на('selected_cell', (event) => {
    console.log('Cell selected:', event.col, event.row);
});

// Data change
table.на('change_cell_value', (event) => {
    console.log('значение changed:', event.col, event.row, event.oldValue, event.newValue);
});
```

## следующий Steps

Now that you have a basic table running, explore these topics:

1. **[Column Types](./core/columns.md)** - Different column types и configurations
2. **[Styling Guide](./core/styling.md)** - Custom themes и visual design
3. **[Interactive Features](./advanced/interactions.md)** - Sorting, filtering, editing
4. **[Performance Tips](./advanced/performance.md)** - Optimizing large datasets

## Troubleshooting

### Common Issues

**Table не showing:**
- Check if container element exists
- Verify container has dimensions (ширина/высота)
- Check console для JavaScript errors

**Data не displaying:**
- Ensure field names в columns match data properties
- Check data format is массив из objects
- Verify records are не empty

**Performance issues:**
- Consider virtual scrolling для large datasets
- Optimize column rendering
- Use appropriate data structures

### Getting Help

- Check the [FAQ](./faq.md)
- Browse [examples](./examples/)
- Search existing [GitHub issues](https://github.com/VisActor/VTable/issues)
- Create a новый issue с minimal reproduction case