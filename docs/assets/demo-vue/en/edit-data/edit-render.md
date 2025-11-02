---
category: examples
group: edit-cell
title: Dynamic Render Editor
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-edit-render.png
link: Developer_Ecology/vue
---

# Dynamic Render Editor

Implement dynamic editor injection through slot-based rendering mechanism, supporting conditional validation interception without relying on `@visactor/vtable-editors` component.

**✨ Core Features**

- **Slot-based Editor Injection** - Inject any Vue component via `<template #edit>`
- **Conditional Validation Interception** - Use `editConfig.editBefore` and `editConfig.validateValue` to validate before entering edit state and after value modification respectively, supporting sync/async logic
- **Disable Prompt Configuration** - Configure text prompts using `editConfig.disablePrompt` (for disabled states) and `editConfig.invalidPrompt` (for validation failures)

## Code Demo

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <vue-list-table :options="option">
      <ListColumn
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :title="column.title"
        :width="column.width"
        editor="dynamic-render-editor"
      >
        <template #edit="{ value, onChange }">
          <a-date-picker
            v-if="column.field === 'deliveryDate'"
            :default-value="value"
            style="width: 100%; height: 100%"
            :trigger-props="{
              'content-class': 'table-editor-element'
            }"
            @change="onChange"
          />
          <a-input
            v-else
            :default-value="value"
            style="width: 100%; height: 100%"
            allow-clear
            @input="onChange"
            @clear="onChange()"
          />
        </template>
      </ListColumn>
    </vue-list-table>
  `,
  data() {
    return {
      columns: [
        { field: 'orderId', title: 'Order ID', width: 200 },
        {
          field: 'product',
          title: 'Product Name',
          width: 250
        },
        {
          field: 'deliveryDate',
          title: 'Delivery Date',
          width: 200
        },
        {
          field: 'region',
          title: 'Delivery Region',
          width: 200
        }
      ],
      option: {
        records: [
          {
            orderId: 'ORD1000',
            product: 'Mobile Phone',
            quantity: 43,
            region: 'North China',
            deliveryDate: '2024-01-01',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1001',
            product: 'Laptop',
            quantity: 27,
            region: 'East China',
            deliveryDate: '2024-02-02',
            status: 'In Transit'
          },
          {
            orderId: 'ORD1002',
            product: 'Headphones',
            quantity: 58,
            region: 'South China',
            deliveryDate: '2024-03-03',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1003',
            product: 'Smart Watch',
            quantity: 19,
            region: 'Western Region',
            deliveryDate: '2024-04-04',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1004',
            product: 'Mobile Phone',
            quantity: 36,
            region: 'North China',
            deliveryDate: '2024-05-05',
            status: 'In Transit'
          },
          {
            orderId: 'ORD1005',
            product: 'Laptop',
            quantity: 52,
            region: 'East China',
            deliveryDate: '2024-06-06',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1006',
            product: 'Headphones',
            quantity: 14,
            region: 'South China',
            deliveryDate: '2024-07-07',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1007',
            product: 'Smart Watch',
            quantity: 47,
            region: 'Western Region',
            deliveryDate: '2024-08-08',
            status: 'In Transit'
          },
          {
            orderId: 'ORD1008',
            product: 'Mobile Phone',
            quantity: 29,
            region: 'North China',
            deliveryDate: '2024-09-09',
            status: 'Delivered'
          },
          {
            orderId: 'ORD1009',
            product: 'Laptop',
            quantity: 55,
            region: 'East China',
            deliveryDate: '2024-10-10',
            status: 'Pending Shipment'
          },
          {
            orderId: 'ORD1010',
            product: 'Headphones',
            quantity: 22,
            region: 'South China',
            deliveryDate: '2024-11-11',
            status: 'In Transit'
          }
        ],
        editCellTrigger: 'click'
      }
    };
  }
});

app.component('vue-list-table', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);
app.component('a-date-picker', ArcoDesignVue.DatePicker);
app.component('a-input', ArcoDesignVue.Input);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
