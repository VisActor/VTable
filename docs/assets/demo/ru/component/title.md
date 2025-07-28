---
категория: примеры
группа: компонент
заголовок: title
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/title.png
ссылка: компонентs/title
опция: списоктаблица#title.видимый
---

# Title

в this пример, the main subheadings из the таблица are configured и styled separately.

## Ключевые Конфигурации

- `title` Configure the таблица title, please refer к: https://www.visactor.io/vтаблица/option/списоктаблица#title

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
        ширина: '200'
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
      Подсказка: {
        isShowOverflowTextПодсказка: true
      },
      заголовок: {
        текст: 'North American supermarket Продажи analysis',
        subtext: `The данные includes 15 к 18 years из retail transaction данные для North American supermarket`,
        orient: 'верх',
        заполнение: 20,
        textStyle: {
          fontSize: 30,
          fill: 'black'
        },
        subtextStyle: {
          fontSize: 20,
          fill: 'blue'
        }
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
    таблицаInstance.на('mouseenter_cell', args => {
      const { col, row, targetиконка } = args;
      if (col === 0 && row >= 1) {
        const rect = таблицаInstance.getVisibleCellRangeRelativeRect({ col, row });
        таблицаInstance.showПодсказка(col, row, {
          content: 'ID Заказа：' + таблицаInstance.getCellValue(col, row),
          referencePosition: { rect, placement: Vтаблица.TYPES.Placement.право }, //TODO
          classимя: 'defineПодсказка',
          style: {
            bgColor: 'black',
            цвет: 'white',
            шрифт: 'normal bold normal 14px/1 STKaiti',
            arrowMark: true
          }
        });
      }
    });
  });
```
