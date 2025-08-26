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
        name: '文件',  // 菜单名称
        menuKey: 'file',  // 菜单唯一标识
        items: [  // 子菜单项
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
      },
      {
        name: '编辑',
        menuKey: 'edit',
        items: [
          {
            name: '复制',
            menuKey: MenuKey.COPY,
            description: '复制选中内容',
            shortcut: 'Ctrl+C'  // 快捷键提示
          },
          {
            name: '粘贴',
            menuKey: MenuKey.PASTE,
            description: '粘贴内容',
            shortcut: 'Ctrl+V'
          },
          {
            name: '剪切',
            menuKey: MenuKey.CUT,
            description: '剪切选中内容',
            shortcut: 'Ctrl+X'
          }
        ]
      }
    ]
  }
});
```

## 预定义菜单键值

VTable-Sheet提供了一系列预定义的菜单键值（MenuKey），代表常用的菜单操作：

```typescript
// 从VTable-Sheet导入MenuKey
import { MenuKey } from '@visactor/vtable-sheet';

// 或者通过命名空间访问
const { MenuKey } = VTableSheet;
```

常用的预定义菜单键值包括：

| 菜单键值 | 说明 |
|---------|------|
| MenuKey.IMPORT | 导入数据 |
| MenuKey.EXPORT_CURRENT_SHEET_CSV | 导出当前表格为CSV |
| MenuKey.EXPORT_CURRENT_SHEET_XLSX | 导出当前表格为Excel |
| MenuKey.EXPORT_ALL_SHEETS_XLSX | 导出所有表格为Excel |
| MenuKey.COPY | 复制 |
| MenuKey.PASTE | 粘贴 |
| MenuKey.CUT | 剪切 |
| MenuKey.DELETE | 删除 |
| MenuKey.UNDO | 撤销 |
| MenuKey.REDO | 重做 |
| MenuKey.INSERT_ROW_ABOVE | 在上方插入行 |
| MenuKey.INSERT_ROW_BELOW | 在下方插入行 |
| MenuKey.INSERT_COL_LEFT | 在左侧插入列 |
| MenuKey.INSERT_COL_RIGHT | 在右侧插入列 |
| MenuKey.DELETE_ROW | 删除行 |
| MenuKey.DELETE_COL | 删除列 |

## 自定义菜单项

除了使用预定义的菜单键值，还可以创建完全自定义的菜单项，并通过监听菜单事件来处理菜单点击：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  mainMenu: {
    show: true,
    items: [
      {
        name: '自定义操作',
        menuKey: 'custom-actions',
        items: [
          {
            name: '添加求和行',
            menuKey: 'add-sum-row',  // 自定义键值
            description: '在表格底部添加求和行'
          },
          {
            name: '高亮最大值',
            menuKey: 'highlight-max',
            description: '高亮显示最大值'
          }
        ]
      }
    ]
  }
});

// 监听菜单点击事件
sheetInstance.on('menuClick', (event) => {
  const { menuKey } = event;
  
  // 处理自定义菜单项
  switch (menuKey) {
    case 'add-sum-row':
      // 添加求和行的逻辑
      addSumRow(sheetInstance);
      break;
    case 'highlight-max':
      // 高亮最大值的逻辑
      highlightMaxValue(sheetInstance);
      break;
  }
});

// 自定义函数：添加求和行
function addSumRow(sheet) {
  const activeSheet = sheet.getActiveSheet();
  const data = activeSheet.getData();
  const colCount = data[0].length;
  
  // 创建求和行
  const sumRow = ['总计'];
  for (let col = 1; col < colCount; col++) {
    // 添加求和公式
    sumRow.push('');
    const colLetter = String.fromCharCode(65 + col);
    sheet.getFormulaManager().registerFormula({
      sheet: activeSheet.key,
      row: data.length,  // 新行的索引
      col: col
    }, `SUM(${colLetter}2:${colLetter}${data.length})`);
  }
  
  // 添加行
  activeSheet.appendRow(sumRow);
}

// 自定义函数：高亮最大值
function highlightMaxValue(sheet) {
  const activeSheet = sheet.getActiveSheet();
  const data = activeSheet.getData();
  
  // 遍历每列查找最大值
  for (let col = 1; col < data[0].length; col++) {
    let maxValue = -Infinity;
    let maxRow = -1;
    
    // 查找最大值
    for (let row = 1; row < data.length; row++) {
      const value = parseFloat(data[row][col]);
      if (!isNaN(value) && value > maxValue) {
        maxValue = value;
        maxRow = row;
      }
    }
    
    // 高亮最大值单元格
    if (maxRow >= 0) {
      activeSheet.setCellStyle(maxRow, col, {
        bgColor: '#e6f7ff',
        fontWeight: 'bold',
        text: {
          fill: '#1890ff'
        }
      });
    }
  }
}
```

