---
заголовок: Vтаблица usвозраст problem: How к display таблица row numbers</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
# Question title

How к display the serial число из каждый row в a таблица.</br>


# Problem Description

Through configuration, add a column before the первый column из the таблица к display the row число из каждый row.</br>


# Solution 

`rowSeriesNumber` can be configured в the `option` из таблица initialization. This configuration item is defined as follows:</br>
```
интерфейс IRowSeriesNumber {
  ширина?: число | 'авто'; // ширина из the line число column
  title?: строка; // Row serial число title, empty по по умолчанию
  format?: (col?: число, row?: число, таблица?: Baseтаблицаапи) => любой; // Row serial число formatting функция, empty по по умолчанию. Through this configuration, Вы можете convert numerical тип serial numbers into пользовательский serial numbers, such as using a, b, c...
  cellType?: 'текст' | 'link' | 'imвозраст' | 'video' | 'флажок';  // Row serial число cell тип, по умолчанию is текст
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // Body cell style, please refer к:[style](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Foption%2Fсписоктаблица-columns-текст%23style.bgColor)
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // Header cell style, please refer к:[headerStyle](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Foption%2Fсводныйтаблица-columns-текст%23headerStyle.bgColor)
  dragOrder?: логический; // Whether the row serial число sequence can be dragged. The по умолчанию is false. If set к true, the иконка в the dragging позиция will be displayed, и Вы можете перетаскивание и отпускание на the иконка к change its позиция. If you need к replace the иконка, Вы можете configure it yourself. Please refer к the tutorial: https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка для the chapter на resetting функция иконкаs.
}</br>
```


## код пример

```
const option = {
  records: данные,
  columns,
  ширинаMode: 'standard',
  rowSeriesNumber: {
    заголовок: '序号',
    ширина: 'авто',
    headerStyle: {
      цвет: 'black',
      bgColor: 'pink'
    },
    style: {
      цвет: 'red'
    }
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(container, option);</br>
```
## Results display 

Online effect reference: https://www.visactor.io/vтаблица/демонстрация/базовый-функциональность/row-series-число</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/CYGRblW5toHUdNx1m3jcWEYnnVe.gif' alt='' ширина='709' высота='403'>



## Related documents

Line число демонстрация: https://www.visactor.io/vтаблица/демонстрация/базовый-функциональность/row-series-число</br>
Related апи: https://www.visactor.io/vтаблица/option/списоктаблица#rowSeriesNumber</br>
github: https://github.com/VisActor/Vтаблица</br>



