# Master Detail Plugin

## Function Introduction

The MasterDetailPlugin provides master-detail functionality for ListTable, designed to achieve better display of different data. This plugin supports embedding sub-tables within table rows, providing a hierarchical data display experience.

### Notes
- Please do not use transpose functionality
- Please do not use tree and master-detail together
- When used with grouping functionality, custom data retrieval functions need to be configured

## Plugin Configuration

### MasterDetailPluginOptions

The plugin constructor accepts a configuration object that needs to implement the `MasterDetailPluginOptions` interface. The following is a complete description of the configuration parameters:

```typescript
interface MasterDetailPluginOptions {
  id?: string;
  /** Sub-table configuration - can be static configuration object or dynamic configuration function */
  detailGridOptions?: DetailGridOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions);
  /** Custom function to get detail data, defaults to record.children */
  getDetailData?: (record: unknown) => unknown[];
  /** Custom function to check if detail data exists, defaults to checking record.children */
  hasDetailData?: (record: unknown) => boolean;
}

interface DetailGridOptions extends VTable.ListTableConstructorOptions {
  // This style configures the width and margin of the expanded sub-table
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}
```

### Configuration Parameters

| Parameter Name | Type | Default | Description |
|---------|------|--------|------|
| `id` | string | `master-detail-${timestamp}` | Unique identifier for the plugin instance |
| `detailGridOptions` | DetailGridOptions \| Function | - | Sub-table configuration options, can be static object or dynamic function |
| `getDetailData` | Function | Uses `record.children` | Custom function to get detail data |
| `hasDetailData` | Function | Checks `record.children` | Custom function to check if detail data exists |

#### DetailGridOptions.style Configuration

This extend from ListTableConstructorOptions and can utilize the configuration of ListTableConstructorOptions.

| Parameter Name | Type | Default | Description |
|---------|------|--------|------|
| `margin` | number \| number[] | 0 | Sub-table margin, supports single value or array form |
| `height` | number | 300 | Fixed height of the sub-table |

## Usage

### Plugin Initialization

First, create a plugin instance and add it to VTable's plugin configuration:

```typescript
// Initialize plugin
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'master-detail-static-2',
  detailGridOptions: {
    columns: [
      { field: 'task', title: 'Task Name', width: 220 },
      { field: 'status', title: 'Status', width: 120 }
    ],
    defaultRowHeight: 30,
    defaultHeaderRowHeight: 30,
    style: { margin: 12, height: 160 },
    theme: VTable.themes.BRIGHT
  }
});
```

### Basic Usage Example

First ensure you use the MasterDetailPlugin, then it will check the user's configured record based on the configuration in hasDetailData to see if relevant sub-tables are configured. If hasDetailData and getDetailData are not configured, the default is children.

```javascript livedemo template=vtable
function generateData(count) {
  const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    rowNo: i + 1,
    name: `Name ${i + 1}`,
    department: depts[i % depts.length],
    score: Math.floor(Math.random() * 100),
    amount: Math.floor(Math.random() * 10000) / 100,
    children:
      i % 4 === 0
        ? [
            { task: `Sub-task A-${i + 1}`, status: 'open' },
            { task: `Sub-task B-${i + 1}`, status: 'done' }
          ]
        : undefined
  }));
}

function createTable() {
  const records = generateData(11);

  // Use static DetailGridOptions
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-static-3',
    detailGridOptions: {
      columns: [
        { field: 'task', title: 'Task Name', width: 220 },
        { field: 'status', title: 'Status', width: 120 }
      ],
      defaultRowHeight: 30,
      defaultHeaderRowHeight: 30,
      style: { margin: 12, height: 160 },
      theme: VTable.themes.BRIGHT
    }
  });

  // Main table column definition
  const columns = [
    { field: 'id', title: 'ID', width: 70, sort: true },
    { field: 'rowNo', title: '#', width: 60, headerType: 'text', cellType: 'text' },
    { field: 'name', title: 'Name', width: 140, sort: true },
    { field: 'department', title: 'Department', width: 140, sort: true },
    { field: 'score', title: 'Score', width: 100, sort: true },
    {
      field: 'amount',
      title: 'Amount',
      width: 120,
      sort: true,
      fieldFormat: (v) => {
        if (typeof v === 'number' && !isNaN(v)) {
          return `$${v.toFixed(2)}`;
        }
        // Try to return displayable string, avoid throwing errors
        return v === undefined || v === null ? '' : String(v);
      }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    autoFillWidth: true,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);

  return tableInstance;
}

createTable();
```

### Dynamic Configuration Example

Support using functions to dynamically configure sub-table options, can return different configurations based on row data and row index:

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailGridOptions: ({ data, bodyRowIndex }) => {
    if (bodyRowIndex === 0) {
      return {
        columns: [
          {
            field: 'project',
            title: '项目名称',
            width: 180
          },
          {
            field: 'role',
            title: '项目角色',
            width: 120
          },
          {
            field: 'startDate',
            title: '开始日期',
            width: 100
          },
          {
            field: 'endDate',
            title: '结束日期',
            width: 100
          },
          {
            field: 'progress',
            title: '项目进度',
            width: 100,
          }
        ],
        theme: VTable.themes.BRIGHT,
        style: {
          margin: 20,
          height: 300
        }
      };
    }
    return {
      columns: [
        {
          field: 'project',
          title: '项目名称',
          width: 180
        },
        {
          field: 'role',
          title: '项目角色',
          width: 120
        },
        {
          field: 'startDate',
          title: '开始日期',
          width: 100
        },
        {
          field: 'endDate',
          title: '结束日期',
          width: 100
        },
        {
          field: 'progress',
          title: '项目进度',
          width: 100,
        }
      ],
      theme: VTable.themes.DARK,
      style: {
        margin: 20,
        height: 300
      }
    };
  }
});
```

## Advanced Configuration

### Custom Data Retrieval

Through `getDetailData` and `hasDetailData` functions, you can customize how to retrieve and check detail data:

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  // Custom detail data retrieval
  getDetailData: (record) => {
    // Can get data from different fields
    return record.details || record.subItems || [];
  },
  
  // Custom check for detail data existence
  hasDetailData: (record) => {
    return Boolean(record.details && record.details.length > 0);
  },
  
  detailGridOptions: {
    // ... sub-table configuration
  }
});
```

