---
заголовок: 26. When using the сводный таблица из the Vтаблица компонент, how к display the calculated indicator results в a separate column?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

When using the сводный таблица из the Vтаблица компонент, how к display the calculated indicator results в a separate column?</br>
## Question Description

Is there любой configuration that can generate derived indicators? Calculate the indicator results after aggregation, и then display them в the indicator.</br>
Description: для пример, my row dimension is Регион - area, column dimension is month, и indicator is target, actual, и achievement (this achievement is calculated as actual / target). Achievement is the indicator I want к derive, because there is no achievement поле в my данные.</br>
Screenshot из the problem:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V0NCbqaхорошоoJmitxZvkVcZ4cCn1f.gif' alt='' ширина='1347' высота='260'>

## Solution

**The best и latest solution: **There is now a better solution because Vтаблица has launched the feature из сводный таблица calculated полеs!!!</br>
**предыдущий solution:**</br>
Taking the сводный таблица на the official website из Vтаблица as an пример для similar target modifications, we add an indicator called `Прибыль Ratio` к the original демонстрация, и use the `format` функция к calculate the displayed значение. The calculation logic depends на the values из the `Продажи` и `Прибыль` indicators. That is, we calculate a Прибыль ratio where `Прибыль ratio = Прибыль / Продажи`.</br>
```
        {
          indicatorKey: 'Прибыль Ratio',
          заголовок: 'Прибыль Ratio',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: (значение,col,row,таблица) => {
            const Продажи=таблица.getCellOriginValue(col-2,row);
            const Прибыль=таблица.getCellOriginValue(col-1,row);
            const ratio= Прибыль/Продажи;
            var percentвозраст = ratio * 100;
            возврат percentвозраст.toFixed(2) + "%";
          }
        }</br>
```
## код примеры

```
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Город',
          заголовок: 'Город',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат 'black';
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль Ratio',
          заголовок: 'Прибыль Ratio',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: (значение,col,row,таблица) => {
            const Продажи=таблица.getCellOriginValue(col-2,row);
            const Прибыль=таблица.getCellOriginValue(col-1,row);
            const ratio= Прибыль/Продажи;
            var percentвозраст = ratio * 100;
            возврат percentвозраст.toFixed(2) + "%";
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Категория',
            сортировкаBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });</br>
```
## Result Display

Just paste the код в the пример код directly into the official editor к display it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Wxc7bfIQfoLb29xabyjc1ov4n6c.gif' alt='' ширина='853' высота='540'>

## Related documents

Tutorial на сводный таблица usвозраст: [https://visactor.io/vтаблица/guide/таблица_type/сводный_таблица/сводный_таблица_useвозраст](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fтаблица_type%2Fсводный_таблица%2Fсводный_таблица_useвозраст)</br>
демонстрация из сводный таблица usвозраст: [https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-analysis-таблица](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсводный-analysis-таблица)</br>
Related апи: [https://visactor.io/vтаблица/option/сводныйтаблица#indicators](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Foption%2Fсводныйтаблица%23indicators)</br>
github：https://github.com/VisActor/Vтаблица</br>

