# Master-Detail Plugin

## Overview

The MasterDetailPlugin provides powerful master-detail functionality for VTable ListTable, enabling the embedding of complete sub-tables within main table rows to achieve hierarchical data display effects. This plugin is particularly suitable for business scenarios requiring the display of associated detailed information, such as order details, project tasks, product specifications, and other complex data structure visualizations.

## Plugin Configuration

### Configuration Interface Definition

MasterDetailPlugin adopts TypeScript interface specifications to ensure type safety and development experience. The plugin constructor accepts a `MasterDetailPluginOptions` configuration object, defined as follows:

```typescript
interface MasterDetailPluginOptions {
  id?: string;
  /** Sub-table configuration options - supports static configuration object or dynamic configuration function */
  detailGridOptions?: DetailGridOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions);
}

interface DetailGridOptions extends VTable.ListTableConstructorOptions {
  /** Sub-table style configuration, including layout margins and size settings */
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}
```

### Core Parameter Details

| Parameter Name | Type | Default Value | Description |
|---------------|------|---------------|-------------|
| `id` | string | `master-detail-${timestamp}` | Global unique identifier for plugin instance, used to distinguish multiple plugin instances |
| `detailGridOptions` | DetailGridOptions \| Function | - | Sub-table configuration options, supports static object configuration or data-based dynamic configuration function |

#### DetailGridOptions Advanced Configuration

`DetailGridOptions` fully inherits all features of `VTable.ListTableConstructorOptions`, meaning sub-tables enjoy the same functionality and configuration capabilities as main tables:

**Core Configuration Items:**
- **columns**: Sub-table column definitions, supporting complete column configuration options
- **theme**: Theme style configuration, can be set independently from main table
- **defaultRowHeight**: Sub-table row height settings
- **sortState**: Sort state configuration
- **widthMode**: Width mode (standard, adaptive, autoWidth, etc.)
- **All advanced configuration options supported by ListTable**

#### Style Configuration Options

| Property Name | Data Type | Default Value | Configuration Description |
|--------------|-----------|---------------|---------------------------|
| `margin` | number \| number[] | 0 | Sub-table margin settings, supports flexible margin configuration:<br/>• **Single value**: `12` - uniform margins on all sides<br/>• **Two values**: `[12, 16]` - vertical and horizontal margins<br/>• **Four values**: `[12, 16, 12, 16]` - top, right, bottom, left independent settings |
| `height` | number | 300 | Sub-table container fixed height (unit: pixels), recommended to set reasonably based on business data volume |

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

**Step 3: Configure to VTable Instance**
```typescript
// Integrate plugin into table configuration
const tableOptions = {
  container: document.getElementById('tableContainer'),
  columns: [/* Main table column configuration */],
  records: [/* Main table data */],
  plugins: [masterDetailPlugin]  // Register plugin
};

// Create table instance
const tableInstance = new VTable.ListTable(tableOptions);
```

> **Tip**: Ensure main table data contains the `children` field to store sub-table data. If using grouping functionality, use the `detailData` field instead.

## Typical Business Scenario Examples

### Scenario 1: Enterprise Employee Management System

In enterprise human resource management, there is a need to display each employee's project participation in the employee list. The main table shows basic employee information (name, department, position, etc.), and clicking to expand displays all project details and work records for that employee.

