---
категория: примеры
группа: Component
заголовок: подсказка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/подсказка.png
ссылка: компонентs/подсказка
опция: ListTable#подсказка.isShowOverflowTextTooltip
---

# Tooltip

This example shows подсказкаs for four scenarios.

1. Set `подсказка.isShowOverflowTextTooltip` to `true` to enable overflow text prompts. When hovering over the text that is too long to be displayed, the text will be displayed. In this example, the text in the cells of the `Product Name` column is omitted, and you can hover over the cell to see the prompt information.

2. The description information of the table header is displayed by configuring `description`.

3. This example also shows how to actively display the подсказка through the interface. By listening to the `mouseenter_cell` событие, when the mouse moves into the cell of the first column of порядок numbers, the interface `showTooltip` is called to display the prompt information.

4. Customize the prompt information of the icon, configure `headerIcon` in the `порядокId` column to `порядок`, and configure `подсказка` in the configuration of the icon `порядок` to display the prompt information.

The prompt information supports hovering to select and copy. When there is too much content, the maximum width and height can be configured for scrolling interaction.

## Ключевые Конфигурации

-`подсказка.isShowOverflowTextTooltip` Enable the prompt for long omitted text

-`showTooltip` Show the calling interface of подсказка

## Демонстрация кода

## 代码演示

```javascript livedemo template=vtable
VTable.register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.right,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  tooltip: {
    // 气泡框，按钮的的解释信息
    title:
      'ИД Заказа is the unique identifier for each order.\n It is a unique identifier for each order. \n It is a unique identifier for each order. \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique identifier for each order.  \n It is a unique',
    style: { bgColor: 'black', arrowMark: true, color: 'white', maxHeight: 100, maxWidth: 200 },
    disappearDelay: 100
  },
  cursor: 'pointer'
});
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа',
        width: 'auto',
        headerIcon: 'order',
        description: 'ИД Заказа is the unique identifier for each order.\n It is a unique identifier for each order.'
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента',
        width: 'auto',
        description:
          'ИД Клиента is the unique identifier for each customer.\n It is a unique identifier for each customer.'
      },
      {
        field: 'Название Товара',
        title: 'Название Товара',
        width: '200',
        description: 'Название Товара is the name of the product.'
      },
      {
        field: 'Категория',
        title: 'Категория',
        width: 'auto',
        description: 'Категория is the category of the product.'
      },
      {
        field: 'Подкатегория',
        title: 'Подкатегория',
        width: 'auto',
        description: 'Sub-Категория is the sub-category of the product.'
      },
      {
        field: 'Регион',
        title: 'Регион',
        width: 'auto',
        description: 'Регион is the region of the order produced.'
      },
      {
        field: 'Город',
        title: 'Город',
        width: 'auto',
        description: 'Город is the city of the order produced.'
      },
      {
        field: 'Дата Заказа',
        title: 'Дата Заказа',
        width: 'auto',
        description: 'Дата Заказа is the date of the order produced.'
      },
      {
        field: 'Количество',
        title: 'Количество',
        width: 'auto',
        description: 'Количество is the quantity of the order.'
      },
      {
        field: 'Продажи',
        title: 'Продажи',
        width: 'auto',
        description: 'Продажи is the sales of the order.'
      },
      {
        field: 'Прибыль',
        title: 'Прибыль',
        width: 'auto',
        description: 'Прибыль is the profit of the order.'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      tooltip: {
        isShowOverflowTextTooltip: true
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
    tableInstance.on('mouseenter_cell', args => {
      const { col, row, targetIcon } = args;
      if (col === 0 && row >= 1) {
        const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
        tableInstance.showTooltip(col, row, {
          content: 'ИД Заказа：' + tableInstance.getCellValue(col, row),
          referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
          className: 'defineTooltip',
          disappearDelay: 100,
          style: {
            bgColor: 'black',
            color: 'white',
            font: 'normal bold normal 14px/1 STKaiti',
            arrowMark: true
          }
        });
      }
    });
  });
```
