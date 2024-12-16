---
category: examples
group: grammatical-tag
title: Basic Table
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-list-table.png
order: 1-1
link: Developer_Ecology/vue
---

# Perspective Analysis Table

The semantic subcomponents of ListTable are as follows:

- PivotColumnDimension: Configuration of dimensions on the column, consistent with the definition of columns in the option [api](../../option/PivotTable-columns-text#headerType)
- ListColumn: Configuration of dimensions on the column, consistent with the definition of columns in the option

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <ListTable :options="tableOptions" >
      <ListColumn v-for="(column, index) in columns" :key="index" :field="column.field" :title="column.title" />
      <ListColumn field="4" title="Email" maxWidth="300"/>
      <ListColumn field="5" title="Address" dragHeader="true"/>
      <ListColumn field="6" title="Phone" dragHeader="true"/>
      <ListColumn field="7" title="Status" dragHeader="true"/>
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
        records: new Array(1000).fill([
          'Zhang San',
          18,
          'Male',
          '🏀',
          '@example',
          'xxx.xxx.xxx.xxx',
          '12345678901',
          'Normal'
        ])
      }
    };
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
