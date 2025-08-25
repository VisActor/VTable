# ContextMenu

## Introduction

ContextMenu provides rich right-click menu features for VTable tables, supporting customization of right-click menus in different areas of the table (header, body, row series number, column series number, corner). It can effectively improve the interactive experience and operation efficiency of the table. Through this plugin, users can quickly perform common operations such as copying, pasting, inserting and deleting rows and columns, and freezing rows and columns.

## Features

- Support customization of right-click menus in different areas of the table (header, body, row series number, column series number, corner)
- Built-in common menu operations (copy, paste, insert and delete rows and columns, freeze rows and columns, etc.)
- Support custom menu items and separators
- Support menu item grouping and submenus
- Support custom menu item click callbacks
- Support menu item icons and shortcut hints
- Support numeric input in menu items (e.g., insert multiple rows/columns)

## Basic Usage

Here is the basic usage method of the ContextMenu plugin:

```typescript
import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '@visactor/vtable-plugins';

// 创建表格实例
const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'name', title: '姓名' },
    { field: 'age', title: '年龄' },
    { field: 'gender', title: '性别' }
  ],
  records: [
    { name: '张三', age: 20, gender: '男' },
    { name: '李四', age: 25, gender: '男' },
    { name: '王五', age: 22, gender: '女' },
  ]
});

// Register and enable the right-click menu plugin
tableInstance.registerPlugin(
  new ContextMenuPlugin()  // Use default menu items
);
```

## 自定义菜单项

The ContextMenu plugin allows you to customize right-click menu items in different areas:

```typescript
import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin, MenuKey } from '@visactor/vtable-plugins';

  // Create table instance (code omitted)...

// Initialize the right-click menu plugin, using custom menu items
const contextMenuPlugin = new ContextMenuPlugin({
    // Body area menu items
    bodyCellMenuItems: [
      { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
      { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
      '---', // Separator
      { text: '插入行', menuKey: 'insert_row', children: [
        { text: '向上插入行数：', menuKey: MenuKey.INSERT_ROW_ABOVE, iconName: 'up-arrow', inputDefaultValue: 1 },
        { text: '向下插入行数：', menuKey: MenuKey.INSERT_ROW_BELOW, iconName: 'down-arrow', inputDefaultValue: 1 }
      ]},
      { text: '删除行', menuKey: MenuKey.DELETE_ROW }
    ],
    
    // Header menu items
    headerCellMenuItems: [
      { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
      '---',
      { text: '排序', menuKey: MenuKey.SORT }
    ],
    
    // Custom menu click callback
    menuClickCallback: (args, table) => {
      // Custom menu click processing
      console.log('Menu click:', args);
      
      if (args.menuKey === 'custom_action') {
        // Execute custom operation
      }
    }
  })

```

## Dynamic Adjustment of Menu Items

The ContextMenu plugin supports dynamically adjusting menu items before they are displayed, which is very useful in some scenarios:

```typescript
import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '@visactor/vtable-plugins';

// Create table instance (code omitted)...

// Initialize the right-click menu plugin
const contextMenuPlugin = new ContextMenuPlugin({
    // Use default menu items
    
    // Dynamically adjust menu items before they are displayed
    beforeShowAdjustMenuItems: (menuItems, table, col, row) => {
      // Dynamically adjust menu items based on cell position, content, etc.
      if (table.isHeader(col, row)) {
        // Additional processing in the header area
        return [
          ...menuItems,
          '---',
          { text: '自定义表头操作', menuKey: 'custom_header_action' }
        ];
      }
      
        // Get cell data
      const cellValue = table.getCellValue(col, row);
      
      // Dynamically add menu items based on cell values
      if (typeof cellValue === 'number' && cellValue > 100) {
        return [
          ...menuItems,
          '---',
          { text: '高亮大数值', menuKey: 'highlight_large_value' }
        ];
      }
      
      return menuItems;
    }
  });
```

## Complete Example

Here is a complete example showing how to create a table with right-click menu functionality:

