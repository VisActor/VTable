<div align="center">
  <a href="" target="_blank">
    <img alt="VisActor Logo" width="200" src="https://github.com/VisActor/.github/blob/main/profile/500_200.svg"/>
  </a>
</div>

<div align="center">
  <h1>VTable-Sheet</h1>
</div>

<div align="center">

VTable-Sheet 是一个基于 VTable 的轻量级可编辑电子表格组件。它提供类似 Excel 的功能，包括网格编辑、公式支持和单元格格式化，同时通过 Canvas 渲染保持高性能。

<p align="center">
  <a href="https://visactor.io/vtable">介绍</a> •
  <a href="https://visactor.io/vtable">示例</a> •
  <a href="https://visactor.io/vtable">教程</a> •
  <a href="https://visactor.io/vtable">API</a>•
</p>

[![npm Version](https://img.shields.io/npm/v/@visactor/vtable-sheet.svg)](https://www.npmjs.com/package/@visactor/vtable-sheet)
[![npm Download](https://img.shields.io/npm/dm/@visactor/vtable-sheet.svg)](https://www.npmjs.com/package/@visactor/vtable-sheet)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/visactor/vtable/blob/main/LICENSE)

</div>

<div align="center">

[English](./README.md) | 简体中文

</div>

# 介绍

VTable-Sheet 是 VisActor 可视化系统中的一个轻量级可编辑电子表格组件，基于表格组件 VTable。它通过 Canvas 渲染提供类似 Excel 的功能和高性能。核心能力如下：

1. **高性能**：支持大数据集的快速计算和渲染，即使处理数千个单元格也能确保流畅的编辑体验。
2. **直观编辑**：提供熟悉的电子表格编辑体验，包括键盘导航、单元格选择和原位编辑。
3. **公式支持**：包含基本公式和计算功能，用于处理和转换数据。
4. **丰富的格式化**：支持各种数据格式和单元格样式选项，清晰地呈现数据。
5. **自定义单元格类型**：为各种数据类型提供不同的单元格编辑器和渲染器。
6. **无缝集成**：与其他 VTable 组件配合良好，可以轻松集成到 Web 应用程序中。

# 使用方法

## 安装

[npm 包](https://www.npmjs.com/package/@visactor/vtable-sheet)

```bash
// npm
npm install @visactor/vtable-sheet

// yarn
yarn add @visactor/vtable-sheet
```

## 快速开始

```javascript
import { Sheet } from '@visactor/vtable-sheet';

// 定义初始数据
const data = [
  ['', 'A', 'B', 'C', 'D', 'E', 'F'],
  ['1', '项目', '数量', '单价', '总价', '税额', '总计'],
  ['2', '部件', 5, 10, '=C2*D2', '=E2*0.1', '=E2+F2'],
  ['3', '小工具', 3, 20, '=C3*D3', '=E3*0.1', '=E3+F3'],
  ['4', '装置', 10, 7.5, '=C4*D4', '=E4*0.1', '=E4+F4'],
  ['5', '', '', '', '=SUM(E2:E4)', '=SUM(F2:F4)', '=SUM(G2:G4)']
];

// 创建表格实例
const sheetInstance = new Sheet(document.getElementById('container'), {
  data: data,
  defaultRowHeight: 25,
  defaultColWidth: 100,
  showRowHeader: true,
  showColHeader: true,
  editable: true,
  theme: 'light'
});

// 添加事件监听器
sheetInstance.on('cellValueChanged', (event) => {
  console.log('单元格值已更改:', event);
});
```

# 功能特性

## 单元格编辑

VTable-Sheet 提供直观的单元格编辑功能：
- 双击或按 Enter 编辑单元格
- 使用 Tab/箭头键导航
- 通过 Shift+箭头或鼠标进行多单元格选择
- 支持复制/粘贴
- 撤销/重做功能

## 公式支持

基本公式支持包括：
- 简单算术运算（+, -, *, /）
- 常用函数（SUM, AVERAGE, MIN, MAX）
- 单元格引用（A1, B2 等）
- 范围引用（A1:C3）
- 自动重新计算

## 格式化

单元格格式化选项：
- 数字格式化（小数位、货币、百分比）
- 日期和时间格式化
- 文本对齐和样式
- 条件格式化
- 自定义单元格渲染

## 数据管理

强大的数据操作：
- 排序和筛选
- 添加/删除行和列
- 导入/导出数据（CSV, JSON）
- 数据验证

# 相关链接

- [官方网站](https://visactor.io/vtable)

# 生态系统

| 项目                                                       | 描述                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| [VTable](https://github.com/VisActor/VTable)                | 高性能多维数据分析表格                                       |
| [VTable-Editors](https://github.com/VisActor/VTable)        | 表格编辑器组件                                               |
| [React-VTable](https://github.com/VisActor/VTable)          | VTable 的 React 包装器                                       |
| [Vue-VTable](https://github.com/VisActor/VTable)            | VTable 的 Vue 包装器                                         |
</rewritten_file> 