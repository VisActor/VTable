---
category: examples
group: usage
title: Event Listening
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-list-table.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable-columns-text#cellType
---

# Event Listening

All events supported by VTable can be listened to through Vue's props. For more details, refer to the [Event List](<[../api/event](https://www.visactor.io/vtable/guide/Developer_Ecology/react#%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)>).

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <ListTable :options="tableOptions" @onMouseEnterCell="handleMouseEnterCell">
      <ListColumn v-for="(column, index) in columns" :key="index" :field="column.field" :title="column.title" />
    </ListTable>
  `,
  data() {
    return {
      columns: [
        { field: '0', title: 'Name' },
        { field: '1', title: 'Age' },
        { field: '2', title: 'Gender' },
        { field: '3', title: 'Hobby' }
      ],
      tableOptions: {
        records: new Array(1000).fill(['John Doe', 18, 'Male', '🏀'])
      }
    };
  },
  methods: {
    handleMouseEnterCell(arg) {
      console.log('Mouse entered cell:', arg);
    }
  }
});

app.component('ListTable', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
