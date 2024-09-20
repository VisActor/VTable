---
category: examples
group: usage
title: 使用完整 option
cover: 
order: 1-1
link: '../guide/Developer_Ecology/vue'
---

# 使用完整 option

可以直接使用 VTable 的完整 option，将 option 作为一个 prop 传入表格组件。

## 代码演示

```javascript livedemo template=vtable-vue
<script>
const app = createApp({
  template: `
    <div>
      hello
    </div>
  `,
  data() {
    return {
      option: {
        columns: [
          { field: '0', title: 'name' },
          { field: '1', title: 'age' },
          { field: '2', title: 'gender' },
          { field: '3', title: 'hobby' },
        ],
      },
      records: Array.from({ length: 1000 }, () => ['John', 18, 'male', '🏀']),
    };
  },
});

app.component('vue-vtable', VueVTable);

app.mount(CONTAINER_ID);

// 释放资源
window.customRelease = () => {
  app.unmount();
};
</script>
