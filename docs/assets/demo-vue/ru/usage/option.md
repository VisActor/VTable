---
category: examples
group: usage
title: Using Full Option
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-default.png
order: 1-1
link: Developer_Ecology/vue
---

# Using Full Option

You can directly use the full option of VTable by passing the option as a prop to the table component.

## Code Demonstration

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
          { field: '3', title: 'hobby' }
        ],
        records: new Array(1000).fill(['John', 18, 'male', '🏀'])
      }
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
