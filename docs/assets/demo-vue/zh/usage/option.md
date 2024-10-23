---
category: examples
group: usage
title: 使用完整 option
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-default.png
order: 1-1
link: '../guide/Developer_Ecology/vue'
---

# 使用完整 option

可以直接使用 VTable 的完整 option，将 option 作为一个 prop 传入表格组件。

## 代码演示

```javascript livedemo template=vtable-vue

const app = createApp({
  template: `
    <ListTable :options="tableOptions"/>
  `,
  data() {
    return {
      tableOptions: {
        columns: [
          { field: '0', title: 'name' },
          { field: '1', title: 'age' },
          { field: '2', title: 'gender' },
          { field: '3', title: 'hobby' },
        ],
        records: new Array(1000).fill(['John', 18, 'male', '🏀']),
      },
    };
  },
});

app.component('ListTable', VueVTable.ListTable);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```