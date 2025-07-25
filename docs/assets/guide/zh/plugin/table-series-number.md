# 表格序号插件 (TableSeriesNumber)

表格序号插件是 VTable 提供的一个强大功能，用于为表格添加行序号和列序号，使表格数据更易于阅读和定位。本文将详细介绍表格序号插件的功能、配置选项以及使用方法。

## 功能特点

- **行列序号显示**：在表格左侧和顶部分别显示行序号和列序号
- **自动同步表格尺寸**：序号区域会自动同步表格的行高和列宽
- **支持冻结行列**：与表格的冻结行列功能完美配合
- **支持选择交互**：点击序号可以选择整行或整列
- **支持拖拽调整大小**：可以通过拖拽调整行高和列宽

## 安装

```bash
# 使用 npm
npm install @visactor/vtable-plugins

# 使用 yarn
yarn add @visactor/vtable-plugins

# 使用 pnpm
pnpm add @visactor/vtable-plugins
```

## 基本使用

### 引入插件

```typescript
import * as VTable from '@visactor/vtable';
import { TableSeriesNumber } from '@visactor/vtable-plugins';
```

### 创建插件实例

```typescript
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 1000,  // 行数
  colCount: 100,   // 列数
  colSeriesNumberHeight: 30,  // 列序号高度
  rowSeriesNumberWidth: 40    // 行序号宽度
});
```

### 在表格选项中使用插件

```typescript
const option: VTable.ListTableConstructorOptions = {
  // 其他表格配置...
  plugins: [tableSeriesNumberPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

## 配置选项

表格序号插件支持以下配置选项：

| 选项名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| rowCount | number | - | 表格行数，必填 |
| colCount | number | - | 表格列数，必填 |
| colSeriesNumberHeight | number | 30 | 列序号区域的高度 |
| rowSeriesNumberWidth | number | 30 | 行序号区域的宽度 |
| rowSeriesNumberGenerate | (rowIndex: number) => string \| number | 数字递增 | 自定义行序号生成函数 |
| colSeriesNumberGenerate | (colIndex: number) => string \| number | 字母递增 | 自定义列序号生成函数 |
| rowSeriesNumberCellStyle | object | - | 行序号单元格样式 |
| colSeriesNumberCellStyle | object | - | 列序号单元格样式 |
| cornerCellStyle | object | - | 左上角单元格样式 |

## 高级功能

### 自定义序号生成

你可以自定义行列序号的生成规则，例如使用字母作为列序号：

```typescript
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 100,
  colCount: 26,
  colSeriesNumberGenerate: (colIndex) => {
    // 将列索引转换为字母 (A, B, C, ...)
    return String.fromCharCode(65 + colIndex);
  }
});
```

### 自定义样式

可以自定义序号单元格的样式：

```typescript
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 100,
  colCount: 26,
  rowSeriesNumberCellStyle: {
      text: {
        fontSize: 14,
        fill: '#7A7A7A',
        pickable: false,
        textAlign: 'left',
        textBaseline: 'middle',
        padding: [2, 4, 2, 4]
      },
      borderLine: {
        stroke: '#D9D9D9',
        lineWidth: 1,
        pickable: false
      },
      bgColor: '#F9F9F9',
      states: {
        hover: {
          fill: '#98C8A5',
          opacity: 1
        },
        select: {
          fill: 'yellow',
          opacity: 1
        }
      }
    },
    colSeriesNumberCellStyle: {
      text: {
        fontSize: 14,
        fill: '#7A7A7A',
        pickable: false,
        textAlign: 'left',
        textBaseline: 'middle',
        padding: [2, 4, 2, 4]
      },
      borderLine: {
        stroke: '#D9D9D9',
        lineWidth: 1,
        pickable: false
      },
      bgColor: '#F9F9F9',
      states: {
        hover: {
          fill: '#98C8A5',
          opacity: 1
        },
        select: {
          fill: 'orange',
          opacity: 1
        }
      }
    },
    cornerCellStyle: {
      borderLine: {
        stroke: '#D9D9D9',
        lineWidth: 1,
        pickable: false
      },
      bgColor: '#F9F9F9',
      states: {
        hover: {
          fill: '#98C8A5',
          opacity: 0.7
        },
        select: {
          fill: '#98C8A5',
          opacity: 0.7
        }
      }
    }
});
```

## 交互功能

表格序号插件提供了丰富的交互功能：

### 行列选择

- 点击行序号：选择整行
- 点击列序号：选择整列
- 点击左上角：选择整个表格
- 按住 Ctrl/Command 键点击：多选行或列
- 按住 Shift 键点击：范围选择

### 调整大小

- 在行序号边缘拖动：调整行高
- 在列序号边缘拖动：调整列宽

## 完整示例

下面是一个完整的示例，展示了如何使用表格序号插件：

```javascript livedemo template=vtable

// 创建表格序号插件
const tableSeriesNumberPlugin = new VTablePlugins.TableSeriesNumber({
  rowCount: 100,
  colCount: 30,
  colSeriesNumberHeight: 30,
  rowSeriesNumberWidth: 40,
  rowSeriesNumberCellStyle: {
    text: {
        fontSize: 14,
        fill: '#7A7A7A',
        pickable: false,
        textAlign: 'left',
        textBaseline: 'middle',
        padding: [2, 4, 2, 4]
      },
      borderLine: {
        stroke: '#D9D9D9',
        lineWidth: 1,
        pickable: false
      },
      bgColor: '#F9F9F9',
      states: {
        hover: {
          fill: '#98C8A5',
          opacity: 1
        },
        select: {
          fill: 'yellow',
          opacity: 1
        }
      }
  }
});

// 定义表格列
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'name',
    title: '姓名',
    width: 120
  },
  {
    field: 'age',
    title: '年龄',
    width: 80
  },
  // 更多列...
];

// 生成表格数据
const records = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + Math.floor(Math.random() * 20)
}));

// 创建表格实例
const option = {
  records,
  columns,
  frozenColCount: 1,
  plugins: [tableSeriesNumberPlugin],
   select: {
        makeSelectCellVisible: false
      },
};

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
```

