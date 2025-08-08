# Table Series Number

Table Series Number is a powerful feature provided by VTable to add row and column numbers to the table, making it easier to read and locate the data. This article will detail the features, configuration options, and usage methods of the table series number plugin.

## Features

- **Display row and column numbers**: Display row and column numbers on the left and top of the table
- **Automatically synchronize table dimensions**: The number area will automatically synchronize the row height and column width of the table
- **Support frozen rows and columns**: Perfectly compatible with the frozen rows and columns function of the table
- **Support selection interaction**: Clicking on the number can select an entire row or column
- **Support drag-and-drop resizing**: Can adjust row height and column width by dragging

## Installation

```bash
# Use npm
npm install @visactor/vtable-plugins

# Use yarn
yarn add @visactor/vtable-plugins

# Use pnpm
pnpm add @visactor/vtable-plugins
```

## Basic usage

### Import plugin

```typescript
import * as VTable from '@visactor/vtable';
import { TableSeriesNumber } from '@visactor/vtable-plugins';
```

### Create plugin instance

```typescript
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 1000,  // row count
  colCount: 100,   // column count
  colSeriesNumberHeight: 30,  // column number height
  rowSeriesNumberWidth: 40    // row number width
});
```

### Use in table options

```typescript
const option: VTable.ListTableConstructorOptions = {
  // other table options...
  plugins: [tableSeriesNumberPlugin]
};

const tableInstance = new VTable.ListTable(document.getElementById('container'), option);
```

## Configuration options

The table series number plugin supports the following configuration options:

| 选项名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| rowCount | number | - | row count, required |
| colCount | number | - | column count, required |
| colSeriesNumberHeight | number | 30 | column number height |
| rowSeriesNumberWidth | number | 30 | row number width |
| rowSeriesNumberGenerate | (rowIndex: number) => string \| number | number increment | custom row number generation function |
| colSeriesNumberGenerate | (colIndex: number) => string \| number | letter increment | custom column number generation function |
| rowSeriesNumberCellStyle | object | - | row number cell style |
| colSeriesNumberCellStyle | object | - | column number cell style |
| cornerCellStyle | object | - | top-left cell style |

## Advanced features

### Custom number generation

You can customize the generation rules for row and column numbers, for example, using letters as column numbers:

```typescript
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 100,
  colCount: 26,
  colSeriesNumberGenerate: (colIndex) => {
      // convert column index to letters
    return String.fromCharCode(65 + colIndex);
  }
});
```

### Custom cell style

You can customize the style of the number cells:

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
          opacity: 0.7
        },
        select: {
          fill: 'yellow',
          opacity: 0.7
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

## Interactive features

The table series number plugin provides rich interactive features:

### Row and column selection

- Click on the row number: select an entire row
- Click on the column number: select an entire column
- Click on the top-left corner: select the entire table
- Hold Ctrl/Command key and click: multi-select rows or columns
- Hold Shift key and click: range selection

### Resize

- Drag on the row number edge: adjust row height
- Drag on the column number edge: adjust column width

## Complete example

Here is a complete example showing how to use the table series number plugin:

```javascript livedemo template=vtable

// create table series number plugin
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

// define table columns
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'name',
    title: 'Name',
    width: 120
  },
  {
    field: 'age',
    title: 'Age',
    width: 80
  },
  // more columns...
];

// generate table data
const records = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `User${i + 1}`,
  age: 20 + Math.floor(Math.random() * 20)
}));

// create table instance
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

