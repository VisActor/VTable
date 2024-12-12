---
category: examples
group: usage
title: 事件监听
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-list-table.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable-columns-text#cellType
---

# 事件监听

VTable 支持的事件都可以通过 vue 的 props 传入进行监听，具体可以参考[事件列表](<[../api/event](https://www.visactor.io/vtable/guide/Developer_Ecology/react#%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)>)。

## 代码演示

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
        { field: '0', title: '名字' },
        { field: '1', title: '年龄' },
        { field: '2', title: '性别' },
        { field: '3', title: '爱好' }
      ],
      tableOptions: {
        records: new Array(1000).fill(['张三', 18, '男', '🏀'])
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
