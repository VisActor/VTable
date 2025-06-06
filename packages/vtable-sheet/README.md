<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Sheet</h1>
</div>

<div align="center">

VTable-Sheet is a lightweight editable spreadsheet component based on VTable. It provides Excel-like functionality with grid editing, formula support, and cell formatting while maintaining high performance through canvas rendering.

<p align="center">
  <a href="https://visactor.io/vtable">Introduction</a> •
  <a href="https://visactor.io/vtable">Demo</a> •
  <a href="https://visactor.io/vtable">Tutorial</a> •
  <a href="https://visactor.io/vtable">API</a>•
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable-sheet.svg)](https://www.npmjs.com/package/@visactor/vtable-sheet)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable-sheet.svg)](https://www.npmjs.com/package/@visactor/vtable-sheet)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

English| [简体中文](./README.zh-CN.md)

</div>

# VTable-Sheet

VTable-Sheet是一个基于VTable的轻量级编辑表格组件，提供类Excel的表格编辑功能。

## 特性

- **多Sheet管理**：支持多个工作表，类似Excel的多表格管理
- **公式功能**：支持Excel风格的公式计算，如SUM, AVERAGE, MAX, MIN等
- **过滤功能**：支持值列表过滤和条件过滤
- **排序功能**：支持单列和多列排序
- **跨Sheet引用**：支持在公式中引用其他Sheet的数据
- **数据导入导出**：支持配置的保存和恢复

## 安装

```bash
npm install @visactor/vtable-sheet
```

## 基本用法

```js
import { VTableSheet } from '@visactor/vtable-sheet';

// 创建表格
const sheet = new VTableSheet({
  container: 'container-id',
  showToolbar: true,
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      title: "Sheet 1",
      key: "sheet1",
      data: [
        ["产品", "价格", "数量", "总计"],
        ["产品A", 100, 5, ""],
        ["产品B", 200, 3, ""],
        ["产品C", 150, 2, ""]
      ]
    },
    {
      title: "Sheet 2",
      key: "sheet2",
      data: [
        ["类别", "销售额"],
        ["类别A", 5000],
        ["类别B", 3000],
        ["类别C", 2000]
      ]
    }
  ]
});

// 使用公式
const formulaManager = sheet.getFormulaManager();

// 添加SUM公式到C2单元格
formulaManager.registerFormula({
  sheet: 'sheet1',
  row: 1,
  col: 3
}, 'B2*C2');

// 应用过滤
const filterManager = sheet.getFilterManager();

// 添加条件过滤
filterManager.setFilter('col1', {
  type: 'condition',
  operator: 'greaterThan',
  value: 100
});

// 保存配置
const config = sheet.saveToConfig();
console.log(config);
```

## API参考

### VTableSheet

VTableSheet是主要的类，用于创建和管理表格。

```js
// 创建表格
const sheet = new VTableSheet(options);
```

#### 选项

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| container | HTMLElement \| string | - | 容器元素或ID |
| width | number | container.width | 表格宽度 |
| height | number | container.height | 表格高度 |
| sheets | SheetDefine[] | [] | Sheet定义数组 |
| showToolbar | boolean | true | 是否显示工具栏 |
| showFormulaBar | boolean | true | 是否显示公式栏 |
| showSheetTab | boolean | true | 是否显示Sheet切换栏 |
| theme | string \| object | 'light' | 主题 |
| defaultRowHeight | number | 25 | 默认行高 |
| defaultColWidth | number | 100 | 默认列宽 |
| frozenRowCount | number | 0 | 冻结行数 |
| frozenColCount | number | 0 | 冻结列数 |

#### SheetDefine

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| title | string | - | Sheet标题 |
| key | string | - | Sheet唯一标识 |
| columns | number | - | 列数 |
| rows | number | - | 行数 |
| headers | HeaderDefine[] | - | 表头定义 |
| data | any[][] | - | 表格数据 |
| active | boolean | false | 是否是当前活动sheet |
| cellStyles | Record<string, any> | - | 单元格样式 |
| rowStyles | Record<string, any> | - | 行样式 |
| columnStyles | Record<string, any> | - | 列样式 |

### 公式功能

VTableSheet支持类Excel的公式功能，包括：

- **SUM(range)**: 计算范围内所有值的总和
- **AVERAGE(range)**: 计算范围内所有值的平均值
- **MAX(range)**: 获取范围内的最大值
- **MIN(range)**: 获取范围内的最小值
- **COUNT(range)**: 计算范围内非空值的数量
- **IF(condition, true_value, false_value)**: 条件判断
- **AND(...args)**: 逻辑与
- **OR(...args)**: 逻辑或
- **NOT(value)**: 逻辑非

### 过滤功能

VTableSheet支持两种过滤方式：

1. **值列表过滤**：根据列的唯一值列表进行过滤
2. **条件过滤**：支持多种条件操作符，如等于、大于、包含等

### 示例

更多示例请查看 [examples](./examples) 目录。

## 许可证

MIT

# Introduction

VTable-Sheet is a lightweight editable spreadsheet component in the VisActor visualization system, based on the table component VTable. It provides Excel-like functionality with high performance through canvas rendering. The core capabilities are as follows:

1. **High performance**: Supports fast computation and rendering of large datasets, ensuring smooth editing experience even with thousands of cells.
2. **Intuitive editing**: Provides familiar spreadsheet editing experience with keyboard navigation, cell selection, and in-place editing.
3. **Formula support**: Includes basic formula and calculation capabilities to process and transform data.
4. **Rich formatting**: Supports various data formats and cell styling options to present data clearly.
5. **Custom cell types**: Offers different cell editors and renderers for various data types.
6. **Seamless integration**: Works well with other VTable components and can be easily integrated into web applications.

# Usage

## Installation

[npm package](https://www.npmjs.com/package/@visactor/vtable-sheet)

```bash
// npm
npm install @visactor/vtable-sheet

// yarn
yarn add @visactor/vtable-sheet
```

## Quick Start

```javascript
import { Sheet } from '@visactor/vtable-sheet';

// Define initial data
const data = [
  ['', 'A', 'B', 'C', 'D', 'E', 'F'],
  ['1', 'Item', 'Quantity', 'Price', 'Total', 'Tax', 'Grand Total'],
  ['2', 'Widget', 5, 10, '=C2*D2', '=E2*0.1', '=E2+F2'],
  ['3', 'Gadget', 3, 20, '=C3*D3', '=E3*0.1', '=E3+F3'],
  ['4', 'Doohickey', 10, 7.5, '=C4*D4', '=E4*0.1', '=E4+F4'],
  ['5', '', '', '', '=SUM(E2:E4)', '=SUM(F2:F4)', '=SUM(G2:G4)']
];

// Create sheet instance
const sheetInstance = new Sheet(document.getElementById('container'), {
  data: data,
  defaultRowHeight: 25,
  defaultColWidth: 100,
  showRowHeader: true,
  showColHeader: true,
  editable: true,
  theme: 'light'
});

// Add event listeners
sheetInstance.on('cellValueChanged', (event) => {
  console.log('Cell value changed:', event);
});
```

# Features

## Cell Editing

VTable-Sheet provides intuitive cell editing with:
- Double-click or Enter to edit cells
- Tab/arrow keys for navigation
- Multiple cell selection with Shift+Arrow or mouse
- Copy/paste support
- Undo/redo capability

## Formula Support

Basic formula support includes:
- Simple arithmetic operations (+, -, *, /)
- Common functions (SUM, AVERAGE, MIN, MAX)
- Cell references (A1, B2, etc.)
- Range references (A1:C3)
- Automatic recalculation

## Formatting

Cell formatting options:
- Number formatting (decimal places, currency, percent)
- Date and time formatting
- Text alignment and styling
- Conditional formatting
- Custom cell rendering

## Data Management

Powerful data operations:
- Sorting and filtering
- Add/remove rows and columns
- Import/export data (CSV, JSON)
- Data validation

# Related Links

- [Official website](https://visactor.io/vtable)

# Ecosystem

| Project                                                     | Description                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| [VTable](https://github.com/VisActor/VTable)                | High-performance multidimensional data analysis table        |
| [VTable-Editors](https://github.com/VisActor/VTable)        | Table editor components                                      |
| [React-VTable](https://github.com/VisActor/VTable)          | React wrapper for VTable                                     |
| [Vue-VTable](https://github.com/VisActor/VTable)            | Vue wrapper for VTable                                       |
</rewritten_file> 