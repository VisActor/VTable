# 快速上手

本章节介绍VTable-Sheet组件的快速上手，包括安装、基本配置和创建第一个电子表格。

## 安装

使用npm或yarn安装VTable-Sheet组件：

```bash
# 使用npm
npm install @visactor/vtable-sheet

# 使用yarn
yarn add @visactor/vtable-sheet
```

## 基本用法

### 引入组件

```typescript
// ES模块方式引入
import { VTableSheet } from '@visactor/vtable-sheet';

// 或使用CommonJS方式
const { VTableSheet } = require('@visactor/vtable-sheet');
```

### 创建基础表格

以下是创建一个简单表格的示例：

```typescript
// 创建表格实例
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  showFormulaBar: true,  // 显示公式栏
  showSheetTab: true,    // 显示底部表格页切换栏
  defaultRowHeight: 25,  // 默认行高
  defaultColWidth: 100,  // 默认列宽
  sheets: [
    {
      sheetKey: 'sheet1',   // 表格页唯一标识
      sheetTitle: '表格1',  // 表格页显示名称
      columns: [            // 列定义
        { title: '姓名', width: 100 },
        { title: '年龄', width: 80 },
        { title: '部门', width: 120 }
      ],
      data: [               // 表格数据
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部'],
        ['王五', 25, '人事部']
      ],
      active: true          // 设置为当前激活的表格页
    }
  ]
});
```

## 配置选项

VTableSheet组件支持丰富的配置选项：

### 顶层配置

| 选项名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| showFormulaBar | boolean | false | 是否显示公式栏 |
| showSheetTab | boolean | false | 是否显示底部表格页切换栏 |
| defaultRowHeight | number | 25 | 默认行高 |
| defaultColWidth | number | 100 | 默认列宽 |
| sheets | ISheetDefine[] | [] | 表格页定义数组 |
| theme | ITheme | - | 表格主题配置 |
| VTablePluginModules | Array | [] | 插件模块配置,可以将VTable支持的插件配置到VTableSheet中，也可以禁用掉某些已经内置使用的插件。插件的配置项请参考[VTable-Plugins](../plugin/usage) |
| mainMenu | IMainMenu | - | 主菜单配置 |

### 工作表配置 (ISheetDefine)

| 选项名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| sheetKey | string | - | 工作表唯一标识 |
| sheetTitle | string | - | 工作表显示名称 |
| columns | IColumnDefine[] | [] | 列定义数组。如果没有配置columns，实际的title在data中，可以配合设置firstRowAsHeader来实现第一行作为表头。如果不想要第一行作为表头，可以配置showHeader为false。|
| data | any[][] | [] | 表格数据,目前仅支持二维数组不支持json格式数据 |
| active | boolean | false | 是否为当前激活的工作表 |
| showHeader | boolean | true | 是否显示表头 |
| firstRowAsHeader | boolean | false | 是否将第一行作为表头 |
| filter | boolean \| object | false | 是否启用过滤功能 |
| columnCount | number | - | 列数量(当不指定columns时使用) |
| rowCount | number | - | 行数量 |
| frozenRowCount | number | 0 | 冻结的行数量 |
| frozenColCount | number | 0 | 冻结的列数量 |
| cellMerge | ICellMerge[] | [] | 单元格合并配置 |

**注意：**

**columns非必填字段，当设置了columns，表格会将其作为表头，具有VTable表头的所有特性。**

**如果columns未设置或者是空数组，表格会有一行空表头，如果不想展示这行空表头可以设置showHeader为false，那么会只展示data作为表格body的数据。**

**如果想直接将data的第一行作为表头，可以配合设置firstRowAsHeader来实现。也可以调用接口setFirstRowAsHeader来实现。**

## 实例方法

VTableSheet实例提供了以下常用方法：

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|-------|------|
| getActiveSheet | - | WorkSheet | 获取当前激活的工作表 |
| getSheetByKey | sheetKey: string | WorkSheet | 根据key获取工作表 |
| addSheet | sheetDefine: ISheetDefine | WorkSheet | 添加新的工作表 |
| removeSheet | sheetKey: string | boolean | 删除指定的工作表 |
| getFilterManager | - | FilterManager | 获取过滤管理器 |
| getFormulaManager | - | FormulaManager | 获取公式管理器 |
| saveToConfig | - | IVTableSheetOptions | 将当前状态保存为配置对象 |
| exportSheetToFile | fileType: 'csv' \| 'xlsx' | void | 导出当前工作表到文件 |
| importFileToSheet | - | void | 导入文件到当前工作表 |
| release | - | void | 销毁表格实例 |

## 简单示例

下面是一个完整的HTML示例，展示了如何创建和使用VTable-Sheet组件：

```javascript livedemo template=vtable
// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// 容器
const container = document.getElementById(CONTAINER_ID);
// 创建表格实例
const sheet = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "员工信息",
      columns: [
        { title: '姓名', width: 100 },
        { title: '年龄', width: 80 },
        { title: '部门', width: 120 }
      ],
      data: [
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部'],
        ['王五', 25, '技术部']
      ],
      active: true
    }
  ]
}); 
window.sheetInstance = sheet;
```

这个基本的示例展示了如何创建一个简单的表格。在后续章节中，我们将深入介绍更多高级功能的使用方法。
