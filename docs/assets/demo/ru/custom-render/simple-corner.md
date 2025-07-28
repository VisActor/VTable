---
категория: примеры
группа: пользовательский
заголовок: пользовательский simple corner
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/simple-corner.jpeg
опция: списоктаблица-columns-текст#пользовательскийRender.elements
---

в a сводный таблица, sometimes it is necessary к implement a slanted header. This can be achieved по пользовательскийizing `пользовательскийRender` или `пользовательскиймакет` в the `corner` area.

```js
option = {
  // ...other config...
  corner: {
    titleOnDimension: 'row',
      headerStyle: {
      textStick: true
    },
    пользовательскиймакет: (args) => {
      const {таблица, row, col, rect} = args;
      const {высота, ширина} = rect ?? таблица.getCellRect(col, row);
      const container = createGroup({
        высота,
        ширина,
      });
      // .... other fun call

      возврат {
        rootContainer: container,
        renderDefault: false,
        enableCellPadding: false,
      };
    }
  }
}
```

## код Sample

```javascript liveдемонстрация template=vтаблица
// only use для website
const {createGroup, createText, createLine} = VRender;
// use this для project
// import {createGroup, createText, createLine} от '@visactor/vтаблица/es/vrender';

let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        },
        пользовательскиймакет: (args) => {
          const {таблица, row, col, rect} = args;
          const {высота, ширина} = rect ?? таблица.getCellRect(col, row);
          const container = createGroup({
            высота,
            ширина,
          });

          // 定义文本内容的数组
          const texts = [
            {текст: 'тип', fontSize: 18, x: 40, y: rect.высота - 30},
            {текст: 'данные', fontSize: 18, x: rect.ширина - 60, y: 20},
          ];

          // add corner текст
          texts.forEach(({текст, fontSize, x, y}) => {
            container.addChild(
              createText({
                текст,
                fontSize,
                fontFamily: 'sans-serif',
                fill: 'black',
                x,
                y,
              })
            );
          });

          // define the point
          const linePoints = [
            {x: 0, y: 0},
            {x: rect.ширина, y: rect.высота}
          ];

          // add line
          container.addChild(
            createLine({
              points: linePoints,
              lineширина: 1,
              strхорошоe: '#ccc',
            })
          );

          возврат {
            rootContainer: container,
            renderDefault: false,
            enableCellPadding: false,
          };
        }
      },
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
        }
      ],
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
  });
```
