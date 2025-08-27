# 右键菜单插件（ContextMenu）

## 简介

右键菜单插件（ContextMenu）为VTable表格提供了丰富的右键菜单功能，支持表格单元格、表头、行列序号等区域的右键菜单定制，能有效提升表格的交互体验和操作效率。通过此插件，用户可以快速进行复制、粘贴、插入行列、删除行列、冻结行列等常见操作。

## 功能特点

- 支持表格不同区域的右键菜单定制（表头、表体、行序号、列序号、角落）
- 内置常用的菜单操作（复制、粘贴、插入行列、删除行列、冻结行列等）
- 支持自定义菜单项和分隔线
- 支持菜单项分组和子菜单
- 支持自定义菜单项点击回调
- 支持菜单项图标和快捷键提示
- 支持菜单项中的数字输入（如插入多行/列）

## 基本使用

以下是ContextMenu插件的基本使用方法：

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

// 注册并启用右键菜单插件
tableInstance.registerPlugin(
  new ContextMenuPlugin()  // 使用默认菜单项
);
```

## 自定义菜单项

目前支持的菜单项在`@visactor/vtable-plugins`中定义了一份默认的配置，具体可以参考[ContextMenuPlugin](https://github.com/VisActor/VTable/blob/develop/packages/vtable-plugins/src/contextmenu/types.ts)。

ContextMenu插件允许您自定义不同区域的右键菜单项：

```typescript
import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin, MenuKey } from '@visactor/vtable-plugins';

// 创建表格实例（代码略）...

// 初始化右键菜单插件，使用自定义菜单项
const contextMenuPlugin = new ContextMenuPlugin({
    // 表体区域菜单项
    bodyCellMenuItems: [
      { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
      { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
      '---', // 分隔线
      { text: '插入行', menuKey: 'insert_row', children: [
        { text: '向上插入行数：', menuKey: MenuKey.INSERT_ROW_ABOVE, iconName: 'up-arrow', inputDefaultValue: 1 },
        { text: '向下插入行数：', menuKey: MenuKey.INSERT_ROW_BELOW, iconName: 'down-arrow', inputDefaultValue: 1 }
      ]},
      { text: '删除行', menuKey: MenuKey.DELETE_ROW }
    ],
    
    // 表头菜单项
    headerCellMenuItems: [
      { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
      '---',
      { text: '排序', menuKey: MenuKey.SORT }
    ],
    
    // 自定义菜单点击回调
    menuClickCallback: (args, table) => {
      // 自定义菜单点击处理
      console.log('菜单点击:', args);
      
      if (args.menuKey === 'custom_action') {
        // 执行自定义操作
      }
    }
  })

```

## 动态调整菜单项

ContextMenu插件支持在显示菜单前动态调整菜单项，这在某些场景下非常有用：

```typescript
import * as VTable from '@visactor/vtable';
import { ContextMenuPlugin } from '@visactor/vtable-plugins';

// 创建表格实例（代码略）...

// 初始化右键菜单插件
const contextMenuPlugin = new ContextMenuPlugin({
    // 使用默认菜单项
    
    // 在菜单显示前动态调整菜单项
    beforeShowAdjustMenuItems: (menuItems, table, col, row) => {
      // 可以基于单元格位置、内容等条件动态调整菜单项
      if (table.isHeader(col, row)) {
        // 表头区域的额外处理
        return [
          ...menuItems,
          '---',
          { text: '自定义表头操作', menuKey: 'custom_header_action' }
        ];
      }
      
      // 获取单元格数据
      const cellValue = table.getCellValue(col, row);
      
      // 根据单元格值动态添加菜单项
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

## 完整示例

以下是一个完整的示例，展示了如何创建具有右键菜单功能的表格：

```typescript  livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
/** 
 * 生成示例数据
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

 // 使用可变数据存储
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

  // 创建右键菜单插件
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
  // 创建表格配置
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

  // 创建表格实例
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```


## API参考

### 配置选项

ContextMenuPlugin插件接受以下配置选项：

| 配置项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `id` | string | 自动生成 | 插件ID |
| `bodyCellMenuItems` | Array | 默认菜单项 | 表体单元格的菜单项 |
| `headerCellMenuItems` | Array | 默认菜单项 | 表头单元格的菜单项 |
| `rowSeriesNumberMenuItems` | Array | 默认菜单项 | 行序号单元格的菜单项 |
| `columnSeriesNumberMenuItems` | Array | 默认菜单项 | 列序号单元格的菜单项 |
| `cornerSeriesNumberMenuItems` | Array | 默认菜单项 | 左上角单元格的菜单项 |
| `menuClickCallback` | Function/Object | - | 菜单点击回调函数或对象 |
| `beforeShowAdjustMenuItems` | Function | - | 菜单显示前的调整函数 |

### 菜单项类型

菜单项可以是以下几种类型：

- 普通菜单项：`{ text: '菜单文本', menuKey: '菜单键值', iconName?: '图标名称', shortcut?: '快捷键' }`
- 输入菜单项：`{ text: '菜单文本', menuKey: '菜单键值', iconName?: '图标名称', inputDefaultValue: 1 }`
- 子菜单项：`{ text: '菜单文本', menuKey: '菜单键值', iconName?: '图标名称', children: [...子菜单项] }`
- 分隔线：`'---'`

### 预定义的菜单键值（MenuKey）

插件预定义了以下菜单键值：

| 键值 | 描述 |
| --- | --- |
| `COPY` | 复制 |
| `CUT` | 剪切 |
| `PASTE` | 粘贴 |
| `INSERT_ROW_ABOVE` | 向上插入行 |
| `INSERT_ROW_BELOW` | 向下插入行 |
| `INSERT_COLUMN_LEFT` | 向左插入列 |
| `INSERT_COLUMN_RIGHT` | 向右插入列 |
| `DELETE_ROW` | 删除行 |
| `DELETE_COLUMN` | 删除列 |
| `FREEZE_TO_THIS_ROW` | 冻结到此行 |
| `FREEZE_TO_THIS_COLUMN` | 冻结到此列 |
| `FREEZE_TO_THIS_ROW_AND_COLUMN` | 冻结到此行和列 |
| `UNFREEZE` | 取消冻结 |
| `MERGE_CELLS` | 合并单元格 |
| `UNMERGE_CELLS` | 取消合并单元格 |
| `HIDE_COLUMN` | 隐藏列 |
| `SORT` | 排序 |
