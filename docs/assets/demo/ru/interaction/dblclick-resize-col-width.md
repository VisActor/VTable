---
категория: примеры
группа: Interaction
заголовок: Column ширина автоmatically adapts к content when double-Нажатьing
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/dblНажать-изменение размера-col-ширина.gif
ссылка: '/interaction/resize_column_ширина'
опция: списоктаблица#columnResizeMode
---

# Double-Нажать the column ширина к автоmatically adapt к the content

Double-Нажать на the column interval line к автоmatically calculate the column ширина based на the текущий cell content.

## Ключевые Конфигурации

## код демонстрация

```javascript liveдемонстрация template=vтаблица
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
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
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
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      изменение размера: {
        columnResizeMode: 'header'
        //columnResizeType:'все',
      },
      ширинаMode: 'standard',
      defaultColширина: 120
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
