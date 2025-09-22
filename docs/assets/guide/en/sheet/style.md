# VTable-Sheet Style Configuration Guide

VTable-Sheet provides a rich set of style configuration options, allowing you to customize the appearance of your tables according to your needs. This guide will detail how to adjust table styles through the `theme` configuration.

## Theme Configuration Entry

In VTable-Sheet, styles can be configured through the global `theme` property, or through the `theme` property of each `sheet`.

If both global and sheet-specific `theme` properties are configured, the sheet's `theme` takes precedence.

Here is a basic theme configuration example:

```typescript
const options = {
  // Other configurations...
  theme: {
    rowSeriesNumberCellStyle: {
      // Row number cell style
    },
    colSeriesNumberCellStyle: {
      // Column number cell style
    },
    menuStyle: {
      // Menu style
    },
    tableTheme: {
      // Table theme
    }
  }
};
```

## Detailed Theme Configuration

### Row and Column Number Cell Styles

You can customize the styles of row and column numbers using `rowSeriesNumberCellStyle` and `colSeriesNumberCellStyle`:

```typescript
theme: {
  rowSeriesNumberCellStyle: {
    bgColor: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#333333',
    textAlign: 'center',
    textBaseline: 'middle'
  },
  colSeriesNumberCellStyle: {
    bgColor: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#333333',
    textAlign: 'center',
    textBaseline: 'middle'
  }
}
```

### Menu Style Configuration

The `menuStyle` property is used to configure the styles of table-related menus (to be implemented!):

```typescript
theme: {
  menuStyle: {
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#333333',
    padding: [8, 16, 8, 16], // top, right, bottom, left padding
    bgColor: '#ffffff'
  }
}
```

### Table Theme Configuration

`tableTheme` is the style configuration for the table area of VTable-Sheet, which corresponds directly to VTable's theme system. For details, refer to: [VTable Theme Configuration](../theme_and_style/theme).

Note that the `frameStyle` in `tableTheme` will be automatically ignored.

Built-in themes in VTable such as ARCO, DARK ARCO, etc., are also applicable.

## Custom Theme Example

Below is a complete theme configuration example, showing how to create a custom VTable-Sheet theme:

```javascript livedemo template=vtable

// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// import { VTable } from '@visactor/vtable-gantt';
// Container
const container = document.getElementById(CONTAINER_ID);
// Create table instance
const sheet = new VTableSheet.VTableSheet(container, {
  sheets: [
    // Sales data sheet
    {
      sheetKey: 'sales',
      sheetTitle: 'Sales Data',
      columns: [
        { title: 'Product', width: 120 },
        { title: 'Q1', width: 100 },
        { title: 'Q2', width: 100 },
        { title: 'Q3', width: 100 },
        { title: 'Q4', width: 100 },
        { title: 'Total', width: 100 }
      ],
      data: [
        ['Laptop', 1200, 1500, 1800, 2000, 6500],
        ['Smartphone', 2500, 2800, 3000, 3500, 11800],
        ['Tablet', 900, 950, 1100, 1300, 4250],
        ['Smartwatch', 500, 650, 800, 950, 2900],
      ],
      active: true,
      theme: {
        tableTheme: VTableSheet.TYPES.VTableThemes.ARCO.extends({
          bodyStyle: {
            color: 'red'
          }
        })
      },
      frozenRowCount: 1,
      frozenColCount: 1
    },
    
    // Inventory data sheet
    {
      sheetKey: 'inventory',
      sheetTitle: 'Inventory Data',
      columns: [
        { title: 'Product', width: 120 },
        { title: 'Quantity', width: 100 },
        { title: 'Safety Stock', width: 100 },
        { title: 'Reorder Point', width: 100 },
        { title: 'Status', width: 100 }
      ],
      data: [
        ['Laptop', 150, 50, 75, 'Normal'],
        ['Smartphone', 320, 100, 150, 'Sufficient'],
        ['Tablet', 80, 40, 60, 'Warning'],
        ['Smartwatch', 35, 30, 45, 'Low'],
      ]
    },
    
    // Employee data sheet
    {
      sheetKey: 'employees',
      sheetTitle: 'Employee Data',
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Department', width: 120 },
        { title: 'Position', width: 120 },
        { title: 'Hire Date', width: 120 },
        { title: 'Salary', width: 100 }
      ],
      data: [
        ['John', 'Engineering', 'Engineer', '2022-01-15', 12000],
        ['Lisa', 'Marketing', 'Manager', '2020-06-20', 18000],
        ['Michael', 'Engineering', 'Senior Engineer', '2021-03-10', 15000],
        ['Sarah', 'HR', 'Specialist', '2022-09-01', 9000]
      ],
      theme: {
        tableTheme: VTableSheet.TYPES.VTableThemes.BRIGHT
      }
    }
  ],
  theme: {
    // Row number cell style
    rowSeriesNumberCellStyle: {
      bgColor: '#f0f0f0',
      color: '#666666',
      fontSize: 12,
      textAlign: 'center'
    },
    
    // Column number cell style
    colSeriesNumberCellStyle: {
      bgColor: '#f0f0f0',
      color: '#666666',
      fontSize: 12,
      textAlign: 'center'
    },
    
    // Menu style
    menuStyle: {
      fontFamily: 'Arial',
      fontSize: 13,
      color: '#333333',
      padding: [10, 15, 10, 15],
      bgColor: '#ffffff'
    },
    
    // Table theme
    tableTheme: {
      bgColor: '#ffffff',
      color: '#333333',
      fontFamily: 'Arial',
      fontSize: 13,
      
      // Header style
      headerStyle: {
        bgColor: '#e6f7ff',
        color: '#0066cc',
        fontSize: 14,
        fontWeight: 'bold'
      },
      
      // Border style
      borderLineWidth: 1,
      borderColor: '#d9d9d9',
      
      // Alternating row colors
      underlayBackgroundColor: 'transparent',
      stripeRowBackgroundColor: '#fafafa',
      
      // Selected cell style
      selectionStyle: {
        cellBorderLineWidth: 2,
        cellBorderColor: '#1890ff'
      },
      
      // Hover style
      hoverStyle: {
        rowBgColor: '#e6f7ff'
      }
    }
  }
});
window['sheetInstance'] = sheet;
```

With the above configuration, you can fully control the visual presentation of VTable-Sheet, creating table interfaces that match your application's design style.