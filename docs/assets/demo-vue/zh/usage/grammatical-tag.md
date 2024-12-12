---
category: examples
group: usage
title: 使用语法化标签
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-list-table.png
order: 1-1
link: Developer_Ecology/vue
---

# 使用语法化标签

使用语法化标签，组合出一个完整的表格配置，以子组件的形式生成表格。

- ListColumn: 列表列，同 option 中的 columns 的定义一致 [api](../../option/ListTable-columns-text#cellType)
- 同时可以结合语法糖使用，以简化代码并提高可读性

## 代码演示

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <ListTable :options="tableOptions" >
      <ListColumn v-for="(column, index) in columns" :key="index" :field="column.field" :title="column.title" />
      <ListColumn field="4" title="邮件" maxWidth="300"/>
      <ListColumn field="5" title="地址" dragHeader="true"/>
      <ListColumn field="6" title="手机" dragHeader="true"/>
      <ListColumn field="7" title="状态" dragHeader="true"/>
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
        records: new Array(1000).fill(['张三', 18, '男', '🏀', '@example', 'xxx.xxx.xxx.xxx', '12345678901', '正常'])
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
