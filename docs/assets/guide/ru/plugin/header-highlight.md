# Highlight Header When Cell Selected Plugin

Vтаблица provides a plugin к highlight the corresponding headers when a cell is selected, supporting highlighting из row и column headers.

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/head-highlight.png" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## Header Highlight Plugin Configuration Options

- `HighlightHeaderWhenSelectCellPlugin` Header highlight when cell selected plugin, can be configured с Следующий parameters:
  - `columnHighlight` Whether к highlight column headers
  - `rowHighlight` Whether к highlight row headers
  - `colHighlightBGColor` Column header highlight фон цвет
  - `rowHighlightBGColor` Row header highlight фон цвет
  - `colHighlightColor` Column header highlight шрифт цвет
  - `rowHighlightColor` Row header highlight шрифт цвет
 
Plugin параметр types:
```
интерфейс IHighlightHeaderWhenSelectCellPluginOptions {
  rowHighlight?: логический;
  colHighlight?: логический;
  colHighlightBGColor?: строка;
  colHighlightColor?: строка;
  rowHighlightBGColor?: строка;
  rowHighlightColor?: строка;
}
```

## Usвозраст пример:


```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

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

  const highlightPlugin = новый VтаблицаPlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
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

    plugins: [highlightPlugin]
  };
  const таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
  window.таблицаInstance = таблицаInstance;
```

для specific usвозраст, refer к the [демонстрация](../../демонстрация/interaction/head-highlight)
