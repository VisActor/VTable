# 自动填充插件（AutoFillPlugin）

## 简介

自动填充插件（AutoFillPlugin）为 VTable 表格提供了强大的数据自动填充功能，支持智能识别数据模式并自动填充到指定范围。通过此插件，用户可以快速复制数据、生成序列数据，大大提升表格数据录入和处理的效率。该功能参考了 [Univer](https://github.com/dream-num/univer) 的优秀实现。

## 功能特点

- 支持多种填充模式（复制填充、序列填充）
- 智能识别数据类型和模式（数字、日期、文本等）
- 支持多方向填充（向上、向下、向左、向右）
- 自动检测连续数据模式并应用相应规则

## 基本使用

以下是 AutoFillPlugin 插件的基本使用方法：

```typescript
import * as VTable from '@visactor/vtable';
import { AutoFillPlugin } from '@visactor/vtable-plugins';

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
    { name: '王五', age: 22, gender: '女' }
  ],
  excelOptions: {
    fillHandle: true // 启用填充炳功能
  },
  plugins: [new AutoFillPlugin()]
});
```

## 使用方法

### 1. 选择单元格，拖拽选区右下角的方块

拖拽完成后，会弹出填充选项菜单：

- **复制填充**：将源数据复制到目标范围
- **序列填充**：根据源数据模式生成序列数据

### 2. 快速填充，双击右下角方块，快速向下填充

## 配置项

### 可用配置项

| 配置项         | 类型                 | 说明                                                                                |
| -------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `fillMode`     | `'copy' \| 'series'` | 拖拽填充时的默认填充模式（`copy`为复制，`series`为序列 ），不填则会打开填充模式菜单 |
| `fastFillMode` | `'copy' \| 'series'` | 双击快速填充时的默认填充模式，不填则会打开填充模式菜单                              |

```typescript
const autoFillPlugin = new VTablePlugins.AutoFillPlugin({
  fastFillMode: 'copy',
  fillMode: 'series'
});
```

## 填充规则

### 内置规则

插件内置了多种数据识别规则：

#### 1. 日期规则 (优先级: 1100)

- **识别条件**：自动检测日期格式字符串
- **序列填充**：基于日偏移量生成连续日期
- **支持格式**：
  - ISO 格式：`2024-01-01` 或 `2024-1-1`
  - 斜杠格式：`2024/01/01` 或 `2024/1/1`
  - 中文格式：`2024年1月1日`
  - 美式格式：`01/01/2024`

**示例**：

```
输入：2024-01-01, 2024-01-02, 2024-01-03
填充：2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04, 2024-01-05
```

#### 2. 数字规则 (优先级: 1000)

- **识别条件**：纯数字或可转换为数字的字符串
- **序列填充**：基于等差数列模式生成序列
- **智能识别**：自动检测步长和方向

**示例**：

```
输入：1, 3, 5, 7
填充：1, 3, 5, 7, 9, 11, 13, 15 (步长: 2)

输入：10, 20, 30
填充：10, 20, 30, 40, 50, 60 (步长: 10)

输入：100, 90, 80
填充：100, 90, 80, 70, 60, 50 (步长: -10)
```

#### 3. 扩展数字规则 (优先级: 900)

- **识别条件**：文本中包含数字的模式
- **序列填充**：保持前后文本不变，数字部分按序列递增

**示例**：

```
输入：项目1, 项目2, 项目3
填充：项目1, 项目2, 项目3, 项目4, 项目5, 项目6

输入：第1章, 第2章, 第3章
填充：第1章, 第2章, 第3章, 第4章, 第5章, 第6章

输入：A1, A2, A3
填充：A1, A2, A3, A4, A5, A6
```

#### 4. 中文数字规则 (优先级: 830)

- **识别条件**：中文数字（一、二、三...）
- **序列填充**：按中文数字序列或星期序列填充

**示例**：

```
输入：一, 二, 三
填充：一, 二, 三, 四, 五, 六, 七, 八, 九, 十

```

#### 5. 中文星期规则 (优先级: 820-810)

- **识别条件**：中文星期格式
- **序列填充**：按星期序列循环填充

**示例**：

```
输入：周一, 周二, 周三
填充：周一, 周二, 周三, 周四, 周五, 周六, 周日, 周一

输入：星期一, 星期二, 星期三
填充：星期一, 星期二, 星期三, 星期四, 星期五, 星期六, 星期日, 星期一
```

#### 6. 循环序列规则 (优先级: 800)

- **识别条件**：预定义的循环序列
- **序列填充**：按循环模式填充

**示例**：

```
输入：一月, 二月, 三月
填充：一月, 二月, 三月, 四月, 五月, 六月, 七月, 八月, 九月, 十月, 十一月, 十二月
```

### 数据片段识别

插件能够智能识别连续且类型相同的数据，将它们合并为一个数据片段。例如：输入 `1, 3, 5, "abc", 7, 9` 会被识别为数字片段 `[1, 3, 5]`（等差数列）、文本片段 `["abc"]`、数字片段 `[7, 9]`（等差数列），每个片段会基于其数据类型应用相应的填充规则。

## 完整示例

以下是一个完整的示例，展示了如何使用填充炳功能：

```typescript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 生成示例数据
const generateTestData = count => {
  return Array.from(new Array(count)).map((_, i) => {
    return i <= 2
      ? {
          id: i + 1,
          name: `第${i + 1}章`,
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
    title: '章节',
    width: 150
  },
  {
    field: 'arithmetic',
    title: '等差',
    width: 120
  },
  {
    field: 'geometric',
    title: '等比',
    width: 120
  },
  {
    field: 'date',
    title: '日期',
    width: 120
  },
  {
    field: 'week',
    title: '星期',
    width: 120
  },
  {
    field: 'chineseNumber',
    title: '中文数字',
    width: 120
  },
  {
    field: 'otherDirection_1',
    title: '向其他方向拖拽',
    width: 150
  },
  {
    field: 'otherDirection_2',
    title: '',
    width: 120
  }
];

// 创建自动填充插件
const autoFillPlugin = new VTablePlugins.AutoFillPlugin();

// 创建表格配置
const option = {
  columns,
  records,
  excelOptions: {
    fillHandle: true // 启用填充炳功能
  },
  plugins: [autoFillPlugin]
};

// 创建表格实例
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

## 许可证说明

本插件的填充炳功能参考了 [Univer](https://github.com/dream-num/univer) 的实现，该部分代码遵循 Apache 2.0 许可证。详情请参考项目的 LICENSE-APACHE 文件。
