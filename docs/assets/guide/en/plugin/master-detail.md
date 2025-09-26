# Master-Detail Plugin

## Feature Introduction

The MasterDetailPlugin provides powerful master-detail table functionality for VTable ListTable, enabling embedding of complete sub-tables within master table rows for hierarchical data presentation. This plugin is particularly suitable for business scenarios requiring associated detailed information display, such as order details, project tasks, product specifications, and other complex data structure visualizations.

## Plugin Configuration

### Configuration Interface Definition

MasterDetailPlugin follows TypeScript interface specifications to ensure type safety and development experience. The plugin constructor accepts a `MasterDetailPluginOptions` configuration object, defined as follows:

```typescript
interface MasterDetailPluginOptions {
  id?: string;
  /** Whether to enable checkbox cascade functionality - controls checkbox linkage between master and detail tables, default is true */
  enableCheckboxCascade?: boolean;
  /** Detail table configuration - can be static configuration object or dynamic configuration function */
  detailTableOptions?: DetailTableOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailTableOptions);
}

interface DetailTableOptions extends VTable.ListTableConstructorOptions {
  /** Detail table style configuration, including layout margins and size settings */
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}
```

### Core Parameter Details

| Parameter Name | Type | Default Value | Description |
|----------------|------|---------------|-------------|
| `id` | string | `master-detail-${timestamp}` | Global unique identifier for the plugin instance, used to distinguish multiple plugin instances |
| `enableCheckboxCascade` | boolean | `true` | Whether to enable checkbox cascade functionality between master and detail tables. When enabled, checkbox selections in master table will automatically sync with corresponding detail tables and vice versa |
| `detailTableOptions` | DetailTableOptions \| Function | - | Detail table configuration options, supports static object configuration or dynamic configuration function based on data |

#### DetailTableOptions Advanced Configuration

`DetailTableOptions` fully inherits all features of `VTable.ListTableConstructorOptions`, meaning the detail grid enjoys the same functionality and configuration capabilities as the master table:

**Core Configuration Items:**
- **columns**: Detail grid column definitions, supports complete column configuration options
- **theme**: Theme style configuration, can be set independently from the master table
- **defaultRowHeight**: Detail grid row height settings
- **sortState**: Sort state configuration
- **widthMode**: Width mode (standard, adaptive, autoWidth, etc.)
- **All advanced configuration options supported by ListTable**

#### Style Configuration Options

| Property Name | Data Type | Default Value | Configuration Description |
|---------------|-----------|---------------|---------------------------|
| `margin` | number \| number[] | 0 | Detail grid margin settings, supports flexible margin configuration:<br/>• **Single value**: `12` - uniform margin on all sides<br/>• **Two values**: `[12, 16]` - vertical and horizontal margins<br/>• **Four values**: `[12, 16, 12, 16]` - independent settings for top, right, bottom, left |
| `height` | number | 300 | Fixed height of detail grid container (in pixels), recommended to be set reasonably based on business data volume |

## Quick Start

### Basic Integration Steps

Integrating MasterDetailPlugin into your project requires only three simple steps:

**Step 1: Import Plugin**
```typescript
import { MasterDetailPlugin } from '@visactor/vtable-plugins';
```

**Step 2: Create Plugin Instance**
```typescript
// Create master-detail plugin instance
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'master-detail-plugin',
  enableCheckboxCascade: true, // Enable checkbox cascade functionality (default: true)
  detailTableOptions: {
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

// To disable checkbox cascade functionality:
const masterDetailPluginWithoutCascade = new MasterDetailPlugin({
  id: 'master-detail-plugin-no-cascade',
  enableCheckboxCascade: false, // Disable checkbox cascade functionality
  detailTableOptions: {
    // ... same configuration as above
  }
});
```

**Step 3: Configure to VTable Instance**
```typescript
// Integrate plugin into table configuration
const tableOptions = {
  container: document.getElementById('tableContainer'),
  columns: [/* Master table column configuration */],
  records: [/* Master table data */],
  plugins: [masterDetailPlugin]  // Register plugin
};

// Create table instance
const tableInstance = new VTable.ListTable(tableOptions);
```

## Basic Functionality Demo

The following is a simplified master-detail functionality demonstration, showing the core working principles and basic configuration methods of the plugin:

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
            { task: `Subtask A-${i + 1}`, status: 'open' },
            { task: `Subtask B-${i + 1}`, status: 'done' }
          ]
        : undefined
  }));
}

