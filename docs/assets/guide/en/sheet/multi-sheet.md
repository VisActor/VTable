# Multi-Sheet Management

VTable-Sheet supports managing multiple sheets within a single instance, similar to Excel's workbook functionality. This chapter explains how to create, switch between, and manage multiple sheets.

## Creating Multiple Sheets

When initializing VTableSheet, you can define multiple sheets using the `sheets` configuration option:

```javascript live template=vtable
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showSheetTab: true, // Show sheet tabs at the bottom, recommended for multi-sheet usage
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sales Data',
      data: [
        ['Product', 'January', 'February', 'March'],
        ['Product A', 1200, 1500, 900],
        ['Product B', 950, 1100, 1300]
      ],
      active: true // Set as the active sheet
    },
    {
      sheetKey: 'sheet2',
      sheetTitle: 'Inventory Data',
      data: [
        ['Product', 'Quantity', 'Safety Stock'],
        ['Product A', 500, 200],
        ['Product B', 300, 150]
      ]
    }
  ]
});
```

## Switching Between Sheets

When multiple sheets are configured and the `showSheetTab` option is enabled, users can switch between different sheets by clicking on the sheet tabs at the bottom.

You can also programmatically switch between sheets:

```typescript
// Activate a sheet by its key
sheetInstance.activateSheet('sheet2');
```

## Dynamically Adding Sheets

You can dynamically add new sheets at runtime:

```typescript
const newSheet = sheetInstance.addSheet({
  sheetKey: 'sheet3',
  sheetTitle: 'New Sheet',
  columns: [
    { title: 'Name', width: 100 },
    { title: 'Value', width: 80 }
  ],
  data: [
    ['Item 1', 100],
    ['Item 2', 200]
  ]
});

// Activate the newly added sheet
sheetInstance.activateSheet('sheet3');
```

## Removing Sheets

You can remove sheets that are no longer needed:

```typescript
// Remove a sheet by its key
sheetInstance.removeSheet('sheet3');
```

## Getting Sheet Information

VTableSheet provides various methods to get information about sheets:

```typescript
// Get the currently active sheet
const activeSheet = sheetInstance.getActiveSheet();

// Get a specific sheet by its key
const sheet2 = sheetInstance.getSheetByKey('sheet2');

// Get all sheets
const allSheets = sheetInstance.getAllSheets();

// Get the total number of sheets
const sheetCount = sheetInstance.getSheetCount();
```

## Sheet Configuration Options

Each sheet can be independently configured with the following properties:

| Option | Type | Description |
|--------|------|-------------|
| sheetKey | string | Unique identifier for the sheet |
| sheetTitle | string | Name displayed on the tab |
| data | any[][] | Sheet data |
| columns | object[] | Column definitions |
| active | boolean | Whether this sheet is active |
| filter | boolean \| object | Whether to enable filtering |
| frozenRowCount | number | Number of frozen rows |
| frozenColCount | number | Number of frozen columns |
| showHeader | boolean | Whether to display the header |
| rowCount | number | Number of rows |
| columnCount | number | Number of columns |
| cellMerge | object[] | Cell merge settings |

## Sheet Operation Events
TODO
VTableSheet provides a series of events related to sheet operations:

```typescript
// Sheet change event
sheetInstance.on('sheetChange', (evt) => {
  console.log('Currently active sheet:', evt.sheet);
  console.log('Previously active sheet:', evt.prevSheet);
});

// Sheet add event
sheetInstance.on('sheetAdd', (evt) => {
  console.log('Newly added sheet:', evt.sheet);
});

// Sheet remove event
sheetInstance.on('sheetRemove', (evt) => {
  console.log('Removed sheet key:', evt.sheetKey);
});
```

## Sheet Style Customization

You can customize different styles for each sheet:

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      data: [...],
      // Custom style for this sheet
      style: {
        headerStyle: {
          bgColor: '#f0f0f0',
          fontWeight: 'bold'
        },
        bodyStyle: {
          bgColor: '#ffffff',
          fontSize: 14
        }
      }
    },
    {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      data: [...],
      // Different style for another sheet
      style: {
        headerStyle: {
          bgColor: '#e6f7ff',
          fontWeight: 'bold'
        },
        bodyStyle: {
          bgColor: '#f9f9f9',
          fontSize: 14
        }
      }
    }
  ]
});
```

## Practical Example

Here's a complete example with multiple sheets:

```javascript livedemo template=vtable
// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// Container
const container = document.getElementById(CONTAINER_ID);
// Create table instance
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
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
        ['Laptops', 1200, 1500, 1800, 2000, 6500],
        ['Smartphones', 2500, 2800, 3000, 3500, 11800],
        ['Tablets', 900, 950, 1100, 1300, 4250],
        ['Smartwatches', 500, 650, 800, 950, 2900],
      ],
      active: true,
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
        ['Laptops', 150, 50, 75, 'Normal'],
        ['Smartphones', 320, 100, 150, 'Sufficient'],
        ['Tablets', 80, 40, 60, 'Warning'],
        ['Smartwatches', 35, 30, 45, 'Low'],
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
        ['John Smith', 'Engineering', 'Engineer', '2022-01-15', 12000],
        ['Lisa Johnson', 'Marketing', 'Manager', '2020-06-20', 18000],
        ['Michael Brown', 'Engineering', 'Senior Engineer', '2021-03-10', 15000],
        ['Sarah Davis', 'HR', 'Specialist', '2022-09-01', 9000]
      ]
    }
  ]
});
window['sheetInstance'] = sheetInstance;
```

With these features, you can easily manage multiple sheets and build feature-rich spreadsheet applications.