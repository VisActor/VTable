# 菜单功能

VTable-Sheet提供了丰富的菜单功能，包括主菜单和右键上下文菜单，帮助用户快速执行常用操作。本章介绍如何配置和使用VTable-Sheet的菜单功能。

## 主菜单配置

VTable-Sheet支持在顶部显示主菜单，可以通过配置项自定义菜单内容：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 其他配置项...
  mainMenu: {
    show: true,  // 显示主菜单
    items: [

          {
            name: '导入',
            menuKey: MenuKey.IMPORT,  // 使用预定义的菜单键值
            description: '导入数据'  // 鼠标悬停时的提示信息
          },
          {
            name: '导出',
            items: [  // 可以嵌套多级菜单
              {
                name: '导出CSV',
                menuKey: MenuKey.EXPORT_CURRENT_SHEET_CSV,
                description: '导出当前表格为CSV格式'
              },
              {
                name: '导出Excel',
                menuKey: MenuKey.EXPORT_CURRENT_SHEET_XLSX,
                description: '导出当前表格为Excel格式'
              }
            ]
          }
    ]
  }
});
```

通过上面配置，主菜单效果如下：

<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/mainMenu.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

从以上mainMenu配置结构可以看出，支持多级菜单，也支持嵌套子菜单。其具体定义如下：

```typescript
  /** 主菜单 */
  mainMenu?: {
    /** 是否显示 */
    show?: boolean;
    /** 菜单项 */
    items?: MainMenuItem[];
  };
```

菜单项的配置项：

```typescript
export interface MainMenuItem {
  /** 菜单项名称 */
  name: string;
  /** 菜单项唯一标识，如果配置了_menuKey中包含的值，点击菜单项时，会匹配内置逻辑（如配置了onclick,仍然优先匹配onclick） */
  menuKey?: MainMenuItemKey;
  /** 菜单项描述 */
  description?: string;
  /** 菜单项点击回调 */
  onClick?: () => void;
  /** 子菜单项 */
  items?: MainMenuItem[];
}

export type MainMenuItemKey = _MenuKey | string;

export enum _MenuKey {
  /** 需要插件支持，请在plugins中配置 ExcelImportPlugin */
  IMPORT = 'import',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_CSV = 'export-current-sheet-csv',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_XLSX = 'export-current-sheet-xlsx'
}
```

_MenuKey中包含的值，点击菜单项时，会匹配内置逻辑，目前如代码示例中仅支持了三种key值。这些key值涉及导入导出逻辑，需要同时再配置VTablePluginModules，来明确配置所需的`ExcelImportPlugin`及`TableExportPlugin`插件。如果其他key值，则需要配置onclick来处理。

## 上下文菜单（右键菜单）

VTable-Sheet也支持右键上下文菜单。此能力是基于`@visactor/vtable-plugins`中的`ContextMenuPlugin`插件实现。插件教程可以参考[ContextMenuPlugin](../plugin/context-menu.md)。

这里主要强调下，如果想要修改默认的菜单项，可以通过VTablePluginModules来定义ContextMenuPlugin插件配置选项，来修改默认的菜单项。

通过这些菜单功能，VTable-Sheet能够提供丰富的用户交互体验，帮助用户高效操作和管理表格数据。

