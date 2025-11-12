---
категория: примеры
группа: edit-cell
заголовок: Dynamic Render Editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-editor-базовый.png
ссылка: edit-cell/slot-render
---

# Dynamic Render Editor

Implement dynamic editor injection through slot-based rendering mechanism, supporting conditional validation interception без relying на `@visactor/vтаблица-editors` компонент.

## Core возможности

1. **Slot-based Editor Injection** - Inject любой Vue компонент via `<template #edit>`
2. **Conditional Validation Interception** - Use `editConfig.editBefore` и `editConfig.validateValue` к validate before entering edit state и after значение modification respectively, supporting sync/async logic
3. **отключить Prompt Configuration** - Configure текст prompts using `editConfig.disablePrompt` (для отключен states) и `editConfig.invalidPrompt` (для validation failures)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <vue-список-таблица :options="option">
      <списокColumn
        v-для="column в columns"
        :key="column.поле"
        :поле="column.поле"
        :title="column.title"
        :ширина="column.ширина"
        editor="dynamic-render-editor"
      >
        <template #edit="{ значение, onChange }">
          <a-date-picker
            v-if="column.поле === 'deliveryDate'"
            :по умолчанию-значение="значение"
            style="ширина: 100%; высота: 100%"
            :trigger-props="{
              'content-class': 'таблица-editor-element'
            }"
            @change="onChange"
          />
          <a-ввод
            v-else
            :по умолчанию-значение="значение"
            style="ширина: 100%; высота: 100%"
            allow-clear
            @ввод="onChange"
            @clear="onChange()"
          />
        </template>
      </списокColumn>
    </vue-список-таблица>
  `,
  данные() {
    возврат {
      columns: [
        { поле: 'orderId', заголовок: 'ID Заказа', ширина: 200 },
        {
          поле: 'product',
          заголовок: 'Product имя',
          ширина: 250
        },
        {
          поле: 'deliveryDate',
          заголовок: 'Delivery Date',
          ширина: 200
        },
        {
          поле: 'Регион',
          заголовок: 'Delivery Регион',
          ширина: 200
        }
      ],
      опция: {
        records: [
          {
            orderId: 'ORD1000',
            product: 'Mobile Phone',
            Количество: 43,
            Регион: 'North China',
            deliveryDate: '2024-01-01',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1001',
            product: 'Laptop',
            Количество: 27,
            Регион: 'East China',
            deliveryDate: '2024-02-02',
            status: 'в Transit'
          },
          {
            orderId: 'ORD1002',
            product: 'Headphones',
            Количество: 58,
            Регион: 'South China',
            deliveryDate: '2024-03-03',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1003',
            product: 'Smart Watch',
            Количество: 19,
            Регион: 'Western Регион',
            deliveryDate: '2024-04-04',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1004',
            product: 'Mobile Phone',
            Количество: 36,
            Регион: 'North China',
            deliveryDate: '2024-05-05',
            status: 'в Transit'
          },
          {
            orderId: 'ORD1005',
            product: 'Laptop',
            Количество: 52,
            Регион: 'East China',
            deliveryDate: '2024-06-06',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1006',
            product: 'Headphones',
            Количество: 14,
            Регион: 'South China',
            deliveryDate: '2024-07-07',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1007',
            product: 'Smart Watch',
            Количество: 47,
            Регион: 'Western Регион',
            deliveryDate: '2024-08-08',
            status: 'в Transit'
          },
          {
            orderId: 'ORD1008',
            product: 'Mobile Phone',
            Количество: 29,
            Регион: 'North China',
            deliveryDate: '2024-09-09',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1009',
            product: 'Laptop',
            Количество: 55,
            Регион: 'East China',
            deliveryDate: '2024-10-10',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1010',
            product: 'Headphones',
            Количество: 22,
            Регион: 'South China',
            deliveryDate: '2024-11-11',
            status: 'в Transit'
          }
        ],
        editCellTrigger: 'Нажать'
      }
    };
  }
});

app.компонент('vue-список-таблица', VueVтаблица.списоктаблица);
app.компонент('списокColumn', VueVтаблица.списокColumn);
app.компонент('a-date-picker', ArкодsignVue.DatePicker);
app.компонент('a-ввод', ArкодsignVue.ввод);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
