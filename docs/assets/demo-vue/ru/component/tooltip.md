---
category: examples
group: component
title: Tooltip Component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-tooltip.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#tooltip
---

# Tooltip Component

You can directly use the `Tooltip` configuration menu component, which is consistent with `option.tooltip`.

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
   <ListTable :options="tableOptions" >
    
    <ListColumn v-for="(column, index) in columns" :key="index" :field="column.field" :title="column.title" />
    
    <Tooltip :isShowOverflowTextTooltip="true" />   

   </ListTable>
  `,
  data() {
    return {
      columns: [
        { field: '0', title: 'Name' },
        { field: '1', title: 'Address' },
        { field: '2', title: 'Phone' }
      ],
      tableOptions: {
        records: new Array(1000).fill(['John Doe', 'xxx.xxx.xxx.xxx', '12345678901'])
      }
    };
  }
});

app.component('ListTable', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);
app.component('Tooltip', VueVTable.Tooltip);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
