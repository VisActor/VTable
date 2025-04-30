# 行列序号插件

## 功能介绍

ColumnSeriesPlugin 和 RowSeriesPlugin 这两个插件 是 VTable 的扩展组件，能够自动生成行列序号。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-column-series.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## 插件参数

```typescript
export interface ColumnSeriesOptions {
  columnCount: number;
  generateColumnTitle?: (index: number) => string; // 自定义列标题生成函数
  generateColumnField?: (index: number) => string;// 自定义列字段名生成函数
  /**
   * 是否自动扩展列
   * @default true
   */
  autoExtendColumnTriggerKeys?: ('ArrowRight' | 'Tab')[];
}

export interface RowSeriesOptions {
  rowCount: number;
  fillRowRecord?: (index: number) => any; // 填充空行的 自定义生成数据函数
  rowSeriesNumber?: VTable.TYPES.IRowSeriesNumber;
  /**
   * 是否自动扩展行
   * @default true
   */
  autoExtendRowTriggerKeys?: ('ArrowDown' | 'Enter')[];
}
```

列序号插件的配置中除了可以配置生成列的数量，以及对应到VTable中columns的配置所需要的字段名field和标题title。

行序号插件的配置中`rowCount`可以配置生成行的数量，`rowSeriesNumber`可以配置行序号的配置,这里配置后比new VTable实例中options.rowSeriesNumber优先级更高。`fillRowRecord`可以配置生成行的数据，如果不配置的话 默认是返回个空对象`{}`。

## 基本用法

```typescript
import * as VTable from '@visactor/vtable';
import { ColumnSeriesPlugin } from '@visactor/vtable-plugins';

// 创建 ColumnSeries 插件实例
const columnSeries = new ColumnSeriesPlugin({
  columnCount: 100  // 设置列数量
});

// 创建 RowSeries 插件实例
const rowSeries = new RowSeriesPlugin({
  rowCount: 100  // 设置行数量
});

// 在 VTable 选项中使用插件
const option: VTable.ListTableConstructorOptions = {
  container: document.getElementById('container'),
  records: data,
  plugins: [columnSeries, rowSeries],
  // 其他 VTable 配置...
};

// 创建表格实例
const tableInstance = new VTable.ListTable(option);
```

## 高级用法

### 自定义列标题和字段名

```typescript
const columnSeries = new ColumnSeriesPlugin({
  columnCount: 100,
  // 自定义列标题生成
  columnTitleGenerator: (index) => `自定义标题 ${index}`,
  // 自定义字段名生成
  columnFieldGenerator: (index) => `field_${index}`
});
```

### 自定义行数据

```typescript
const rowSeries = new RowSeriesPlugin({
  rowCount: 100,
  // 自定义行数据生成 返回一个空数组
  fillRowRecord: (index) => ([])
});

// or
const rowSeries = new RowSeriesPlugin({
  rowCount: 100,
  // 自定义行数据生成
  fillRowRecord: (index) => (['姓名', '年龄', '地址'])
});
```

## 具体示例

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
