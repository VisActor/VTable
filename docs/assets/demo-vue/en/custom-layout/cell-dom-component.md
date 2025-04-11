---
category: examples
group: custom-layout
title: Cell Rendering DOM Components
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-custom-dom-component.jpeg
order: 1-2
link: custom_define/vue-dom-component
---

# Cell Rendering DOM Components

In `vue-vtable`, you can directly render DOM components within table cells, enabling seamless integration of complex Vue components for highly customizable table displays. Two approaches are supported: **slot-based** and **directly passing components into the `column` configuration**. Both methods require wrapping components with the `Group` component.

**🛠️ Core configuration steps: Enable DOM component rendering**

To render DOM components in `vue-vtable`, follow these key steps:

- **Pass the `vue` property to the `Group` component**: This allows the `Group` component to recognize and process Vue components.
- **Enable `customConfig.createReactContainer`**: This configuration creates a table container to ensure Vue components render correctly within the table.

**✨ Method 1: Slot-Based Rendering**

Slot-based rendering uses the `headerCustomLayout` and `customLayout` slots of the `ListColumn` component. Custom components must be wrapped in the `Group` component.

- **`headerCustomLayout`**: Customizes header cell rendering.
- **`customLayout`**: Customizes body cell rendering.

**✨ Method 2: Direct Configuration-Based Rendering**

This method is similar to slot-based rendering but does not use slots. Instead, directly pass virtual nodes via the `element` property in the `column.headerCustomLayout` or `column.customLayout` configuration. The usage aligns with [Custom Components](../../guide/custom_define/custom_layout).

**⚠️ Notes**

- **Enabling Interactions**: If custom cells require mouse interactions, manually enable `pointer-events`. See the example below.

## Code Demo

```javascript livedemo template=vtable-vue
// In this demo, we show how to render custom Vue components in the table. Specifically:
// - **Gender Column**: Renders gender headers using the `ArcoDesignVue.Tag` component.
// - **Comment Column**: Renders comments with the `ArcoDesignVue.Comment` component, including action buttons for likes, favorites, and replies.

const app = createApp({
  template: `
   <vue-list-table :options="option" :records="records" ref="tableRef">
    <ListColumn field="name" title="Name" width="200" />
    <ListColumn field="age" title="Age" width="150" />
    <ListColumn field="city" title="City" width="150" />
    <ListColumn field="gender" title="Gender" width="100">
      <template #headerCustomLayout="{ width, height }">
        <Group :width="width" :height="height" display="flex" align-items="center" :vue="{}">
          <ATag color="green"> Gender </ATag>
        </Group>
      </template>
    </ListColumn>
    <ListColumn field="comment" title="Comment" width="300">
      <template #customLayout="{ width, height, record }">
        <Group :width="width" :height="height" display="flex" align-items="center" :vue="{}">
          <AComment author="Socrates" :content="record['comment']" datetime="1 hour">
            <template #actions>
              <span key="heart" style="cursor: pointer; pointer-events: auto">
                {{ 83 }}
              </span>
              <span key="star" style="cursor: pointer; pointer-events: auto">
                {{ 3 }}
              </span>
              <span key="reply" style="cursor: pointer; pointer-events: auto"> Reply </span>
            </template>
            <template #avatar>
              <AAvatar>
                <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                />
              </AAvatar>
            </template>
          </AComment>
        </Group>
      </template>
    </ListColumn>
  </vue-list-table>
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
app.component('ListColumn', VueVTable.ListColumn);
app.component('Group', VueVTable.Group);
app.component('ATag', ArcoDesignVue.Tag);
app.component('AComment', ArcoDesignVue.Comment);
app.component('AAvatar', ArcoDesignVue.Avatar);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
