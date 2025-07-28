---
категория: примеры
группа: Interaction
заголовок: move row позиция
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/row-series-число.gif
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица#rowSeriesNumber.dragOrder
---

# Move Row позиция

The row numbering capability refers к adding a unique serial число или identifier к каждый row из the таблица к mark, сортировка или reference the rows в the таблица. This демонстрация will демонстрацияnstrate the Vтаблица row numbering capabilities: row selection, row dragging позиция, и row numbering style configuration.

## Ключевые Конфигурации

-`списоктаблица.rowSeriesNumber`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      rowSeriesNumber: {
        заголовок: '序号',
        ширина: 'авто',
        dragпорядок: true,
        headerStyle: {
          цвет: 'black',
          bgColor: 'pink'
        },
        style: {
          цвет: 'red'
        }
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
