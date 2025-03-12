---
category: examples
group: custom-layout
title: Cell Rendering DOM Components
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-custom-dom-component.jpeg
order: 1-2
link: custom_define/vue-dom-component
---

# Cell Rendering DOM Components

In `vue-vtable`, it is possible to directly render DOM components within cells, allowing for the easy embedding of complex Vue components to achieve highly customized table display effects. Two forms are supported: **slot-based** and **directly passing into the `column` configuration**. Both methods require wrapping with the `Group` component.

## Detailed Explanation

### 1. Enabling the Feature

In `vue-vtable`, rendering DOM components requires two key steps:

- **Pass the `vue` property in the `Group` component**: This allows the `Group` component to recognize and handle Vue components.
- **Enable `customConfig.createReactContainer`**: This configuration item is used to create a table container, ensuring that Vue components can be correctly rendered into the table container.

### 2. Slot-Based Rendering

Slot-based rendering is achieved through the two slots `headerCustomLayout` and `customLayout` of the `ListColumn` component. Custom components need to be wrapped with the `Group` component.

- **`headerCustomLayout`**: Used for custom rendering of header cells.
- **`customLayout`**: Used for custom rendering of body cells.

### 3. Direct Configuration-Based Rendering

Direct configuration-based rendering is similar to slot-based rendering, with the difference being that you do not need to pass components through slots. Instead, you directly pass virtual nodes in the `element` property of the `column.headerCustomLayout` or `column.customLayout` configuration. The usage is largely the same as with [custom components](../../guide/custom_define/custom_layout).

## Code Demonstration

```javascript livedemo template=vtable-vue

// In the code demonstration, we show how to render custom Vue components within the table. Specifically, it includes:

// - **Gender Column**: Uses the `ArcoDesignVue.Tag` component to render gender information and dynamically changes the tag color based on the gender value.
// - **Comment Column**: Uses the `ArcoDesignVue.Comment` component to render comment information, including like, collect, and reply action buttons.

const app = createApp({
  template: `
    <vue-list-table :options="option" :records="records" ref="tableRef" />
  `,
  data() {
    return {
      tableRef: ref(null),
      option: {
        records: [
          { gender: 'Male', name: 'Zhang San', age: 20, city: 'Beijing' },
          { gender: 'Female', name: 'Li Si', age: 21, city: 'Shanghai' },
          { gender: 'Male', name: 'Wang Wu', age: 22, city: 'Guangzhou' },
          { gender: 'Female', name: 'Zhao Liu', age: 23, city: 'Shenzhen' },
          { gender: 'Male', name: 'Sun Qi', age: 24, city: 'Chengdu' },
          { gender: 'Female', name: 'Zhou Ba', age: 25, city: 'Chongqing' },
          { gender: 'Male', name: 'Wu Jiu', age: 26, city: "Xi'an" }
        ],
        columns: [
          {
            field: 'name',
            title: 'Name',
            width: 200
          },
          { field: 'age', title: 'Age', width: 150 },
          { field: 'city', title: 'City', width: 200 },
          {
            field: 'gender',
            title: 'Gender',
            width: 100,
            headerCustomLayout: args => {
              const { table, row, col, rect, value } = args;
              const { height, width } = rect ?? table.getCellRect(col, row);

              const container = new VTable.CustomLayout.Group({
                height,
                width,
                display: 'flex',
                alignItems: 'center',
                vue: {
                  element: h(ArcoDesignVue.Tag, { color: 'green' }, value),
                  container: table.headerDomContainer
                }
              });
              return {
                rootContainer: container,
                renderDefault: false
              };
            },
            customLayout: args => {
              const { table, row, col, rect, value } = args;
              const { height, width } = rect ?? table.getCellRect(col, row);

              const container = new VTable.CustomLayout.Group({
                height,
                width,
                display: 'flex',
                alignItems: 'center',
                vue: {
                  element: h(ArcoDesignVue.Tag, { color: value === 'Female' ? 'magenta' : 'arcoblue' }, value),
                  container: table.bodyDomContainer
                }
              });

              return {
                rootContainer: container,
                renderDefault: false
              };
            }
          },
          {
            field: 'comment',
            title: 'Comment',
            width: 300,
            customLayout: args => {
              const { table, row, col, rect, value } = args;
              const { height, width } = rect ?? table.getCellRect(col, row);

              const container = new VTable.CustomLayout.Group({
                height,
                width,
                display: 'flex',
                alignItems: 'center',
                vue: {
                  element: h(
                    ArcoDesignVue.Comment,
                    { author: 'Socrates', content: value, datetime: '1 hour' },
                    {
                      actions: () => [
                        h('span', { key: 'heart', style: { cursor: 'pointer' } }, [h('span', 'Like')]),
                        h('span', { key: 'star', style: { cursor: 'pointer' } }, [h('span', 'Collect')]),
                        h('span', { key: 'reply', style: { cursor: 'pointer' } }, [h('span', 'Reply')])
                      ],
                      avatar: () => [
                        h(
                          ArcoDesignVue.Avatar,
                          {},
                          {
                            default: () => [
                              h('img', {
                                alt: 'avatar',
                                src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                              })
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  container: table.bodyDomContainer
                }
              });

              return {
                rootContainer: container,
                renderDefault: false
              };
            }
          }
        ],
        defaultHeaderRowHeight: 40,
        defaultRowHeight: 80,
        customConfig: {
          createReactContainer: true
        }
      }
    };
  }
});

app.component('vue-list-table', VueVTable.ListTable);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
