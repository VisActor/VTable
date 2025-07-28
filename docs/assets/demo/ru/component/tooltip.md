---
категория: примеры
группа: компонент
заголовок: Подсказка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/Подсказка.png
ссылка: компонентs/Подсказка
опция: списоктаблица#Подсказка.isShowOverflowTextПодсказка
---

# Подсказка

This пример shows Подсказкаs для four scenarios.

1. Set `Подсказка.isShowOverflowTextПодсказка` к `true` к включить overflow текст prompts. When hovering over the текст that is too long к be displayed, the текст will be displayed. в this пример, the текст в the cells из the `Product имя` column is omitted, и Вы можете навести over the cell к see the prompt information.

2. The description information из the таблица header is displayed по configuring `description`.

3. This пример also shows how к actively display the Подсказка through the интерфейс. по списокening к the `mouseenter_cell` событие, when the mouse moves into the cell из the первый column из order numbers, the интерфейс `showПодсказка` is called к display the prompt information.

4. пользовательскийize the prompt information из the иконка, configure `headerиконка` в the `orderId` column к `order`, и configure `Подсказка` в the configuration из the иконка `order` к display the prompt information.

The prompt information supports hovering к выбрать и copy. When there is too much content, the maximum ширина и высота can be configured для scrolling interaction.

## Ключевые Конфигурации

-`Подсказка.isShowOverflowTextПодсказка` включить the prompt для long omitted текст

-`showПодсказка` показать the calling интерфейс из Подсказка

## код демонстрация

## 代码演示

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.иконка('order', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/order.svg',
  ширина: 22,
  высота: 22,
  имя: 'order',
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  Подсказка: {
    // 气泡框，按钮的的解释信息
    заголовок:
      'ID Заказа is the unique identifier для каждый order.\n It is a unique identifier для каждый order. \n It is a unique identifier для каждый order. \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique identifier для каждый order.  \n It is a unique',
    style: { bgColor: 'black', arrowMark: true, цвет: 'white', maxвысота: 100, maxширина: 200 },
    disappearDelay: 100
  },
  cursor: 'pointer'
});
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто',
        headerиконка: 'order',
        description: 'ID Заказа is the unique identifier для каждый order.\n It is a unique identifier для каждый order.'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто',
        description:
          'пользовательскийer ID is the unique identifier для каждый пользовательскийer.\n It is a unique identifier для каждый пользовательскийer.'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: '200',
        description: 'Product имя is the имя из the product.'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто',
        description: 'Категория is the Категория из the product.'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто',
        description: 'Sub-Категория is the sub-Категория из the product.'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто',
        description: 'Регион is the Регион из the order produced.'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто',
        description: 'Город is the Город из the order produced.'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто',
        description: 'Дата Заказа is the date из the order produced.'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто',
        description: 'Количество is the Количество из the order.'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто',
        description: 'Продажи is the Продажи из the order.'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто',
        description: 'Прибыль is the Прибыль из the order.'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      Подсказка: {
        isShowOverflowTextПодсказка: true
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
          disappearDelay: 100,
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