function createTable() {
  const records = generateData(11);

  // Using static DetailTableOptions
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-static-3',
    detailTableOptions: {
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

  // Master table column definition
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
        // Try to return displayable string to avoid errors
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

### Dynamic Configuration

MasterDetailPlugin supports dynamic configuration based on data content and row position, enabling more flexible business logic handling:

**Application Scenarios:**
- Display different detail grid structures based on different data types
- Set personalized style themes for specific rows
- Dynamically adjust detail grid height and column configuration based on business rules

**Implementation Example:**

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailTableOptions: ({ data, bodyRowIndex }) => {
    if (bodyRowIndex === 0) {
      return {
        columns: [
          {
            field: 'project',
            title: 'Project Name',
            width: 180
          },
          {
            field: 'role',
            title: 'Project Role',
            width: 120
          },
          {
            field: 'startDate',
            title: 'Start Date',
            width: 100
          },
          {
            field: 'endDate',
            title: 'End Date',
            width: 100
          },
          {
            field: 'progress',
            title: 'Project Progress',
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
          title: 'Project Name',
          width: 180
        },
        {
          field: 'role',
          title: 'Project Role',
          width: 120
        },
        {
          field: 'startDate',
          title: 'Start Date',
          width: 100
        },
        {
          field: 'endDate',
          title: 'End Date',
          width: 100
        },
        {
          field: 'progress',
          title: 'Project Progress',
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

### Using with GroupBy Grouping

If you want to use grouping when using the registered table plugin, please pass only one parameter when configuring groupBy, otherwise the plugin will not be able to recognize it.

```javascript livedemo template=vtable
function createGroupTable() {
  // Mock data - note that detailData is used here instead of children, because children is occupied by the grouping function
  const mockData = [
    {
      'Order ID': 'CA-2015-103800',
      'Product Name': 'Message Book',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 21.78,
      Profit: 6.53,
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
    },
    {
      'Order ID': 'CA-2015-112326',
      'Product Name': 'Avery 508',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      Region: 'West',
      Sales: 15.55,
      Profit: 5.44,
    },
    {
      'Order ID': 'US-2015-108966',
      'Product Name': 'Think Chair',
      Category: 'Furniture',
      'Sub-Category': 'Chairs',
      Region: 'West',
      Sales: 1374.37,
      Profit: 206.15,
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
    detailTableOptions: {
      columns: [
        { field: 'Order ID', title: 'Order ID', width: 150 },
        { field: 'Product Name', title: 'Product Name', width: 200 },
        { field: 'Category', title: 'Category', width: 120 },
        { field: 'Sub-Category', title: 'Sub-Category', width: 120 },
        { field: 'Region', title: 'Region', width: 100 },
        { field: 'Sales', title: 'Sales', width: 100 },
        { field: 'Profit', title: 'Profit', width: 100 }
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
      groupBy: ['Category'],
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

### Lazy Loading Setup

MasterDetailPlugin supports lazy loading functionality, allowing dynamic asynchronous loading of sub-table data when users expand rows. This is very useful for handling large amounts of data or scenarios that require real-time data fetching from servers.


**Lazy Loading Workflow:**

1. **Data Identifier**: In the main table data, set the `children` attribute of the rows that need lazy loading to `true`
2. **Event Trigger Mechanism**: When the user clicks the expand icon, the VTable triggers the `TREE_HIERARCHY_STATE_CHANGE` event

**Core APIs:**
- Listen to event: `'TREE_HIERARCHY_STATE_CHANGE'`
- Show loading state: `tableInstance.setLoadingHierarchyState(col, row)`  
- Set child data: `plugin.setRecordChildren(detailData, col, row)`

**Implementation Method:**

```typescript
// Data structure example
const masterData = [
  {
    id: 1,
    name: "Zhang San Company", 
    amount: 15000,
    // Static sub-data - display directly
    children: [
      { productName: "Laptop", quantity: 2, price: 5000 },
      { productName: "Mouse", quantity: 5, price: 100 }
    ]
  },
  {
    id: 2,
    name: "Li Si Enterprise",
    amount: 25000,
    children: true // Lazy loading identifier - requires asynchronous data loading
  }
];

// Listen to expand/collapse events
tableInstance.on('tree_hierarchy_state_change', async (args) => {
  // Only handle expand operations with children === true (lazy loading identifier)
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && 
      args.originData?.children === true) {
    
    // Show loading state
    tableInstance.setLoadingHierarchyState(args.col, args.row);
    
    try {
      // Asynchronously fetch data
      const detailData = await fetchDataFromServer(args.originData.id);
      
      // Set child data and automatically expand
      plugin.setRecordChildren(detailData, args.col, args.row);
    } catch (error) {
      console.error('Failed to load detail data:', error);
    }
  }
});
```

**Technical Implementation Details:**

The plugin internally implements lazy loading support through the following mechanism: listening to the `TREE_HIERARCHY_STATE_CHANGE` event of the VTable to ensure the correct synchronization of the hierarchy state.

The following is a complete lazy loading example demonstrating how to implement product detail lazy loading in an order management system:

```javascript livedemo template=vtable
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading',
  positionType: VTable.TYPES.IconPosition.contentLeft,
  marginLeft: 0,
  marginRight: 4,
  visibleTime: 'always',
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});

function createLazyLoadTable() {
  // Master table data - including lazy loading identifiers
  const masterData = [
    {
      id: 1,
      orderNo: 'ORD001',
      customer: 'Zhang San Company',
      amount: 15000,
      status: 'Completed',
      date: '2024-01-15',
      // Static sub-table data - display directly
      children: [
        { productName: 'Laptop', quantity: 2, price: 5000, total: 10000 },
        { productName: 'Mouse', quantity: 5, price: 100, total: 500 }
      ]
    },
    {
      id: 2,
      orderNo: 'ORD002',
      customer: 'Li Si Enterprise',
      amount: 25000,
      status: 'Processing',
      date: '2024-01-16',
      children: true // Lazy loading identifier - requires asynchronous data loading
    },
    {
      id: 3,
      orderNo: 'ORD003',
      customer: 'Wang Wu Group',
      amount: 35000,
      status: 'Completed',
      date: '2024-01-17',
      children: true // Lazy loading identifier - requires asynchronous data loading
    },
    {
      id: 4,
      orderNo: 'ORD004',
      customer: 'Zhao Liu Limited',
      amount: 18000,
      status: 'Pending Shipment',
      date: '2024-01-18'
      // No children property means no sub-data, no expand icon displayed
    }
  ];

  // Mock asynchronous data fetching function
  async function mockFetchDetailData(orderId) {
    // Simulate network delay
    const delay = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Return different product detail data based on order ID
    const mockDetailData = {
      2: [
        { productName: 'Desktop', quantity: 1, price: 8000, total: 8000 },
        { productName: 'Monitor', quantity: 2, price: 2000, total: 4000 },
        { productName: 'Keyboard', quantity: 1, price: 200, total: 200 },
        { productName: 'USB Drive', quantity: 10, price: 50, total: 500 },
        { productName: 'Speaker', quantity: 1, price: 1200, total: 1200 }
      ],
      3: [
        { productName: 'Server', quantity: 2, price: 15000, total: 30000 },
        { productName: 'Network Equipment', quantity: 5, price: 1000, total: 5000 },
        { productName: 'Switch', quantity: 3, price: 800, total: 2400 }
      ]
    };
    
    return mockDetailData[orderId] || [
      { productName: 'Default Product', quantity: 1, price: 100, total: 100 }
    ];
  }

  // Create master-detail plugin
  const plugin = new VTablePlugins.MasterDetailPlugin({
    id: 'lazy-load-demo',
    enableCheckboxCascade: true,
    detailTableOptions: (params) => {
      const { data } = params;
      return {
        columns: [
          { field: 'productName', title: 'Product Name', width: 150 },
          { field: 'quantity', title: 'Quantity', width: 80 },
          { field: 'price', title: 'Price', width: 100 },
          { field: 'total', title: 'Total', width: 100 }
        ],
        records: data.children,
        style: {
          height: 200,
          margin: [10, 20, 10, 20]
        },
        theme: VTable.themes.BRIGHT
      };
    }
  });

  // Master table configuration
  const columns = [
    { field: 'orderNo', title: 'Order No.', width: 120 },
    { field: 'customer', title: 'Customer Name', width: 150 },
    { field: 'amount', title: 'Order Amount', width: 120 },
    { field: 'status', title: 'Status', width: 100 },
    { field: 'date', title: 'Order Date', width: 120 }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: masterData,
    widthMode: 'standard',
    allowFrozenColCount: 2,
    defaultRowHeight: 40,
    plugins: [plugin]
  };

  // Create table instance
  const tableInstance = new VTable.ListTable(option);

  const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(TREE_HIERARCHY_STATE_CHANGE, async (args) => {
    // Only handle expand operations with children === true (lazy loading identifier)
    if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && 
        args.originData?.children === true) {
      
      // Show loading state
      tableInstance.setLoadingHierarchyState(args.col, args.row);
      
      try {
        // Get order ID and load data asynchronously
        const orderId = args.originData.id;
        const detailData = await mockFetchDetailData(orderId);
        
        // Use plugin convenience method to set child data and expand
        plugin.setRecordChildren(detailData, args.col, args.row);
      } catch (error) {
        console.error('Failed to load detail data:', error);
      }
    }
  });
  
  return tableInstance;
}

createLazyLoadTable();
```

## Typical Business Scenario Examples

### Scenario 1: Enterprise Employee Management System

In enterprise human resource management, it's necessary to display each employee's project participation in the employee list. The master table shows basic employee information (name, department, position, etc.), and when expanded, shows all project details and work records that the employee participates in.

```javascript livedemo template=vtable
function createEmployeeTable() {
  // Generate enterprise employee data
  function generateEmployeeData(count) {
    const departments = ['Technology', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const positions = ['Junior Engineer', 'Middle Engineer', 'Senior Engineer', 'Tech Expert', 'Product Manager', 'Designer', 'Marketing Specialist', 'Sales Manager'];
    const projects = [
      { name: 'E-commerce Platform Refactoring', type: 'Technical Project', status: 'In Progress' },
      { name: 'Mobile App Development', type: 'Product Project', status: 'Completed' },
      { name: 'Brand Promotion Campaign', type: 'Marketing Project', status: 'Planned' },
      { name: 'User Experience Optimization', type: 'Design Project', status: 'In Progress' },
      { name: 'Data Platform Construction', type: 'Technical Project', status: 'Completed' },
      { name: 'Customer Relationship Management', type: 'Sales Project', status: 'In Progress' }
    ];
    
    const data = [];
    for (let i = 1; i <= count; i++) {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const joinDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const salary = Math.floor(Math.random() * 20000) + 8000; // 8000-28000
      
      // Generate 2-5 project participation records for each employee
      const employeeProjects = [];
      const projectCount = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < projectCount; j++) {
        const project = projects[Math.floor(Math.random() * projects.length)];
        const startDate = new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate.getTime() + (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000);
        const workload = Math.floor(Math.random() * 60) + 20; // 20%-80% workload
        
        employeeProjects.push({
          'Project Name': project.name,
          'Project Type': project.type,
          'Project Status': project.status,
          'Participation Role': j === 0 ? 'Project Lead' : (j === 1 ? 'Core Member' : 'Participant'),
          'Start Time': startDate.toLocaleDateString('en-US'),
          'End Time': endDate.toLocaleDateString('en-US'),
          'Workload': `${workload}%`
        });
      }
      
      data.push({
        id: i,
        'Employee ID': `EMP-${String(i).padStart(4, '0')}`,
        'Name': `Employee${i}`,
        'Department': department,
        'Position': position,
        'Join Date': joinDate.toLocaleDateString('en-US'),
        'Monthly Salary': `$${salary.toLocaleString()}`,
        'Project Count': projectCount,
        children: employeeProjects
      });
    }
    return data;
  }

  const employeeRecords = generateEmployeeData(50);

  // Create enterprise employee management master-detail plugin
  const employeeDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'employee-management-plugin',
    detailTableOptions: {
      columns: [
        { 
          field: 'Project Name', 
          title: 'Project Name', 
          width: 180,
          style: { fontWeight: 'bold' }
        },
        { 
          field: 'Project Type', 
          title: 'Project Type', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                'Technical Project': '#e6f7ff',
                'Product Project': '#f6ffed',
                'Design Project': '#fff1f0',
                'Marketing Project': '#f9f0ff',
                'Sales Project': '#fff7e6'
              };
              return colors[args.value] || '#f8f9fa';
            }
          }
        },
        { 
          field: 'Project Status', 
          title: 'Project Status', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                'In Progress': '#dbeafe',
                'Completed': '#d1fae5',
                'Planned': '#fef3c7'
              };
              return colors[args.value] || '#f8f9fa';
            },
            textAlign: 'center'
          }
        },
        { 
          field: 'Participation Role', 
          title: 'Participation Role', 
          width: 120,
          style: {
            color: (args) => {
              const colors = {
                'Project Lead': '#dc2626',
                'Core Member': '#059669',
                'Participant': '#7c3aed'
              };
              return colors[args.value] || '#374151';
            },
            fontWeight: 'bold'
          }
        },
        { 
          field: 'Start Time', 
          title: 'Start Time', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: 'End Time', 
          title: 'End Time', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: 'Workload', 
          title: 'Workload Ratio', 
          width: 100,
          style: { textAlign: 'center', fontWeight: 'bold' }
        }
      ],
      defaultRowHeight: 36,
      defaultHeaderRowHeight: 42,
      style: { 
        margin: [16, 20], 
        height: 220 
      },
      theme: VTable.themes.BRIGHT.extends({
        headerStyle: {
          bgColor: '#1e40af',
          color: '#ffffff'
        }
      })
    }
  });

  // Master table configuration
  const columns = [
    { field: 'id', title: 'ID', width: 100, sort: true },
    { field: 'Employee ID', title: 'Employee ID', width: 120 },
    { field: 'Name', title: 'Name', width: 100, sort: true },
    { field: 'Department', title: 'Department', width: 100, sort: true },
    { field: 'Position', title: 'Position', width: 120, sort: true },
    { field: 'Join Date', title: 'Join Date', width: 120, sort: true },
    { 
      field: 'Monthly Salary', 
      title: 'Monthly Salary', 
      width: 120,
      style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
    },
    { 
      field: 'Project Count', 
      title: 'Project Count', 
      width: 100,
      style: { textAlign: 'center', fontWeight: 'bold' }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: employeeRecords,
    widthMode: 'standard',
    theme: VTable.themes.BRIGHT,
    plugins: [employeeDetailPlugin]
  };

  return new VTable.ListTable(option);
}

