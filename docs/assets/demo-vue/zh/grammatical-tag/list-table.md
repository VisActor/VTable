---
category: examples
group: grammatical-tag
title: 基本表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-list-table.png
order: 1-1
link: Developer_Ecology/vue
---

# 透视分析表

ListTable 语义化子组件如下：

- PivotColumnDimension: 列上的维度配置，同 option 中的 columns 的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- ListColumn: 列上的维度配置，同 option 中的 columns 的定义一致

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
