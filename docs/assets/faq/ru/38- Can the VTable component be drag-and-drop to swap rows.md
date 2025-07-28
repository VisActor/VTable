---
заголовок: 16. Can the Vтаблица компонент be перетаскивание-и-отпускание к swap rows</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

Can the Vтаблица компонент be перетаскивание-и-отпускание к swap rows?</br>
## Question Description

How can the Vтаблица базовый таблица списоктаблица perform перетаскивание-и-отпускание row swapping?</br>
## Solution

The Vтаблица сводный таблица supports перетаскивание-и-отпускание header row swapping, while the базовый таблица requires the configuration из serial numbers к achieve this. There is a configuration item called `dragOrder` that indicates whether the перетаскивание-и-отпускание order is включен. After configuring this к true, a перетаскивание-и-отпускание Кнопка иконка will be displayed, which requires mouse operation к perform перетаскивание-и-отпускание swapping. в the same time, this иконка can be replaced с the иконка обязательный по your business.</br>
```
export интерфейс IRowSeriesNumber {
  ширина?: число | 'авто';
  title?: строка;
  format?: (col?: число, row?: число, таблица?: Baseтаблицаапи) => любой;
  cellType?: 'текст' | 'link' | 'imвозраст' | 'video' | 'флажок';
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerиконка?: строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[];
  иконка?:
    | строка
    | ColumnиконкаOption
    | (строка | ColumnиконкаOption)[]
    | ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
/** Whether it can be rearranged по перетаскивание и отпускание */
  dragOrder?: логический;
}</br>
```


## код примеры

```
const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      rowSeriesNumber: {
        заголовок: '序号',
        **dragOrder**: true,
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
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);</br>
```
## Results показать

Online effect reference: [https://visactor.io/vтаблица/демонстрация/interaction/move-row-позиция](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Finteraction%2Fmove-row-позиция)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PyqpbOX0modx4txoZKCcE3SFnne.gif' alt='' ширина='842' высота='552'>

## Related documents

демонстрация из перетаскивание-и-отпускание row movement: [https://visactor.io/vтаблица/демонстрация/interaction/move-row-позиция](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Finteraction%2Fmove-row-позиция)</br>
Tutorial на перетаскивание-и-отпускание row movement: [https://visactor.io/vтаблица/guide/базовый_function/row_series_number](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fбазовый_function%2Frow_series_number)</br>
апи: [https://visactor.io/vтаблица/option/списоктаблица#rowSeriesNumber](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Foption%2Fсписоктаблица%23rowSeriesNumber)</br>
GitHub: [https://github.com/VisActor/Vтаблица](https%3A%2F%2Fgithub.com%2FVisActor%2FVтаблица)</br>