## 上下文菜单（右键菜单）

VTable-Sheet也支持右键上下文菜单。可以通过配置自定义右键菜单内容：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  // 其他配置项...
  contextMenu: {
    enable: true,  // 启用右键菜单
    items: [
      {
        name: '插入',
        menuKey: 'insert',
        items: [
          {
            name: '在上方插入行',
            menuKey: MenuKey.INSERT_ROW_ABOVE
          },
          {
            name: '在下方插入行',
            menuKey: MenuKey.INSERT_ROW_BELOW
          },
          {
            name: '在左侧插入列',
            menuKey: MenuKey.INSERT_COL_LEFT
          },
          {
            name: '在右侧插入列',
            menuKey: MenuKey.INSERT_COL_RIGHT
          }
        ]
      },
      {
        name: '删除',
        menuKey: 'delete',
        items: [
          {
            name: '删除行',
            menuKey: MenuKey.DELETE_ROW
          },
          {
            name: '删除列',
            menuKey: MenuKey.DELETE_COL
          }
        ]
      },
      {
        name: '清除内容',
        menuKey: MenuKey.DELETE
      },
      {
        type: 'separator'  // 分隔线
      },
      {
        name: '复制',
        menuKey: MenuKey.COPY
      },
      {
        name: '粘贴',
        menuKey: MenuKey.PASTE
      },
      {
        name: '剪切',
        menuKey: MenuKey.CUT
      }
    ]
  }
});
```

## 菜单管理器

可以通过`MenuManager`在代码中动态管理菜单：

```typescript
// 获取菜单管理器
const menuManager = sheetInstance.getMenuManager();

// 添加菜单项
menuManager.addMenuItem({
  name: '新菜单项',
  menuKey: 'new-item',
  description: '这是新添加的菜单项'
}, 'file');  // 添加到'file'菜单下

// 移除菜单项
menuManager.removeMenuItem('new-item');

// 启用或禁用菜单项
menuManager.enableMenuItem('export', false);  // 禁用导出菜单
menuManager.enableMenuItem('export', true);   // 启用导出菜单

