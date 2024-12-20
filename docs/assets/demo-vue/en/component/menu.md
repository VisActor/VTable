---
category: examples
group: component
title: Menu Component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-menu.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#menu
---

# Menu Component

You can directly use the `Menu` to configure the menu component, which is consistent with the option.menu configuration.

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
   <ListTable :options="tableOptions" @onDropdownMenuClick="handleDropdownMenuClick">
    
    <ListColumn v-for="(column, index) in columns" :key="index" :field="column.field" :title="column.title" />
    
    <Menu menuType="html" :contextMenuItems="['copy', 'paste', 'delete', '...']" />

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
  },
  methods: {
    handleDropdownMenuClick(args) {
      console.log('menu click', args);
    }
  }
});

app.component('ListTable', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);
app.component('Menu', VueVTable.Menu);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