```javascript livedemo template=vtable
function createEmployeeTable() {
  // Generate enterprise employee data
  function generateEmployeeData(count) {
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const positions = ['Junior Engineer', 'Senior Engineer', 'Senior Engineer', 'Tech Expert', 'Product Manager', 'Designer', 'Marketing Specialist', 'Sales Manager'];
    const projects = [
      { name: 'E-commerce Platform Refactor', type: 'Technical Project', status: 'In Progress' },
      { name: 'Mobile App Development', type: 'Product Project', status: 'Completed' },
      { name: 'Brand Promotion Campaign', type: 'Marketing Project', status: 'Planning' },
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
          'Role': j === 0 ? 'Project Lead' : (j === 1 ? 'Core Member' : 'Participant'),
          'Start Date': startDate.toLocaleDateString('en-US'),
          'End Date': endDate.toLocaleDateString('en-US'),
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
    detailGridOptions: {
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
                'Planning': '#fef3c7'
              };
              return colors[args.value] || '#f8f9fa';
            },
            textAlign: 'center'
          }
        },
        { 
          field: 'Role', 
          title: 'Role', 
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
          field: 'Start Date', 
          title: 'Start Date', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: 'End Date', 
          title: 'End Date', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: 'Workload', 
          title: 'Workload', 
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

  // Main table configuration
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
      title: 'Projects', 
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

**Business Requirements**: In a B2B customer relationship management system, sales personnel need to quickly grasp customer overviews and be able to view detailed historical orders, transaction amounts, and order status distribution for each customer.

**Solution**: The main table displays key customer information (customer name, industry, regional distribution, cumulative transactions), and when expanded, shows complete order history for that customer, including order details, product information, transaction amounts, and order status tracking.

```javascript livedemo template=vtable
function createCustomerTable() {
  // Generate customer order data
  function generateCustomerData(count) {
    const industries = ['Internet', 'Manufacturing', 'Finance', 'Education', 'Healthcare', 'Retail', 'Logistics', 'Real Estate'];
    const regions = ['North China', 'East China', 'South China', 'Central China', 'Northeast', 'Northwest', 'Southwest'];
    const orderStatuses = ['Pending Confirmation', 'In Production', 'Shipped', 'Completed', 'Cancelled'];
    const products = [
      { name: 'Enterprise Server', category: 'IT Equipment', unitPrice: 25000 },
      { name: 'Office Software License', category: 'Software Service', unitPrice: 8000 },
      { name: 'Network Security Device', category: 'IT Equipment', unitPrice: 15000 },
      { name: 'Cloud Service Subscription', category: 'Cloud Computing', unitPrice: 12000 },
      { name: 'Data Analytics Platform', category: 'Software Service', unitPrice: 30000 },
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
        'Customer Name': `${industry === 'Internet' ? 'Tech' : industry === 'Manufacturing' ? 'Manufacturing' : industry} Corp ${i}`,
        'Industry': industry,
        'Region': region,
        'Contact Person': `Contact ${i}`,
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
    detailGridOptions: {
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
          width: 120,
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
          width: 120,
          style: {
            bgColor: (args) => {
              const colors = {
                'Completed': '#d1fae5',
                'Shipped': '#dbeafe',
                'In Production': '#fef3c7',
                'Pending Confirmation': '#f3e8ff',
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

  // Main table configuration
  const columns = [
    { field: 'id', title: 'ID', width: 100, sort: true },
    { field: 'Customer ID', title: 'Customer ID', width: 120, sort: true },
    { field: 'Customer Name', title: 'Customer Name', width: 180, sort: true },
    { field: 'Industry', title: 'Industry', width: 120, sort: true },
    { field: 'Region', title: 'Region', width: 120, sort: true },
    { field: 'Contact Person', title: 'Contact Person', width: 120 },
    { field: 'Registration Date', title: 'Registration Date', width: 140, sort: true },
    { 
      field: 'Total Orders', 
      title: 'Total Orders', 
      width: 110,
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

## Advanced Features

### Basic Functionality Demo

The following is a simplified master-detail functionality demo that demonstrates the core working principles and basic configuration methods of the plugin:

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

  // Using static DetailGridOptions
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

  // Main table column definitions
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
        // Try to return a displayable string to avoid errors
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

### Advanced Feature: Dynamic Configuration

MasterDetailPlugin supports dynamic configuration based on data content and row position, enabling more flexible business logic handling:

**Application Scenarios**:
- Display different detail table structures based on different data types
- Set personalized style themes for specific rows
- Dynamically adjust detail table height and column configuration based on business rules

**Implementation Example**:

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailGridOptions: ({ data, bodyRowIndex }) => {
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

## Advanced Configuration

### Grouping Example

If you want to use grouping when using the registry table plugin, please only pass one parameter when configuring groupBy, otherwise the plugin will not be able to recognize it.

```javascript livedemo template=vtable
function createGroupTable() {
  // Mock data - Note that we use detailData instead of children here, because children is occupied by the grouping function
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

  // Create master-detail plugin - Use detailData field instead of default children
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-grouping-demo',
    detailGridOptions: {
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
    // Grouping configuration - children field is occupied by grouping function
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

## Technical Implementation Principles

MasterDetailPlugin adopts an efficient rendering strategy to implement master-detail functionality:

1. **ViewBox Positioning System**: The plugin performs precise positioning based on VTable's ViewBox mechanism, ensuring that the detail table can be accurately rendered at the specified position of the expanded row.

2. **Shared Canvas Rendering**: The detail table shares the same Canvas with the main table, avoiding performance overhead from multi-canvas switching while ensuring visual consistency.

3. **Dynamic Row Height Adjustment**: By intelligently adjusting the height of expanded rows while maintaining the original height of CellGroups in that row, it cleverly creates blank areas for rendering detail tables.

4. **Scroll Event Optimization**: The plugin automatically sets `scrollEventAlwaysTrigger` to `true`, ensuring that scroll events can still be triggered when the table scrolls to boundaries, implementing automatic scrolling effects for detail tables.

## Notes
- Please do not use the transpose function
- Please do not use tree and master-detail together

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)
