---
category: examples
group: usage
title: Using Grammatical Tags
cover: 
order: 1-1
link: '../guide/Developer_Ecology/vue'
---

# Using Grammatical Tags

Utilize grammatical tags to compose a complete table configuration, generating the table as a subcomponent.

- ListColumn: List column, consistent with the definition in option's columns [api](../../option/ListTable-columns-text#cellType)
- Can be combined with syntactic sugar to simplify code and improve readability

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
        { field: '3', title: 'Hobby' },
      ],
      tableOptions: {
         records: new Array(1000).fill(['Zhang San', 18, 'Male', '🏀', '@example', 'xxx.xxx.xxx.xxx', '12345678901', 'Normal']),
      },
    };
  },
});

app.component('ListTable', VueVTable.ListTable);
app.component('ListColumn', VueVTable.ListColumn);

app.mount(`#${CONTAINER_ID}`);

```