```typescript  livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
  // When using, you need to import the plugin package @visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
/** 
 * Generate sample data
 */
const generateTestData = (count) => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `名称 ${i + 1}`,
    value1: Math.floor(Math.random() * 1000),
    value2: Math.floor(Math.random() * 100) / 100,
    value3: Math.floor(Math.random() * 1000),
    value4: Math.floor(Math.random() * 1000),
    value5: Math.floor(Math.random() * 1000)
  }));
};

 // Use variable data storage
  const records = generateTestData(20);

  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: 'name',
      title: '名称',
      width: 150
    },
    {
      field: 'value1',
      title: '数值1',
      width: 120
    },
    {
      field: 'value2',
      title: '数值2',
      width: 120
    },
    {
      field: 'value3',
      title: '数值3',
      width: 120
    },
    {
      field: 'value4',
      title: '数值4',
      width: 120
    },
    {
      field: 'value5',
      title: '数值5',
      width: 120
    }
  ];

  // Create right-click menu plugin
  const contextMenuPlugin = new VTablePlugins.ContextMenuPlugin({
    headerCellMenuItems: [
      ...VTablePlugins.DEFAULT_HEADER_MENU_ITEMS,
      {
        text: '设置筛选器',
        menuKey: 'set_filter'
      }
    ],
    
    menuClickCallback: {
      // [VTablePlugins.MenuKey.COPY]: (args, table) => {
      //   console.log('复制', args, table);
      // }
    }
  });
  const tableSeriesNumberPlugin = new VTablePlugins.TableSeriesNumber({
    rowCount: 1000,
    colCount: 100,
    colSeriesNumberHeight: 30,
    rowSeriesNumberWidth: 40
  });
  // Create table configuration
  const option = {
    frozenRowCount: 2,
    columns,
    records,
    widthMode: 'standard',
    defaultRowHeight: 40,
    hover: {
      highlightMode: 'cross'
    },
    showHeader: true,
    select: {
      makeSelectCellVisible: false
    },
    editor: '',
    headerEditor: '',
    keyboardOptions: {
      copySelected: true,
      pasteValueToCell: true
    },
    plugins: [contextMenuPlugin, tableSeriesNumberPlugin]
  };

  // Create table instance
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```


## API Reference

### Configuration Options

The ContextMenuPlugin plugin accepts the following configuration options:

| Configuration item | Type | Default value | Description |
| --- | --- | --- | --- |
| `id` | string | Automatically generated | Plugin ID |
| `bodyCellMenuItems` | Array | Default menu items | Menu items for body cells |
| `headerCellMenuItems` | Array | Default menu items | Menu items for header cells |
| `rowSeriesNumberMenuItems` | Array | Default menu items | Menu items for row series number cells |
| `columnSeriesNumberMenuItems` | Array | Default menu items | Menu items for column series number cells |
| `cornerSeriesNumberMenuItems` | Array | Default menu items | Menu items for corner cells |
| `menuClickCallback` | Function/Object | - | Menu click callback function or object |
| `beforeShowAdjustMenuItems` | Function | - | Menu display adjustment function before display |

### Menu Item Types

Menu items can be of the following types:

- Normal menu item: `{ text: 'Menu text', menuKey: 'Menu key value', iconName?: 'Icon name', shortcut?: 'Shortcut' }`
- Input menu item: `{ text: 'Menu text', menuKey: 'Menu key value', iconName?: 'Icon name', inputDefaultValue: 1 }`
- Submenu item: `{ text: 'Menu text', menuKey: 'Menu key value', iconName?: 'Icon name', children: [...submenu items] }`
- Separator: `'---'`

### Predefined Menu Key Values (MenuKey)

  The plugin predefines the following menu key values:

| Key value | Description |
| --- | --- |
| `COPY` | Copy |
| `CUT` | Cut |
| `PASTE` | Paste |
| `INSERT_ROW_ABOVE` | Insert row above |
| `INSERT_ROW_BELOW` | Insert row below |
| `INSERT_COLUMN_LEFT` | Insert column left |
| `INSERT_COLUMN_RIGHT` | Insert column right |
| `DELETE_ROW` | Delete row |
| `DELETE_COLUMN` | Delete column |
| `FREEZE_TO_THIS_ROW` | Freeze to this row |
| `FREEZE_TO_THIS_COLUMN` | Freeze to this column |
| `FREEZE_TO_THIS_ROW_AND_COLUMN` | Freeze to this row and column |
| `UNFREEZE` | Unfreeze |
| `MERGE_CELLS` | Merge cells |
| `UNMERGE_CELLS` | Unmerge cells |
| `HIDE_COLUMN` | Hide column |
| `SORT` | Sort |