When you want to use it with grouping that itself relies on children, please use hasDetailData and getDetailData to let the master-detail use different data sources. Because the implementation of this plugin includes inserting virtual rows at the end, you will see a blank row at the end in some cases, such as when compatible with grouping.

```javascript livedemo template=vtable
function createGroupTable() {
  // Mock data - note using detailData instead of children, because children is occupied by grouping function
  const mockData = [
    {
      'Order ID': 'CA-2015-103800',
      'Product Name': 'Message Book',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 21.78,
      Profit: 6.53,
      detailData: [
        { task: 'Sub-task 1-A', status: 'open', priority: 'high', assignee: 'Zhang San' },
        { task: 'Sub-task 1-B', status: 'done', priority: 'medium', assignee: 'Li Si' }
      ]
    },
    {
      'Order ID': 'CA-2015-167199',
      'Product Name': 'Granite Paper',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 15.98,
      Profit: 3.19
    },
    {
      'Order ID': 'CA-2015-118192',
      'Product Name': 'Xerox 1923',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 47.98,
      Profit: 7.19,
      detailData: [
        { task: 'Sub-task 2-A', status: 'progress', priority: 'high', assignee: 'Wang Wu' },
        { task: 'Sub-task 2-B', status: 'done', priority: 'low', assignee: 'Zhao Liu' }
      ]
    },
    {
      'Order ID': 'CA-2015-112326',
      'Product Name': 'Avery 508',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      Region: 'West',
      Sales: 15.55,
      Profit: 5.44,
      detailData: [
        { task: 'Sub-task 3-A', status: 'open', priority: 'medium', assignee: 'Zhang San' }
      ]
    },
    {
      'Order ID': 'US-2015-108966',
      'Product Name': 'Think Chair',
      Category: 'Furniture',
      'Sub-Category': 'Chairs',
      Region: 'West',
      Sales: 1374.37,
      Profit: 206.15,
      detailData: [
        { task: 'Sub-task 4-A', status: 'done', priority: 'high', assignee: 'Li Si' },
        { task: 'Sub-task 4-B', status: 'progress', priority: 'medium', assignee: 'Wang Wu' },
        { task: 'Sub-task 4-C', status: 'open', priority: 'low', assignee: 'Zhao Liu' }
      ]
    }
  ];

  const columns = [
    { field: 'Order ID', title: 'Order ID', width: 150 },
    { field: 'Product Name', title: 'Product Name', width: 200 },
    { field: 'Category', title: 'Category', width: 120 },
    { field: 'Sub-Category', title: 'Sub-Category', width: 120 },
    { field: 'Region', title: 'Region', width: 100 },
    { field: 'Sales', title: 'Sales', width: 100 },
    { field: 'Profit', title: 'Profit', width: 100 }
  ];

  // Create master-detail plugin - use detailData field instead of default children
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-grouping-demo',
    // Custom function to get detail data
    getDetailData: (record) => record.detailData || [],
    // Custom function to check if detail data exists
    hasDetailData: (record) => {
      const data = record.detailData;
      return Boolean(data && data.length > 0);
    },
    detailGridOptions: {
      columns: [
        { field: 'task', title: 'Task Name', width: 200 },
        { field: 'status', title: 'Status', width: 100 },
        { field: 'priority', title: 'Priority', width: 100 },
        { field: 'assignee', title: 'Assignee', width: 120 }
      ],
      defaultRowHeight: 32,
      defaultHeaderRowHeight: 36,
      style: { margin: 12, height: 150 },
      theme: VTable.themes.BRIGHT
    }
  });

  const option = {
    container: document.getElementById(CONTAINER_ID),
    records: mockData,
    columns,
    widthMode: 'standard',
    // Group configuration - children field is occupied by grouping function
    groupConfig: {
      groupBy: ['Category', 'Sub-Category'],
      titleFieldFormat: (record) => {
        return record.vtableMergeName + '(' + record.children.length + ')';
      },
      enableTreeStickCell: true
    },
    theme: VTable.themes.DEFAULT,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  
  return tableInstance;
}

createGroupTable();
```

### Theme and Style Customization

Sub-tables support full VTable theme configuration:

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  detailGridOptions: {
    columns: [/*...*/],
    // Apply custom theme
    theme: VTable.themes.DARK.extends({
      headerStyle: {
        bgColor: '#333',
        color: '#fff'
      },
      bodyStyle: {
        bgColor: '#222',
        color: '#ccc'
      }
    }),
    // Custom styles
    style: {
      margin: [10, 20, 10, 20], // top, right, bottom, left margins
      height: 250
    }
  }
});
```

## Best Practices

### 1. Performance Optimization

- For large amounts of data, it's recommended to use pagination with master-detail
- Set appropriate sub-table height to avoid excessive height affecting scroll performance
- When using dynamic configuration, avoid complex computation logic

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)