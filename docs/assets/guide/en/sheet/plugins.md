# Plugin Functionality

VTable-Sheet currently uses several VTable plugins, including:
- [filter-plugin](../plugin/filter) Filter plugin
- [auto-fill-plugin](../plugin/auto-fill) Auto-fill plugin
- [table-series-number-plugin](../plugin/table-series-number) Table number plugin
- [highlight-header-when-select-cell-plugin](../plugin/header-highlight) Header highlight plugin
- [context-menu-plugin](../plugin/context-menu) Right-click menu plugin
- [table-export-plugin](../plugin/table-export) Table export plugin
- [excel-import-plugin](../plugin/excel-import) Table import plugin

The principle is that each sheet is a VTable instance, so you can use plugins just like with VTable.

Because of this, plugins can only work on individual sheets, not on the entire VTableSheet. For capabilities like import and export, importing an Excel file can only import into the current sheet, rather than importing all sheets from the file into VTableSheet, and exporting can only export the current sheet.

**In the future, VTableSheet will provide plugin extension capabilities, without being limited to individual sheets. We also hope that you can contribute plugins to enrich VTableSheet's functionality.**

## Configuring Plugins

In addition to the built-in plugins mentioned above, VTableSheet also supports users configuring plugins through VTablePluginModules to extend VTableSheet's table plugin functionality.

Before referencing plugins, make sure that @visactor/vtable-plugins and VTableSheet are using the same version, otherwise the plugins may not work properly. Also, be familiar with the plugin usage tutorial, which you can refer to at [VTable Plugin Usage Tutorial](../plugin/usage.md). If you want to extend VTable plugins, you can refer to [VTable Plugin Contribution](../plugin/contribute.md).

Configuration example: Configure the carousel animation plugin during VTableSheet initialization to implement table carousel scrolling:

```javascript livedemo template=vtable
// Import required plugin package - ensure version matches the one used by VTableSheet
// import * as VTablePlugins from '@visactor/vtable-plugins';

// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// Create VTableSheet instance and configure plugins
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "Employee Information",
      rowCount: 35,
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Age', width: 80 },
        { title: 'Department', width: 120 }
      ],
      data: [
        ['Alex', 25, 'Engineering'],
        ['Bob', 26, 'Engineering'],
        ['Charlie', 28, 'Engineering'],
        ['David', 32, 'Marketing'],
        ['Edward', 25, 'Engineering'],
        ['Frank', 26, 'Engineering'],
        ['George', 27, 'Engineering'],
        ['Henry', 28, 'Engineering'],
        ['Ian', 29, 'Engineering'],
        ['Jack', 30, 'Engineering'],
        ['Kevin', 31, 'Engineering'],
        ['Leo', 32, 'Engineering'],
        ['Mike', 33, 'Engineering'],
        ['Nathan', 34, 'Engineering'],
        ['Oliver', 35, 'Engineering'],
        ['Peter', 36, 'Engineering'],
        ['Quentin', 37, 'Engineering'],
        ['Robert', 38, 'Engineering'],
        ['Sam', 39, 'Engineering'],
        ['Tom', 40, 'Engineering'],
        ['Ulysses', 41, 'Engineering'],
        ['Victor', 42, 'Engineering'],
        ['William', 43, 'Engineering'],
        ['Xavier', 44, 'Engineering'],
        ['Yves', 45, 'Engineering'],
        ['Zack', 46, 'Engineering'],
        ['Adam', 47, 'Engineering'],
        ['Ben', 48, 'Engineering'],
        ['Carl', 49, 'Engineering'],
        ['Dan', 50, 'Engineering'],
        ['Eric', 51, 'Engineering'],
        ['Fred', 52, 'Engineering'],
        ['Greg', 53, 'Engineering'],
        ['Harry', 54, 'Engineering'],
        ['Isaac', 55, 'Engineering'],
      ],
      active: true
    }
  ],
  VTablePluginModules: [
    // Excel import plugin
    {
      module: VTablePlugins.TableCarouselAnimationPlugin,
      moduleOptions:
      {
        rowCount: 10,
        animationDuration: 1000,
        animationDelay: 1000,
        animationEasing: 'linear',
        autoPlay: true,
        autoPlayDelay: 1000,
      }
    },
   
  ]
});
```

## Modifying Built-in Plugin Configuration

For built-in plugins in VTableSheet, you can modify the plugin configuration through VTablePluginModules. Built-in plugins have default configuration options, and user configurations will override the built-in defaults. The specific plugin initialization code logic can be found at: https://github.com/VisActor/VTable/blob/develop/packages/vtable-sheet/src/core/table-plugins.ts

Here's an example of modifying the table number plugin color:

