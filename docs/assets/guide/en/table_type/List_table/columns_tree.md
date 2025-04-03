## Basic Table Header Grouping and Collapsing

In this tutorial, we will learn how to implement multi-level header grouping and collapsing in VTable using a tree structure to visualize complex header hierarchies.

---

## Use Cases

Header grouping and collapsing are suitable for the following scenarios:

- **Multidimensional Data Analysis**: Combine related fields into logical groups (e.g., "Sales Data" includes sub-columns like "Revenue" and "Profit").
- **Complex Data Structures**: Tables with explicit hierarchical relationships (e.g., "Region-Province-City" three-level structure).
- **Space Optimization**: Improve readability by collapsing non-critical columns.
- **Dynamic Interaction**: Allow users to expand/collapse specific groups on demand for flexible data exploration.

---

## Implementation Steps

### 1. Configure Multi-Level Header Structure

Define header hierarchies using nested structures in the `columns` configuration. Each group adds sub-columns via the `columns` field to form a tree relationship.

### 2. Enable Tree-Style Collapsing

Set `columnHierarchyType: 'grid-tree'` to enable interactive tree-style collapsing for headers.

### 3. Set Default Expansion Level

Specify the initial expansion level using `columnExpandLevel` (default: `1`, showing only the first-level groups).

---

## Example

```javascript livedemo template=vtable
const records = [
  { region: 'North', province: 'Province A', city: 'City 1', revenue: 1000, cost: 600 },
  { region: 'North', province: 'Province A', city: 'City 2', revenue: 1500, cost: 800 },
  { region: 'South', province: 'Province B', city: 'City 3', revenue: 2000, cost: 1100 }
];

const columns = [
  {
    title: 'Region',
    field: 'region',
    width: 150,
    columns: [
      {
        title: 'Province',
        field: 'province',
        width: 150,
        columns: [
          {
            title: 'City',
            field: 'city',
            width: 150
          }
        ]
      }
    ]
  },
  {
    title: 'Financial Metrics',
    field: 'metrics',
    width: 180,
    columns: [
      { title: 'Revenue', field: 'revenue', width: 150 },
      { title: 'Cost', field: 'cost', width: 150 }
    ]
  }
];

const option = {
  records,
  columns,
  columnHierarchyType: 'grid-tree', // Enable tree-style collapsing
  columnExpandLevel: 2, // Expand to the second level by default
  widthMode: 'standard',
  defaultRowHeight: 40
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

---

## Advanced Configuration

### Listen to Collapse Events

Capture user interactions and execute custom logic:

```javascript
tableInstance.on(VTable.ListTable.EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, args => {
  if (args.cellLocation === 'columnHeader') {
    console.log('Header state changed:', args);
  }
});
```

### Dynamically Update Header States

Programmatically control header expansion/collapse:

```javascript
// Toggle the expansion state of a specific column
tableInstance.toggleHierarchyState(col, row);
```

---

With these configurations, you can quickly implement structured multi-level headers with dynamic interactions, ideal for complex data analysis scenarios.
