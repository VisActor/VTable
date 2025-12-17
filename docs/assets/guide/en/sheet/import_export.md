# Import and Export Capabilities
Import and export capabilities in VTable-Sheet rely on plugin packages from @visactor/vtable-plugins.

Export plugin: @visactor/vtable-plugins/table-export-plugin, refer to the tutorial documentation: [table export](../plugin/table-export)

Import plugin: @visactor/vtable-plugins/excel-import-plugin, refer to the tutorial documentation: [table import](../plugin/excel-import)

If you want to modify the plugin configuration, you can configure the parameters of the import and export plugins through VTablePluginModules.

Import and export capabilities usually need to be used together with menu functionality, so you need to configure menu functionality, which can be referred to [menu functionality](./menu.md).

## Export sheet
Export the current sheet, you can configure menuKey as VTableSheet.TYPES.MenuKey.EXPORT_CURRENT_SHEET_CSV to export a csv file, or configure menuKey as VTableSheet.TYPES.MenuKey.EXPORT_CURRENT_SHEET_XLSX to export an excel file.

Export excel file supports exporting all sheets, you can configure menuKey as VTableSheet.TYPES.MenuKey.EXPORT_ALL_SHEETS_XLSX to export an excel file.

Example:

```typescript
    mainMenu: {
      show: true,
      items: [
        ......
        {
          name: 'Export',
          items: [
            {
              name: 'Export CSV',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_CSV,
              description: 'Export current sheet data to csv'
            },
            {
              name: 'Export XLSX',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_XLSX,
              description: 'Export current sheet data to xlsx'
            },
            {
              name: 'Export All Sheets',
              menuKey: TYPES.MainMenuItemKey.EXPORT_ALL_SHEETS_XLSX,
              description: 'Export all sheets to xlsx'
            }
          ],
          description: 'Export current sheet data'
        }
      ]
    }
```

It also supports calling the export function through APIs, which can be referred to [API](../../api/SheetAPI#Methods.exportSheetToFile).

## Import sheet

Import sheet, you can configure menuKey as VTableSheet.TYPES.MenuKey.IMPORT to import a csv file or excel file.

Example:

```typescript
mainMenu: {
  ......
  items: [
    {
      name: 'Import',
      menuKey: VTableSheet.TYPES.MenuKey.IMPORT,
      description: 'Import data to current sheet'
    }
  ]
}
```

It also supports calling the import function through APIs, which can be referred to [API](../../api/SheetAPI#Methods.importFileToSheet).

Import supports excel files and csv files, and supports multi-sheet import for excel files.