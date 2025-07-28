---
категория: примеры
группа: Interaction
заголовок: навести the Line Cross Highlight
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/навести-cross.png
порядок: 4-3
ссылка: interaction/hover_cell
опция: списоктаблица#навести.highlightMode('cross'%7C'column'%7C'row'%7C'cell')%20=%20'cross'
---

# навести the line cross highlight

навести over a cell и highlight the entire row и column из the cell.

## Ключевые Конфигурации

- `навести` Configure highlighting mode

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
      навести: {
        highlightMode: 'cross'
        // enableSingleHighlight: false,
      },
      тема: Vтаблица.темаs.ARCO.extends({
        defaultStyle: {
          навести: {
            cellBgColor: '#9cbef4',
            inlineRowBgColor: '#9cbef4',
            inlineColumnBgColor: '#9cbef4'
          }
        },
        bodyStyle: {
          навести: {
            cellBgColor: '#c3dafd',
            inlineRowBgColor: '#c3dafd',
            inlineColumnBgColor: '#c3dafd'
          }
        }
      })
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
