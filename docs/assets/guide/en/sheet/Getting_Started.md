# Getting Started

This chapter introduces how to quickly get started with the VTable-Sheet component, including installation, basic configuration, and creating your first spreadsheet.

## Installation

Install the VTable-Sheet component using npm or yarn:

```bash
# Using npm
npm install @visactor/vtable-sheet

# Using yarn
yarn add @visactor/vtable-sheet
```

## Basic Usage

### Importing the Component

```typescript
// ES module import
import { VTableSheet } from '@visactor/vtable-sheet';

// Or using CommonJS
const { VTableSheet } = require('@visactor/vtable-sheet');
```


### cdn import

If only the vtable-sheet umd package is imported, the underlying vrender environment restriction cannot work properly! ! !

Both the vrender and vtable umd packages need to be imported.

The vtable umd package cannot also use the unpkg platform, the user needs to fork the vtable source code first, and then package a vtable umd package themselves! ! !

Before packaging, it is necessary to release the commented code about vrender in the [packaging configuration](https://github.com/VisActor/VTable/blob/develop/packages/vtable/bundler.config.js). Run the command `cd packages/vtable && rushx build` to get the vtable.js file in the dist directory.
<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/sheet-build-umd.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>
The specific reference method is as follows:

```html
<script src="https://unpkg.com/@visactor/vrender@latest/dist/index.js"></script>
<script src="vtable.js"></script>
<script src="https://unpkg.com/@visactor/vtable-sheet@latest/dist/vtable-sheet.js"></script>
```
If you also need to import the umd package of the `vtable-plugins` plugin package, you can add:

```html
<script src="https://unpkg.com/@visactor/vrender@latest/dist/index.js"></script>
<script src="vtable.js"></script>
<script src="https://unpkg.com/@visactor/vtable-plugins@latest/dist/vtable-plugins.js"></script>
<script src="https://unpkg.com/@visactor/vtable-sheet@latest/dist/vtable-sheet.js"></script>
```

### Creating a Basic Table

Here's an example of creating a simple table:

```typescript
// Create a table instance
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showFormulaBar: true,  // Show formula bar
  showSheetTab: true,    // Show sheet tabs at the bottom
  defaultRowHeight: 25,  // Default row height
  defaultColWidth: 100,  // Default column width
  sheets: [
    {
      sheetKey: 'sheet1',   // Unique sheet identifier
      sheetTitle: 'Sheet 1',  // Display name for the sheet
      columns: [            // Column definitions
        { title: 'Name', width: 100 },
        { title: 'Age', width: 80 },
        { title: 'Department', width: 120 }
      ],
      data: [               // Table data
        ['John', 28, 'Engineering'],
        ['Lisa', 32, 'Marketing'],
        ['Mike', 25, 'HR']
      ],
      active: true          // Set as the currently active sheet
    }
  ]
});
```

## Configuration Options

The VTableSheet component supports a rich set of configuration options:

### Top-level Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| showFormulaBar | boolean | false | Whether to display the formula bar |
| showSheetTab | boolean | false | Whether to display sheet tabs at the bottom |
| defaultRowHeight | number | 25 | Default row height |
| defaultColWidth | number | 100 | Default column width |
| sheets | ISheetDefine[] | [] | Array of sheet definitions |
| theme | ITheme | - | Table theme configuration |
| VTablePluginModules | Array | [] | Plugin module configuration. You can configure VTable-supported plugins for VTableSheet or disable some built-in plugins. For plugin configuration options, refer to [VTable-Plugins](../plugin/usage) |
| mainMenu | IMainMenu | - | Main menu configuration |

### Worksheet Configuration (ISheetDefine)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| sheetKey | string | - | Unique worksheet identifier |
| sheetTitle | string | - | Display name for the worksheet |
| columns | IColumnDefine[] | [] | Column definition array. If columns are not configured, the actual titles are in the data. You can use firstRowAsHeader to use the first row as the header. If you don't want the first row as the header, you can set showHeader to false. |
| data | any[][] | [] | Table data, currently only supports two-dimensional arrays, not JSON format data |
| active | boolean | false | Whether this is the currently active worksheet |
| showHeader | boolean | true | Whether to display the header |
| firstRowAsHeader | boolean | false | Whether to use the first row as the header |
| filter | boolean \| object | false | Whether to enable filtering |
| columnCount | number | - | Number of columns (used when columns are not specified) |
| rowCount | number | - | Number of rows |
| frozenRowCount | number | 0 | Number of frozen rows |
| frozenColCount | number | 0 | Number of frozen columns |
| cellMerge | ICellMerge[] | [] | Cell merge configuration |

**Note:**

**The columns field is optional. When columns are set, the table will use them as the header with all the features of a VTable header.**

**If columns are not set or are an empty array, the table will have an empty header row. If you don't want to show this empty header, set showHeader to false, and only the data will be displayed as the table body.**

**If you want to use the first row of data as the header, you can set firstRowAsHeader. You can also use the setFirstRowAsHeader method.**

## Instance Methods

The VTableSheet instance provides the following common methods:

| Method | Parameters | Return Value | Description |
|--------|------------|--------------|-------------|
| getActiveSheet | - | WorkSheet | Get the currently active worksheet |
| getSheetByKey | sheetKey: string | WorkSheet | Get a worksheet by its key |
| addSheet | sheetDefine: ISheetDefine | WorkSheet | Add a new worksheet |
| removeSheet | sheetKey: string | boolean | Remove the specified worksheet |
| getFilterManager | - | FilterManager | Get the filter manager |
| getFormulaManager | - | FormulaManager | Get the formula manager |
| saveToConfig | - | IVTableSheetOptions | Save the current state as a configuration object |
| exportSheetToFile | fileType: 'csv' \| 'xlsx' | void | Export the current worksheet to a file |
| importFileToSheet | - | void | Import a file to the current worksheet |
| release | - | void | Destroy the table instance |

## Simple Example

Below is a complete HTML example showing how to create and use the VTable-Sheet component:

```javascript livedemo template=vtable
// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// Container
const container = document.getElementById(CONTAINER_ID);
// Create table instance
const sheet = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "Employee Information",
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Age', width: 80 },
        { title: 'Department', width: 120 }
      ],
      data: [
        ['John', 28, 'Engineering'],
        ['Lisa', 32, 'Marketing'],
        ['Mike', 25, 'Engineering']
      ],
      active: true
    }
  ]
}); 
window.sheetInstance = sheet;
```

This basic example shows how to create a simple table. In subsequent chapters, we will delve into more advanced features and how to use them.