createEmployeeTable();
```

### Scenario 2: B2B Customer Order Tracking System

**Business Requirements**: In B2B customer relationship management systems, sales personnel need to quickly grasp customer profiles and be able to view each customer's historical orders, transaction amounts, and order status distribution in detail.

**Solution**: The master table displays key customer information (customer name, industry, regional distribution, cumulative transactions), and when expanded shows the customer's complete order history, including order details, product information, transaction amounts, and order status tracking.

```javascript livedemo template=vtable
function createCustomerTable() {
  // Generate customer order data
  function generateCustomerData(count) {
    const industries = ['Internet', 'Manufacturing', 'Finance', 'Education', 'Healthcare', 'Retail', 'Logistics', 'Real Estate'];
    const regions = ['North', 'East', 'South', 'Central', 'Northeast', 'Northwest', 'Southwest'];
    const orderStatuses = ['Pending', 'In Production', 'Shipped', 'Completed', 'Cancelled'];
    const products = [
      { name: 'Enterprise Server', category: 'IT Equipment', unitPrice: 25000 },
      { name: 'Office Software License', category: 'Software Service', unitPrice: 8000 },
      { name: 'Network Security Device', category: 'IT Equipment', unitPrice: 15000 },
      { name: 'Cloud Service Subscription', category: 'Cloud Computing', unitPrice: 12000 },
      { name: 'Data Analysis Platform', category: 'Software Service', unitPrice: 30000 },
      { name: 'Mobile Office Equipment', category: 'IT Equipment', unitPrice: 5000 }
    ];
    
    const data = [];
    for (let i = 1; i <= count; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const registerDate = new Date(2019 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      // Generate 3-8 orders for each customer
      const customerOrders = [];
      const orderCount = Math.floor(Math.random() * 6) + 3;
      let totalAmount = 0;
      
      for (let j = 0; j < orderCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const orderAmount = product.unitPrice * quantity;
        const orderDate = new Date(2024, Math.floor(Math.random() * 9), Math.floor(Math.random() * 28) + 1);
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        totalAmount += orderAmount;
        
        customerOrders.push({
          'Order Number': `ORD-${i}-${String(j + 1).padStart(3, '0')}`,
          'Product Name': product.name,
          'Product Category': product.category,
          'Quantity': quantity,
          'Unit Price': `$${product.unitPrice.toLocaleString()}`,
          'Order Amount': `$${orderAmount.toLocaleString()}`,
          'Order Date': orderDate.toLocaleDateString('en-US'),
          'Order Status': status
        });
      }
      
      data.push({
        id: i,
        'Customer ID': `CUS-${String(i).padStart(4, '0')}`,
        'Customer Name': `${industry === 'Internet' ? 'Tech' : industry === 'Manufacturing' ? 'Mfg' : industry} Company ${i}`,
        'Industry': industry,
        'Region': region,
        'Contact Person': `Contact${i}`,
        'Registration Date': registerDate.toLocaleDateString('en-US'),
        'Total Orders': orderCount,
        'Total Amount': `$${totalAmount.toLocaleString()}`,
        children: customerOrders
      });
    }
    return data;
  }

  const customerRecords = generateCustomerData(40);

  // Create customer order management master-detail plugin
  const customerDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'customer-management-plugin',
    detailTableOptions: {
      columns: [
        { 
          field: 'Order Number', 
          title: 'Order Number', 
          width: 150,
          style: { fontFamily: 'monospace', fontWeight: 'bold' }
        },
        { 
          field: 'Product Name', 
          title: 'Product Name', 
          width: 160,
          style: { fontWeight: 'bold' }
        },
        { 
          field: 'Product Category', 
          title: 'Product Category', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                'IT Equipment': '#e6f7ff',
                'Software Service': '#f6ffed',
                'Cloud Computing': '#fff1f0'
              };
              return colors[args.value] || '#f8f9fa';
            }
          }
        },
        { 
          field: 'Quantity', 
          title: 'Quantity', 
          width: 80,
          style: { textAlign: 'center' }
        },
        { 
          field: 'Unit Price', 
          title: 'Unit Price', 
          width: 120,
          style: { textAlign: 'right', color: '#059669' }
        },
        { 
          field: 'Order Amount', 
          title: 'Order Amount', 
          width: 130,
          style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
        },
        { 
          field: 'Order Date', 
          title: 'Order Date', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: 'Order Status', 
          title: 'Order Status', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                'Completed': '#d1fae5',
                'Shipped': '#dbeafe',
                'In Production': '#fef3c7',
                'Pending': '#f3e8ff',
                'Cancelled': '#fee2e2'
              };
              return colors[args.value] || '#f8f9fa';
            },
            textAlign: 'center'
          }
        }
      ],
      defaultRowHeight: 38,
      defaultHeaderRowHeight: 44,
      style: { 
        margin: [18, 24], 
        height: 260 
      },
      theme: VTable.themes.BRIGHT.extends({
        headerStyle: {
          bgColor: '#7c2d12',
          color: '#ffffff'
        }
      })
    }
  });

  // Master table configuration
  const columns = [
    { field: 'id', title: 'ID', width: 100, sort: true },
    { field: 'Customer ID', title: 'Customer ID', width: 120, sort: true },
    { field: 'Customer Name', title: 'Customer Name', width: 180, sort: true },
    { field: 'Industry', title: 'Industry', width: 100, sort: true },
    { field: 'Region', title: 'Region', width: 100, sort: true },
    { field: 'Contact Person', title: 'Contact Person', width: 100 },
    { field: 'Registration Date', title: 'Registration Date', width: 120, sort: true },
    { 
      field: 'Total Orders', 
      title: 'Total Orders', 
      width: 100,
      style: { textAlign: 'center', fontWeight: 'bold' }
    },
    { 
      field: 'Total Amount', 
      title: 'Total Amount', 
      width: 140,
      style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: customerRecords,
    widthMode: 'standard',
    theme: VTable.themes.BRIGHT,
    plugins: [customerDetailPlugin]
  };

  return new VTable.ListTable(option);
}

createCustomerTable();
```

## Technical Implementation Principles

MasterDetailPlugin adopts efficient rendering strategies to implement master-detail functionality:

1. **ViewBox Positioning System**: The plugin is based on VTable's ViewBox mechanism for precise positioning, ensuring that detail grids can be accurately rendered at specified positions within expanded rows.

2. **Canvas Shared Rendering**: Detail grids share the same Canvas drawing surface with the master table, avoiding performance overhead from multi-canvas switching while ensuring visual consistency.

3. **Dynamic Row Height Adjustment**: By intelligently adjusting the height of expanded rows while keeping the original height of CellGroups in those rows unchanged, it cleverly creates blank areas for rendering detail grids.

4. **Scroll Event Optimization**: The plugin automatically sets `scrollEventAlwaysTrigger` to `true`, ensuring that scroll events can still be triggered when the table scrolls to boundaries, achieving automatic scrolling effects for detail grids.

## Notes
- Please do not use the transpose feature
- Please do not use tree and master-detail together

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)
