# Row and Column Series Plugins

## Introduction

ColumnSeriesPlugin and RowSeriesPlugin are VTable extension components that automatically generate row and column numbers.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-column-series.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## Plugin Parameters

```typescript
export interface ColumnSeriesOptions {
  columnCount: number;
  generateColumnTitle?: (index: number) => string; // Custom column title generation function
  generateColumnField?: (index: number) => string;// Custom column field name generation function
  /**
   * Whether to automatically extend columns
   * @default true
   */
  autoExtendColumnTriggerKeys?: ('ArrowRight' | 'Tab')[];
}

export interface RowSeriesOptions {
  rowCount: number;
  fillRowRecord?: (index: number) => any; // Custom data generation function for filling empty rows
  rowSeriesNumber?: VTable.TYPES.IRowSeriesNumber;
  /**
   * Whether to automatically extend rows
   * @default true
   */
  autoExtendRowTriggerKeys?: ('ArrowDown' | 'Enter')[];
}
```

In the column series plugin configuration, in addition to setting the number of columns to generate, you can also configure the field names and titles needed for VTable column configuration.

In the row series plugin configuration, `rowCount` can be set to configure the number of rows to generate, `rowSeriesNumber` can be used to configure row numbering, which takes precedence over the options.rowSeriesNumber in the VTable instance initialization. `fillRowRecord` can be configured to generate row data; if not configured, it defaults to returning an empty object `{}`.

## Basic Usage

```typescript
import * as VTable from '@visactor/vtable';
import { ColumnSeriesPlugin } from '@visactor/vtable-plugins';

// Create a ColumnSeries plugin instance
const columnSeries = new ColumnSeriesPlugin({
  columnCount: 100  // Set the number of columns
});

// Create a RowSeries plugin instance
const rowSeries = new RowSeriesPlugin({
  rowCount: 100  // Set the number of rows
});

// Use the plugins in VTable options
const option: VTable.ListTableConstructorOptions = {
  container: document.getElementById('container'),
  records: data,
  plugins: [columnSeries, rowSeries],
  // Other VTable configurations...
};

// Create the table instance
const tableInstance = new VTable.ListTable(option);
```

## Advanced Usage

### Custom Column Titles and Field Names

```typescript
const columnSeries = new ColumnSeriesPlugin({
  columnCount: 100,
  // Custom column title generation
  columnTitleGenerator: (index) => `Custom Title ${index}`,
  // Custom field name generation
  columnFieldGenerator: (index) => `field_${index}`
});
```

### Custom Row Data

```typescript
const rowSeries = new RowSeriesPlugin({
  rowCount: 100,
  // Custom row data generation returning an empty array
  fillRowRecord: (index) => ([])
});

// or
const rowSeries = new RowSeriesPlugin({
  rowCount: 100,
  // Custom row data generation
  fillRowRecord: (index) => (['Name', 'Age', 'Address'])
});
```

## Specific Example

```javascript livedemo template=vtable

let tableInstance;
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

// 创建 ColumnSeries 插件实例
const columnSeries = new VTablePlugins.ColumnSeriesPlugin({
  columnCount: 100,
  // 自定义列标题生成
  // generateColumnTitle(index)
  // {
  //   return `自定义标题 ${index}`
  // },
  // 自定义字段名生成
  generateColumnField: (index) => `field_${index}`
}); 

// 创建 RowSeries 插件实例
const rowSeries = new VTablePlugins.RowSeriesPlugin({
  rowCount: 100,
  // 自定义行数据生成
  fillRowRecord: (index) => ([])
});

// 在 VTable 选项中使用插件
const option = {
  records: [],
  plugins: [columnSeries, rowSeries],
  // 其他 VTable 配置...
};

// 创建表格实例
tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
window.tableInstance = tableInstance;
```
