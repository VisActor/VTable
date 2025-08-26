# 插件功能

VTable-Sheet支持丰富的插件功能，用于扩展表格的基础功能。本章将介绍如何使用和配置VTable-Sheet的插件系统。

## 内置插件

VTable-Sheet可以与VTable的插件系统无缝集成，通过`VTablePluginModules`配置选项来使用各种插件。

### 常用插件

以下是一些常用的插件：

1. **导入导出插件**：支持CSV和Excel文件的导入导出
2. **复制粘贴插件**：支持表格数据的复制粘贴操作
3. **选择插件**：增强的单元格选择功能
4. **编辑插件**：支持表格内容的编辑功能

## 配置插件

在VTableSheet初始化时配置插件：

```typescript
// 引入所需插件
import * as VTablePlugins from '@visactor/vtable-plugins';

// 创建VTableSheet实例并配置插件
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 基本配置...
  VTablePluginModules: [
    // Excel导入插件
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {
        // 插件配置选项
      }
    },
    // 表格导出插件
    {
      module: VTablePlugins.TableExportPlugin
    }
  ]
});
```

## 举例：导入导出插件

### 配置导入导出功能

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 基本配置...
  VTablePluginModules: [
    // Excel导入插件
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {
        id: 'excel-import-plugin',
        exportData: true,  // 是否支持导出功能
        importData: true,  // 是否支持导入功能
        fileTypes: ['xlsx', 'csv']  // 支持的文件类型
      }
    },
    // 表格导出插件
    {
      module: VTablePlugins.TableExportPlugin,
      moduleOptions: {
        id: 'table-export-plugin',
        filename: '表格数据',  // 默认文件名
        sheets: 'all',  // 导出所有表格页
        includeHeader: true  // 是否包含表头
      }
    }
  ],
  
  // 配置主菜单中的导入导出选项
  mainMenu: {
    show: true,
    items: [
      {
        name: '导入',
        menuKey: MenuKey.IMPORT,
        description: '导入数据替换到当前sheet'
      },
      {
        name: '导出',
        items: [
          {
            name: '导出CSV',
            menuKey: MenuKey.EXPORT_CURRENT_SHEET_CSV,
            description: '导出当前sheet数据到csv'
          },
          {
            name: '导出XLSX',
            menuKey: MenuKey.EXPORT_CURRENT_SHEET_XLSX,
            description: '导出当前sheet数据到xlsx'
          },
          {
            name: '导出所有表格',
            menuKey: MenuKey.EXPORT_ALL_SHEETS_XLSX,
            description: '导出所有表格页到xlsx'
          }
        ]
      }
    ]
  }
});
```

### 通过API调用导入导出功能

```typescript
// 获取插件实例
const exportPlugin = sheetInstance.getActiveSheet().tableInstance.pluginManager.getPlugin('table-export-plugin');
const importPlugin = sheetInstance.getActiveSheet().tableInstance.pluginManager.getPlugin('excel-import-plugin');

// 导出当前表格为CSV
exportPlugin.exportToCSV();

// 导出当前表格为XLSX
exportPlugin.exportToExcel();

// 导出所有表格为XLSX
exportPlugin.exportToExcel({ sheets: 'all' });

// 监听文件导入
document.getElementById('import-btn').addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx,.csv';
  fileInput.style.display = 'none';
  
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      importPlugin.importFromFile(file);
    }
  });
  
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
});
```
### 结合内部菜单mainMenu来实现导入导出

<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/mainMenu.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 基本配置...
  mainMenu: {
    show: true,
    items: [
      {
        name: '导入',
        menuKey: MenuKey.IMPORT,
        description: '导入数据替换到当前sheet'
      },
      {
        name: '导出',
        items: [
          {
            name: '导出CSV',
            menuKey: MenuKey.EXPORT_CURRENT_SHEET_CSV,
            description: '导出当前sheet数据到csv'
          },
        ]
      }
    ]
  }
});
```
上面的MenuKey是VTableSheet内部定义的菜单键值，他们都需要用户在plugins中配置相应的插件，否则点击菜单时会报错。

```typescript
export enum MenuKey {
  /** 需要插件支持，请在plugins中配置 ExcelImportPlugin */
  IMPORT = 'import',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_CSV = 'export-current-sheet-csv',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_XLSX = 'export-current-sheet-xlsx'
}
```


通过插件系统，可以极大地扩展VTable-Sheet的功能，满足各种复杂的业务需求。如果想要自定义插件可以参考[插件贡献](../plugin/contribute.md)

