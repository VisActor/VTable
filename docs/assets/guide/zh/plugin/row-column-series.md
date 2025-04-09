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
}

export interface RowSeriesOptions {
  rowCount: number;
  fillRowRecord?: (index: number) => any; // 填充空行的 自定义生成数据函数
}
```

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
  // 自定义行数据生成
  fillRowRecord: (index) => ([])
});

// or
const rowSeries = new RowSeriesPlugin({
  rowCount: 100,
  // 自定义行数据生成
  fillRowRecord: (index) => (['姓名', '年龄', '地址'])
});
```