```javascript livedemo template=vtable
// Import required plugin package - ensure version matches the one used by VTableSheet
// import * as VTablePlugins from '@visactor/vtable-plugins';

// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// Create VTableSheet instance and configure plugins
const sheetInstance = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "Employee Information",
      rowCount: 35,
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Age', width: 80 },
        { title: 'Department', width: 120 }
      ],
      data: [
        ['Alex', 25, 'Engineering'],
        ['Bob', 26, 'Engineering'],
        ['Charlie', 28, 'Engineering'],
        ['David', 32, 'Marketing']
      ],
      active: true
    }
  ],
  VTablePluginModules: [
   {
        module: VTablePlugins.TableSeriesNumber,
        moduleOptions: {
        rowSeriesNumberCellStyle: {
         text: {
            fontSize: 14,
            fill: 'red',
            pickable: false,
            textAlign: 'left',
            textBaseline: 'middle',
            padding: [2, 4, 2, 4]
          },
          borderLine: {
            stroke: '#D9D9D9',
            lineWidth: 1,
            pickable: false
          }
        }
      }
    }
  ]
});
```

## Disable Built-in Plugins

If you want to disable built-in plugins, you can configure the plugins through VTablePluginModules to disable built-in plugins.

For example, to disable the context menu plugin:

```javascript 
VTablePluginModules: [
  {
    module: VTablePlugins.ContextMenuPlugin,
    disabled: true
  }
]
```

## Combined Use of Plugins and Menus

For combined use of plugins and menus, refer to [Menu Configuration](./menu.md) for specific menu configuration.

Here we mainly introduce how to add import and export functionality to the menu. When configuring VTablePluginModules, you need to explicitly configure the required `ExcelImportPlugin` and `TableExportPlugin` plugins.

In the example below, mainMenu is configured, and a main menu button will appear in the upper left corner of the UI. Clicking the main menu button will display import and export functionality:
<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/mainMenu.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

```javascript livedemo template=vtable
// Import required plugin package - ensure version matches the one used by VTableSheet
// import * as VTablePlugins from '@visactor/vtable-plugins';

// Import VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// Create VTableSheet instance and configure plugins
const sheetInstance = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "Employee Information",
      rowCount: 35,
      columns: [
        { title: 'Name', width: 100 },
        { title: 'Age', width: 80 },
        { title: 'Department', width: 120 }
      ],
      data: [
        ['Alex', 25, 'Engineering'],
        ['Bob', 26, 'Engineering'],
        ['Charlie', 28, 'Engineering'],
        ['David', 32, 'Marketing']
      ],
      active: true
    }
  ],
  // Basic configuration...
  VTablePluginModules: [
    // Excel import plugin
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {
        // id: 'excel-import-plugin',
        // exportData: true,  // Whether to support export functionality
        // importData: true,  // Whether to support import functionality
        // fileTypes: ['xlsx', 'csv']  // Supported file types
      }
    },
    // Table export plugin
    {
      module: VTablePlugins.TableExportPlugin
    }
  ],
  
  // Configure import and export options in the main menu
  mainMenu: {
    show: true,
    items: [
      {
        name: 'Import',
        menuKey: 'import',
        description: 'Import data to replace current sheet'
      },
      {
        name: 'Export',
        items: [
          {
            name: 'Export CSV',
            menuKey: 'export-current-sheet-csv',
            description: 'Export current sheet data to csv'
          },
          {
            name: 'Export XLSX',
            menuKey: 'export-current-sheet-xlsx',
            description: 'Export current sheet data to xlsx'
          },
          {
            name: 'Export All Sheets',
            menuKey: 'export-all-sheets-xlsx',
            description: 'Export all sheets to xlsx'
          }
        ]
      }
    ]
  },
  dragOrder: {
    enableDragColumnOrder: true,
    enableDragRowOrder: true
  }
});
window.sheetInstance = sheetInstance;
```

The MenuKey in the example is the menu key value defined internally by VTableSheet.

```typescript
export enum MenuKey {
  /** Requires plugin support, please configure ExcelImportPlugin in plugins */
  IMPORT = 'import',
  /** Requires plugin support, please configure TableExportPlugin in plugins */
  EXPORT_CURRENT_SHEET_CSV = 'export-current-sheet-csv',
  /** Requires plugin support, please configure TableExportPlugin in plugins */
  EXPORT_CURRENT_SHEET_XLSX = 'export-current-sheet-xlsx'
}
```

The import and export functionality above can also be called through APIs. After successful initialization, the VTableSheet instance provides the following APIs to call import and export functionality:
- exportSheetToFile
- importFileToSheet

Through the plugin system, you can greatly extend the functionality of VTable-Sheet to meet various complex business requirements. If you want to customize plugins, please refer to [Plugin Contribution](../plugin/contribute.md)