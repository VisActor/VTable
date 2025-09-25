# Filter Plugin

VTable provides a powerful filter plugin that supports both value-based filtering and condition-based filtering modes, helping users quickly filter and search table data.

## Features

- **Value-based filtering**: Select data to display from all unique values in a column
- **Condition-based filtering**: Set filter conditions using operators (equals, greater than, contains, etc.)
- **Multiple operators**: Support filtering operations for different data types (text, numeric, boolean)
- **Column-level control**: Enable or disable filtering for specific columns
- **State persistence**: Support saving and restoring filter states
- **Smart icons**: Automatically display filter status icons

## Filter Plugin Configuration Options

`FilterPlugin` can be configured with the following parameters:

```typescript
export interface FilterOptions {
  /** Filter ID for unique identification */
  id?: string;
  /** Filter icon */
  filterIcon?: VTable.TYPES.ColumnIconOption;
  /** Active filter icon */
  filteringIcon?: VTable.TYPES.ColumnIconOption;
  /** Hook function to determine if filtering is enabled for a column */
  enableFilter?: (field: number | string, column: VTable.TYPES.ColumnDefine) => boolean;
  /** Default enabled state when enableFilter is not defined */
  defaultEnabled?: boolean;
  /** Filter modes: value-based filtering, condition-based filtering */
  filterModes?: FilterMode[];
}
```

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | string | `filter-${Date.now()}` | Plugin instance unique identifier |
| `filterIcon` | ColumnIconOption | Default filter icon | Filter icon for inactive state |
| `filteringIcon` | ColumnIconOption | Default active icon | Filter icon for active state |
| `enableFilter` | function | - | Custom column filter enable logic |
| `defaultEnabled` | boolean | true | Default filter enabled state |
| `filterModes` | FilterMode[] | ['byValue', 'byCondition'] | Supported filter modes |

### Filter Operators

The plugin supports the following filter operators:

**General Operators**
- `equals` - Equals
- `notEquals` - Not equals

**Numeric Operators**
- `greaterThan` - Greater than
- `lessThan` - Less than
- `greaterThanOrEqual` - Greater than or equal
- `lessThanOrEqual` - Less than or equal
- `between` - Between
- `notBetween` - Not between

**Text Operators**
- `contains` - Contains
- `notContains` - Does not contain
- `startsWith` - Starts with
- `notStartsWith` - Does not start with
- `endsWith` - Ends with
- `notEndsWith` - Does not end with

**Boolean Operators**
- `isChecked` - Is checked
- `isUnchecked` - Is unchecked

## Usage Examples

### Basic Usage

```javascript
import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '@visactor/vtable-plugins';

// Create filter plugin
const filterPlugin = new FilterPlugin({});

// Create table configuration
const option = {
  records: data,
  columns: [
    { field: 'name', title: 'Name', width: 120 },
    { field: 'age', title: 'Age', width: 100 },
    { field: 'department', title: 'Department', width: 150 },
    { field: 'salary', title: 'Salary', width: 120 }
  ],
  plugins: [filterPlugin]
};

// Create table instance
const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

### Advanced Configuration

```javascript
// Custom filter enable logic
const filterPlugin = new FilterPlugin({
  // Customize which columns enable filtering
  enableFilter: (field, column) => {
    // ID column does not enable filtering
    return field !== 'id' && column.title;
  },

  // Only enable value-based filtering
  filterModes: ['byValue'],

  // Custom icons
  filterIcon: {
    name: 'custom-filter',
    type: 'svg',
    width: 16,
    height: 16,
    svg: '<svg>...</svg>'
  }
});
```

### Column-level Filter Control

```javascript
const columns = [
  { field: 'name', title: 'Name', width: 120 }, // Default enable filtering
  { field: 'age', title: 'Age', width: 100, filter: false }, // Disable filtering
  { field: 'department', title: 'Department', width: 150 }, // Default enable filtering
];
```

### State Persistence

```javascript
// Get current filter state
const filterState = filterPlugin.getFilterState();

// Save to local storage
localStorage.setItem('tableFilterState', JSON.stringify(filterState));

// Restore from local storage
const savedState = JSON.parse(localStorage.getItem('tableFilterState'));
if (savedState) {
  filterPlugin.setFilterState(savedState);
}
```

## Complete Example

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// When using, you need to import the plugin package @visactor/vtable-plugins
// import { FilterPlugin } from '@visactor/vtable-plugins';
// Normal usage: const filterPlugin = new FilterPlugin({});
// In the website editor, VTable.plugins is renamed to VTablePlugins

const generateDemoData = (count) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses = ['Active', 'On Leave', 'Inactive'];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    age: 22 + Math.floor(Math.random() * 20),
    department: departments[i % departments.length],
    salary: 5000 + Math.floor(Math.random() * 15000),
    status: statuses[i % statuses.length],
    isFullTime: i % 3 !== 0
  }));
};

const filterPlugin = new VTablePlugins.FilterPlugin({
  filterModes: ['byValue', 'byCondition']
});

const option = {
  records: generateDemoData(50),
  columns: [
    { field: 'id', title: 'ID', width: 60 },
    { field: 'name', title: 'Name', width: 120 },
    { field: 'age', title: 'Age', width: 100 },
    { field: 'department', title: 'Department', width: 120 },
    { field: 'salary', title: 'Salary', width: 120,
      fieldFormat: (record) => '$' + record.salary },
    { field: 'status', title: 'Status', width: 100 },
    { field: 'isFullTime', title: 'Full Time', width: 80, cellType: 'checkbox' }
  ],
  plugins: [filterPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## Usage Instructions

1. **Click filter icon**: Click the filter icon on the right side of the column header to open the filter panel
2. **Value-based filtering**: Select values to display in the filter panel
3. **Condition-based filtering**: Select operators and input filter conditions
4. **Apply filter**: Click the "Confirm" button to apply filter conditions
5. **Clear filter**: Click the "Clear Filter" link to remove filters for the current column

## Notes

- The filter plugin currently only supports `ListTable`, not `PivotTable`
- When using column-level filter control, you need to add the `filter` property to column definitions
- Filter states are automatically synchronized when table configuration is updated
- It is recommended to enable filtering for large data tables to improve user experience

# This plugin was contributed by 

[PoorShawn](https://github.com/PoorShawn)
