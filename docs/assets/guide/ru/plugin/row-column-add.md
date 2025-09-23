# Row и Column Addition Plugin

## Introduction

AddRowColumnPlugin is a plugin designed к extend Vтаблица с dynamic row и column addition capabilities.

This plugin monitors the `vтаблица` instance's `MOUSEENTER_CELL`, `MOUSELEAVE_CELL`, и `MOUSELEAVE_таблица` событиеs!

When the mouse hovers over a таблица cell, dots и plus signs для adding rows и columns will be displayed; when the mouse leaves the таблица cell, these indicators will be скрытый.

## Plugin Configuration

Configuration options для the row и column addition plugin:

```ts
export интерфейс AddRowColumnOptions {
  /**
   * Whether к включить column addition
   */
  addColumnEnable?: логический;
  /**
   * Whether к включить row addition
   */
  addRowEnable?: логический;
  /**
   * обратный вызов функция для adding a column
   */
  addColumnCallback?: (col: число) => void;
  /**
   * обратный вызов функция для adding a row
   */
  addRowCallback?: (row: число) => void;
}
```

## Plugin пример
Initialize the plugin объект и add it к the vтаблица configuration's plugins.
```
const addRowColumn = новый AddRowColumnPlugin();
const option = {
  records,
  columns,
  заполнение: 30,
  plugins: [addRowColumn]
};
```
к control the content из newly added row данные и update данные и column information after adding columns, Вы можете use the configuration options provided по the plugin. When initializing the plugin объект, provide hoхорошо functions для adding rows и columns, и set the values для новый rows или column information в these functions.
```ts
 const addRowColumn = новый AddRowColumnPlugin({
    addColumnCallback: col => {
      columns.splice(addColIndex, 0, {
          поле: ``,
          заголовок: `новый Column ${col}`,
          ширина: 100
        });
      this.таблица.updateColumns(columns);
      const newRecords = таблицаInstance.records.map(record => {
        if (массив.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        возврат record;
      });
      таблицаInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      таблицаInstance.addRecord([], row - таблицаInstance.columnHeaderLevelCount);
    }
  });
```

Runnable пример:

```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins
  const addRowColumn = новый VтаблицаPlugins.AddRowColumnPlugin();
const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'beijing',
    imвозраст:
      '<svg ширина="16" высота="16" viewBox="0 0 48 48" fill="никто" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linecap="round" strхорошоe-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linejoin="round"/></svg>'
  }));
};

  const option = {
    records: generatePersons(20),
    rowSeriesNumber: {},
    columns:[
    {
      поле: 'email1',
      заголовок: 'email',
      ширина: 200,
      сортировка: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },

        {
          поле: 'имя',
          заголовок: 'первый имя',
          ширина: 200
        },
        {
          поле: 'имя',
          заголовок: 'последний имя',
          ширина: 200
        },

    {
      поле: 'date1',
      заголовок: 'birthday',
      ширина: 200
    },
    {
      поле: 'sex',
      заголовок: 'sex',
      ширина: 100
    }
  ],

    plugins: [addRowColumn]
  };
  const таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
  window.таблицаInstance = таблицаInstance;
```
