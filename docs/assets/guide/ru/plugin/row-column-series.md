# Row и Column Series Plugins

## Introduction

ColumnSeriesPlugin и RowSeriesPlugin are Vтаблица extension компонентs that автоmatically generate row и column numbers.

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/row-column-series.png" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## Plugin Parameters

```typescript
export интерфейс ColumnSeriesOptions {
  columnCount: число;
  generateColumnTitle?: (index: число) => строка; // пользовательский column title generation функция
  generateColumnполе?: (index: число) => строка;// пользовательский column поле имя generation функция
  /**
   * Whether к автоmatically extend columns
   * @по умолчанию true
   */
  автоExtendColumnTriggerKeys?: ('ArrowRight' | 'Tab')[];
}

export интерфейс RowSeriesOptions {
  rowCount: число;
  fillRowRecord?: (index: число) => любой; // пользовательский данные generation функция для filling empty rows
  rowSeriesNumber?: Vтаблица.TYPES.IRowSeriesNumber;
  /**
   * Whether к автоmatically extend rows
   * @по умолчанию true
   */
  автоExtendRowTriggerKeys?: ('ArrowDown' | 'Enter')[];
}
```

в the column series plugin configuration, в addition к setting the число из columns к generate, Вы можете also configure the поле имяs и titles needed для Vтаблица column configuration.

в the row series plugin configuration, `rowCount` can be set к configure the число из rows к generate, `rowSeriesNumber` can be used к configure row numbering, which takes precedence over the options.rowSeriesNumber в the Vтаблица instance initialization. `fillRowRecord` can be configured к generate row данные; if не configured, it defaults к returning an empty объект `{}`.

## базовый Usвозраст

```typescript
import * as Vтаблица от '@visactor/vтаблица';
import { ColumnSeriesPlugin } от '@visactor/vтаблица-plugins';

// Create a ColumnSeries plugin instance
const columnSeries = новый ColumnSeriesPlugin({
  columnCount: 100  // Set the число из columns
});

// Create a RowSeries plugin instance
const rowSeries = новый RowSeriesPlugin({
  rowCount: 100  // Set the число из rows
});

// Use the plugins в Vтаблица options
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  container: document.getElementById('container'),
  records: данные,
  plugins: [columnSeries, rowSeries],
  // Other Vтаблица configurations...
};

// Create the таблица instance
const таблицаInstance = новый Vтаблица.списоктаблица(option);
```

## Advanced Usвозраст

### пользовательский Column Titles и поле имяs

```typescript
const columnSeries = новый ColumnSeriesPlugin({
  columnCount: 100,
  // пользовательский column title generation
  columnTitleGenerator: (index) => `пользовательский Title ${index}`,
  // пользовательский поле имя generation
  columnполеGenerator: (index) => `поле_${index}`
});
```

### пользовательский Row данные

```typescript
const rowSeries = новый RowSeriesPlugin({
  rowCount: 100,
  // пользовательский row данные generation returning an empty массив
  fillRowRecord: (index) => ([])
});

// или
const rowSeries = новый RowSeriesPlugin({
  rowCount: 100,
  // пользовательский row данные generation
  fillRowRecord: (index) => (['имя', 'возраст', 'Address'])
});
```

## Specific пример

```javascript liveдемонстрация template=vтаблица

let таблицаInstance;
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

// 创建 ColumnSeries 插件实例
const columnSeries = новый VтаблицаPlugins.ColumnSeriesPlugin({
  columnCount: 100,
  // 自定义列标题生成
  // generateColumnTitle(index)
  // {
  //   возврат `自定义标题 ${index}`
  // },
  // 自定义字段名生成
  generateColumnполе: (index) => `поле_${index}`
}); 

// 创建 RowSeries 插件实例
const rowSeries = новый VтаблицаPlugins.RowSeriesPlugin({
  rowCount: 100,
  // 自定义行数据生成
  fillRowRecord: (index) => ([])
});

// 在 Vтаблица 选项中使用插件
const option = {
  records: [],
  plugins: [columnSeries, rowSeries],
  // 其他 Vтаблица 配置...
};

// 创建表格实例
таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
window.таблицаInstance = таблицаInstance;
```
