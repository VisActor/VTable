---
category: examples
group: usage
title: 使用option+record
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-default.png
order: 1-1
link: Developer_Ecology/vue
---

# 使用 option+record

可以将 records 从 option 中分离出来，单独作为一个 prop 传入表格组件。

## 代码演示

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <ListTable :options="tableOptions" :records="tableRecords"/>
  `,
  data() {
    return {
      tableOptions: {
        columns: [
          { field: '0', title: 'name' },
          { field: '1', title: 'age' },
          { field: '2', title: 'gender' },
          { field: '3', title: 'hobby' }
        ]
      },
      tableRecords: new Array(1000).fill(['John', 18, 'male', '🏀'])
    };
  }
});

app.component('ListTable', VueVTable.ListTable);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
