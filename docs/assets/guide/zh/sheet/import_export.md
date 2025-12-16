# 导入导出能力
VTable-Sheet中导入导出依赖VTable的插件@visactor/vtable-plugins中的插件包来实现的。

导出插件：@visactor/vtable-plugins/table-export-plugin ，参考教程文档：[表格导出](../plugin/table-export)

导入插件：@visactor/vtable-plugins/excel-import-plugin, 参考教程文档：[表格导入](../plugin/excel-import)

如果想要修改插件的配置项，可以通过VTablePluginModules配置导入和导出插件的各个参数。

导入导出能力一般要配合菜单功能一起使用，所以需要配置菜单功能，具体可以参考[菜单功能](./menu.md)。

## 导出sheet
导出当前sheet，可以在mainMenu配menuKey为VTableSheet.TYPES.MenuKey.EXPORT_CURRENT_SHEET_CSV来导出csv文件，或者配menuKey为VTableSheet.TYPES.MenuKey.EXPORT_CURRENT_SHEET_XLSX来导出excel文件。

导出excel文件支持全部sheet导出，可以在mainMenu配menuKey为VTableSheet.TYPES.MenuKey.EXPORT_ALL_SHEETS_XLSX来导出excel文件。

具体如：

```typescript
    mainMenu: {
      show: true,
      items: [
        ......
        {
          name: '导出',
          items: [
            {
              name: '导出csv',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_CSV,
              description: '导出当前sheet数据到csv'
            },
            {
              name: '导出xlsx',
              menuKey: TYPES.MainMenuItemKey.EXPORT_CURRENT_SHEET_XLSX,
              description: '导出当前sheet数据到xlsx'
            },
            {
              name: '导出全部xlsx',
              menuKey: TYPES.MainMenuItemKey.EXPORT_ALL_SHEETS_XLSX,
              description: '导出所有sheet到xlsx'
            }
          ],
          description: '导出当前sheet数据'
        }
      ]
    }
```

也支持通过API调用导出功能，具体可以参考[API](../../api/SheetAPI#Methods.exportSheetToFile)。

## 导入sheet

导入sheet，可以在mainMenu配menuKey为VTableSheet.TYPES.MenuKey.IMPORT来导入csv文件或excel文件。

具体如：

```typescript
mainMenu: {
  ......
  items: [
    {
      name: '导入',
      menuKey: VTableSheet.TYPES.MenuKey.IMPORT,
      description: '导入数据到当前sheet'
    }
  ]
}
```

也支持通过API调用导入功能，具体可以参考[API](../../api/SheetAPI#Methods.importFileToSheet)。