// 显示或隐藏菜单项
menuManager.showMenuItem('edit', false);  // 隐藏编辑菜单
menuManager.showMenuItem('edit', true);   // 显示编辑菜单
```

## 动态上下文菜单

可以根据当前选中的单元格动态调整右键菜单内容：

```typescript
sheetInstance.on('beforeContextMenu', (event) => {
  const { rowIndex, columnIndex, menuItems } = event;
  
  // 为数值列添加特殊菜单
  if (columnIndex > 0) {
    const cell = sheetInstance.getActiveSheet().getCell(rowIndex, columnIndex);
    if (typeof cell === 'number') {
      // 添加数值操作菜单
      menuItems.push({
        name: '数值操作',
        items: [
          {
            name: '求平均值',
            menuKey: 'avg-column'
          },
          {
            name: '求总和',
            menuKey: 'sum-column'
          }
        ]
      });
    }
  }
  
  // 移除不适用的菜单项
  if (rowIndex === 0) {
    // 表头行不显示插入行和删除行
    menuItems.forEach((item, index) => {
      if (item.menuKey === 'insert' || item.menuKey === 'delete') {
        menuItems.splice(index, 1);
      }
    });
  }
});
```

## 菜单项配置

每个菜单项支持以下配置选项：

| 选项 | 类型 | 说明 |
|------|------|------|
| name | string | 菜单项显示的名称 |
| menuKey | string | 菜单项的唯一标识符 |
| description | string | 鼠标悬停时显示的提示信息 |
| shortcut | string | 快捷键提示，如'Ctrl+C' |
| icon | string | 菜单项图标（支持图标名称或URL） |
| items | array | 子菜单项数组 |
| type | string | 菜单项类型，'item'(默认)或'separator'(分隔线) |
| disabled | boolean | 是否禁用菜单项 |
| hidden | boolean | 是否隐藏菜单项 |

## 完整示例：自定义菜单

下面是一个完整的自定义菜单示例：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [/* 表格配置 */],
  
  // 主菜单配置
  mainMenu: {
    show: true,
    items: [
      {
        name: '文件',
        menuKey: 'file',
        items: [
          {
            name: '导入',
            menuKey: MenuKey.IMPORT,
            icon: 'import-icon'
          },
          {
            name: '导出',
            menuKey: 'export',
            items: [
              {
                name: '导出CSV',
                menuKey: MenuKey.EXPORT_CURRENT_SHEET_CSV
              },
              {
                name: '导出Excel',
                menuKey: MenuKey.EXPORT_CURRENT_SHEET_XLSX
              },
              {
                name: '导出所有表格',
                menuKey: MenuKey.EXPORT_ALL_SHEETS_XLSX
              }
            ]
          },
          { type: 'separator' },
          {
            name: '打印',
            menuKey: 'print',
            shortcut: 'Ctrl+P'
          }
        ]
      },
      {
        name: '编辑',
        menuKey: 'edit',
        items: [
          {
            name: '撤销',
            menuKey: MenuKey.UNDO,
            shortcut: 'Ctrl+Z'
          },
          {
            name: '重做',
            menuKey: MenuKey.REDO,
            shortcut: 'Ctrl+Y'
          },
          { type: 'separator' },
          {
            name: '复制',
            menuKey: MenuKey.COPY,
            shortcut: 'Ctrl+C'
          },
          {
            name: '粘贴',
            menuKey: MenuKey.PASTE,
            shortcut: 'Ctrl+V'
          },
          {
            name: '剪切',
            menuKey: MenuKey.CUT,
            shortcut: 'Ctrl+X'
          }
        ]
      },
      {
        name: '数据',
        menuKey: 'data',
        items: [
          {
            name: '排序',
            menuKey: 'sort',
            items: [
              {
                name: '升序排序',
                menuKey: 'sort-asc'
              },
              {
                name: '降序排序',
                menuKey: 'sort-desc'
              }
            ]
          },
          {
            name: '过滤',
            menuKey: 'filter'
          },
          { type: 'separator' },
          {
            name: '数据验证',
            menuKey: 'data-validation'
          }
        ]
      },
      {
        name: '视图',
        menuKey: 'view',
        items: [
          {
            name: '显示公式',
            menuKey: 'show-formulas'
          },
          {
            name: '显示网格线',
            menuKey: 'show-gridlines'
          }
        ]
      }
    ]
  },
  
  // 右键菜单配置
  contextMenu: {
    enable: true
    // 使用默认右键菜单
  }
});

// 监听菜单点击事件
sheetInstance.on('menuClick', (event) => {
  const { menuKey, rowIndex, columnIndex } = event;
  
  // 处理自定义菜单项
  switch (menuKey) {
    case 'sort-asc':
      sortColumn(sheetInstance, columnIndex, 'asc');
      break;
    case 'sort-desc':
      sortColumn(sheetInstance, columnIndex, 'desc');
      break;
    case 'print':
      printSheet(sheetInstance);
      break;
    case 'show-formulas':
      toggleFormulasDisplay(sheetInstance);
      break;
    case 'show-gridlines':
      toggleGridlines(sheetInstance);
      break;
  }
});

// 自定义功能实现
function sortColumn(sheet, columnIndex, direction) {
  // 排序实现...
  console.log(`对列 ${columnIndex} 进行${direction === 'asc' ? '升序' : '降序'}排序`);
}

function printSheet(sheet) {
  // 打印实现...
  console.log('打印表格');
}

function toggleFormulasDisplay(sheet) {
  // 切换公式显示状态...
  console.log('切换公式显示');
}

function toggleGridlines(sheet) {
  // 切换网格线显示状态...
  console.log('切换网格线显示');
}
```

通过这些菜单功能，VTable-Sheet能够提供丰富的用户交互体验，帮助用户高效操作和管理表格数据。

【注：此处需要添加主菜单和右键菜单的效果截图】
