# AutoFillPlugin

## Introduction

The AutoFillPlugin provides powerful data auto-filling capabilities for VTable, supporting intelligent recognition of data patterns and automatic filling to specified ranges. This plugin enables users to quickly copy data and generate sequential data, significantly improving the efficiency of table data entry and processing. This functionality references the excellent implementation from [Univer](https://github.com/dream-num/univer).

## Features

- Supports multiple filling modes (copy fill, series fill)
- Intelligent recognition of data types and patterns (numbers, dates, text, etc.)
- Supports multi-directional filling (up, down, left, right)
- Automatically detects continuous data patterns and applies corresponding rules

## Basic Usage

Here's the basic usage of the AutoFillPlugin:

```typescript
import * as VTable from '@visactor/vtable';
import { AutoFillPlugin } from '@visactor/vtable-plugins';

// Create table instance
const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age' },
    { field: 'gender', title: 'Gender' }
  ],
  records: [
    { name: 'Zhang San', age: 20, gender: 'Male' },
    { name: 'Li Si', age: 25, gender: 'Male' },
    { name: 'Wang Wu', age: 22, gender: 'Female' }
  ],
  excelOptions: {
    fillHandle: true // Enable fill handle functionality
  },
  plugins: [new AutoFillPlugin()]
});
```

## Usage Methods

### 1. Select cells and drag the square at the bottom right corner of the selection

After dragging, a fill option menu will appear:

- **Copy Fill**: Copy source data to target range
- **Series Fill**: Generate sequential data based on source data pattern

### 2. Quick fill by double-clicking the bottom right corner to quickly fill downwards

## Configuration Options

### Available Configuration Items

| Option         | Type                 | Description                                                                                                  |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `fillMode`     | `'copy' \| 'series'` | Default fill mode when dragging (`copy` for copy, `series` for sequence), leaving empty opens fill mode menu |
| `fastFillMode` | `'copy' \| 'series'` | Default fill mode for double-click quick fill, leaving empty opens fill mode menu                            |

```typescript
const autoFillPlugin = new VTablePlugins.AutoFillPlugin({
  fastFillMode: 'copy',
  fillMode: 'series'
});
```

## Filling Rules

### Built-in Rules

The plugin has various built-in data recognition rules:

#### 1. Date Rule (Priority: 1100)

- **Recognition Condition**: Automatically detects date format strings
- **Series Fill**: Generates consecutive dates based on day offsets
- **Supported Formats**:
  - ISO format: `2024-01-01` or `2024-1-1`
  - Slash format: `2024/01/01` or `2024/1/1`
  - Chinese format: `2024年1月1日`
  - American format: `01/01/2024`

**Example**:

```
Input: 2024-01-01, 2024-01-02, 2024-01-03
Fill: 2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04, 2024-01-05
```

#### 2. Number Rule (Priority: 1000)

- **Recognition Condition**: Pure numbers or strings convertible to numbers
- **Series Fill**: Generates sequences based on arithmetic progression patterns
- **Intelligent Recognition**: Automatically detects step size and direction

**Example**:

```
Input: 1, 3, 5, 7
Fill: 1, 3, 5, 7, 9, 11, 13, 15 (Step: 2)

Input: 10, 20, 30
Fill: 10, 20, 30, 40, 50, 60 (Step: 10)

Input: 100, 90, 80
Fill: 100, 90, 80, 70, 60, 50 (Step: -10)
```

#### 3. Extended Number Rule (Priority: 900)

- **Recognition Condition**: Patterns containing numbers within text
- **Series Fill**: Keeps surrounding text unchanged while incrementing numeric parts

**Example**:

```
Input: Project1, Project2, Project3
Fill: Project1, Project2, Project3, Project4, Project5, Project6

Input: Chapter1, Chapter2, Chapter3
Fill: Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6

Input: A1, A2, A3
Fill: A1, A2, A3, A4, A5, A6
```

#### 4. Chinese Number Rule (Priority: 830)

- **Recognition Condition**: Chinese numbers (一, 二, 三...)
- **Series Fill**: Fills according to Chinese number sequence

**Example**:

```
Input: 一, 二, 三
Fill: 一, 二, 三, 四, 五, 六, 七, 八, 九, 十
```

#### 5. Chinese Week Rule (Priority: 820-810)

- **Recognition Condition**: Chinese week formats
- **Series Fill**: Cycles through week sequence

**Example**:

```
Input: 周一, 周二, 周三
Fill: 周一, 周二, 周三, 周四, 周五, 周六, 周日, 周一

Input: 星期一, 星期二, 星期三
Fill: 星期一, 星期二, 星期三, 星期四, 星期五, 星期六, 星期日, 星期一
```

#### 6. Cyclic Sequence Rule (Priority: 800)

- **Recognition Condition**: Predefined cyclic sequences
- **Series Fill**: Fills according to cyclic pattern

**Example**:

```
Input: 一月, 二月, 三月
Fill: 一月, 二月, 三月, 四月, 五月, 六月, 七月, 八月, 九月, 十月, 十一月, 十二月
```

### Data Segment Recognition

The plugin can intelligently identify consecutive data of the same type and merge them into data segments. For example, input `1, 3, 5, "abc", 7, 9` will be recognized as a number segment `[1, 3, 5]` (arithmetic sequence), a text segment `["abc"]`, and a number segment `[7, 9]` (arithmetic sequence). Each segment applies corresponding filling rules based on its data type.

## Complete Example

Here's a complete example demonstrating how to use the fill handle functionality:

```typescript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// Need to import plugin package @visactor/vtable-plugins when using
// import * as VTablePlugins from '@visactor/vtable-plugins';
// Generate sample data
const generateTestData = count => {
  return Array.from(new Array(count)).map((_, i) => {
    return i <= 2
      ? {
          id: i + 1,
          name: `Chapter ${i + 1}`,
          arithmetic: i * 100 + 100,
          geometric: Math.pow(2, i),
          date: new Date(2024, 0, i + 27).toLocaleDateString(),
          week: i < 1 ? `星期一` : null,
          chineseNumber: i < 1 ? `一` : null,
          otherDirection_1: null,
          otherDirection_2: null
        }
      : {};
  });
};
const records = generateTestData(20);

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'name',
    title: 'Chapter',
    width: 150
  },
  {
    field: 'arithmetic',
    title: 'Arithmetic',
    width: 120
  },
  {
    field: 'geometric',
    title: 'Geometric',
    width: 120
  },
  {
    field: 'date',
    title: 'Date',
    width: 120
  },
  {
    field: 'week',
    title: 'Week',
    width: 120
  },
  {
    field: 'chineseNumber',
    title: 'Chinese Num',
    width: 120
  },
  {
    field: 'otherDirection_1',
    title: 'Drag Other Directions',
    width: 150
  },
  {
    field: 'otherDirection_2',
    title: '',
    width: 120
  }
];

// Create auto-fill plugin
const autoFillPlugin = new VTablePlugins.AutoFillPlugin();

// Create table configuration
const option = {
  columns,
  records,
  excelOptions: {
    fillHandle: true // Enable fill handle functionality
  },
  plugins: [autoFillPlugin]
};

// Create table instance
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

## License Notice

The fill handle functionality of this plugin references the implementation from [Univer](https://github.com/dream-num/univer), and this part of the code follows the Apache 2.0 license. For details, please refer to the LICENSE-APACHE file of the project.

# This plugin was contributed by 

[hokkine](https://github.com/hokkine)
