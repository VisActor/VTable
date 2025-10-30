---
категория: примеры
группа: Component
заголовок: empty tip
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/empty-tip.png
ссылка: компонентs/empty-tip
опция: ListTable#emptyTip
---

# Empty Tip

When `emptyTip` is configured, when the table data is empty, an empty data prompt will be displayed. You can configure the prompt text, prompt icon, prompt style, etc.

## Ключевые Конфигурации

- `emptyTip` Configure empty data prompt. For details, please refer to: https://www.visactor.io/vtable/опция/ListTable#emptyTip

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;

const columns = [
  {
    field: 'ИД Заказа',
    title: 'ИД Заказа',
    width: 'auto'
  },
  {
    field: 'ИД Клиента',
    title: 'ИД Клиента',
    width: 'auto'
  },
  {
    field: 'Название Товара',
    title: 'Название Товара',
    width: '200'
  },
  {
    field: 'Категория',
    title: 'Категория',
    width: 'auto'
  },
  {
    field: 'Подкатегория',
    title: 'Подкатегория',
    width: 'auto'
  },
  {
    field: 'Регион',
    title: 'Регион',
    width: 'auto'
  },
  {
    field: 'Город',
    title: 'Город',
    width: 'auto'
  },
  {
    field: 'Дата Заказа',
    title: 'Дата Заказа',
    width: 'auto'
  },
  {
    field: 'Количество',
    title: 'Количество',
    width: 'auto'
  },
  {
    field: 'Продажи',
    title: 'Продажи',
    width: 'auto'
  },
  {
    field: 'Прибыль',
    title: 'Прибыль',
    width: 'auto'
  }
];

const option = {
  columns,
  widthMode: 'standard',
  tooltip: {
    isShowOverflowTextTooltip: true
  },
  emptyTip: {
    text: 'no data records'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
