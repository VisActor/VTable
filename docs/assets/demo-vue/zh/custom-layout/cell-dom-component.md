---
category: examples
group: custom-layout
title: 单元格渲染 DOM 组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-custom-dom-component.jpeg
order: 1-2
link: custom_define/vue-custom-component
---

# 单元格渲染 DOM 组件

在 `vue-vtable` 中，支持在单元格中直接渲染 DOM 组件，可以轻松地在表格中嵌入复杂的 Vue 组件，实现高度自定义的表格展示效果。支持两种形式：**插槽式**和**直接传入到 `column` 配置中**。两种方式都需要通过 `Group` 组件进行包裹。

**🛠️ 核心配置步骤：开启 DOM 组件渲染**

在 `vue-vtable` 中，渲染 DOM 组件需要两个关键步骤：

- **`Group` 组件中传入 `vue` 属性**：这是为了让 `Group` 组件能够识别并处理 Vue 组件。
- **开启 `customConfig.createReactContainer`**：这个配置项用于创建表格容器，确保 Vue 组件能够正确渲染到表格容器中。

**✨ 使用方式 1：插槽式渲染**

插槽式渲染是通过 `ListColumn` 组件的两个插槽 `headerCustomLayout` 和 `customLayout` 来实现的。自定义组件需要使用 `Group` 组件进行包裹。

- **`headerCustomLayout`**：用于自定义表头单元格的渲染。
- **`customLayout`**：用于自定义表格体单元格的渲染。

**✨ 使用方式 2： 直接传入配置式渲染**

直接传入配置式渲染与插槽式渲染类似，区别在于你不需要通过插槽来传递组件，而是直接在 `column.headerCustomLayout` 或 `column.customLayout` 配置中的 `element` 属性中传入虚拟节点。
使用方法与 [自定义组件](../../guide/custom_define/custom_layout) 大致相同。

**⚠️ 注意事项**

- **交互开启**： 若自定义单元格中需要鼠标交互，需要手动开启 `pointer-events`, 如下示例

## 代码演示

```javascript livedemo template=vtable-vue
//在代码演示中，我们展示了如何在表格中渲染自定义的 Vue 组件。具体包括：
//- **性别列**：通过 `ArcoDesignVue.Tag` 组件来渲染性别表头信息。
//- **评论列**：通过 `ArcoDesignVue.Comment` 组件来渲染评论信息，并包含点赞、收藏、回复等操作按钮。

const app = createApp({
  template: `
   <vue-list-table :options="option" :records="records" ref="tableRef">
    <ListColumn field="name" title="姓名" width="200" />
    <ListColumn field="age" title="年龄" width="150" />
    <ListColumn field="city" title="城市" width="150" />
    <ListColumn field="gender" title="性别" width="100">
      <template #headerCustomLayout="{ width, height }">
        <Group :width="width" :height="height" display="flex" align-items="center" :vue="{}">
          <ATag color="green"> 性别 </ATag>
        </Group>
      </template>
    </ListColumn>
    <ListColumn field="comment" title="评论" width="300">
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
          { gender: '男', name: '张三', age: 20, city: '北京' },
          { gender: '女', name: '李四', age: 21, city: '上海' },
          { gender: '男', name: '王五', age: 22, city: '广州' },
          { gender: '女', name: '赵六', age: 23, city: '深圳' },
          { gender: '男', name: '孙七', age: 24, city: '成都' },
          { gender: '女', name: '周八', age: 25, city: '重庆' },
          { gender: '男', name: '吴九', age: 26, city: '西安' }
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
