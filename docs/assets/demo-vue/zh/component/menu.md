---
category: examples
group: component
title: menu组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-menu.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#menu
---

# 菜单组件

可以直接使用`Menu`配置菜单组件，配置与 option.menu 一致。

## 代码演示

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
        { field: '0', title: '名字' },
        { field: '1', title: '地址' },
        { field: '2', title: '手机' }
      ],
      tableOptions: {
        records: new Array(1000).fill(['张三', 'xxx.xxx.xxx.xxx', '12345678901'])
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
