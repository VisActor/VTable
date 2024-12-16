---
category: examples
group: component
title: 菜单组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#menu
---

# 菜单组件

可以直接使用`Menu`配置菜单组件，配置与 option.menu 一致。

## 代码演示

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable
    records={records}
    height={'500px'}
    onDropdownMenuClick={args => {
      console.log('onDropdownMenuClick', args);
    }}
  >
    <ReactVTable.ListColumn field={'0'} title={'name'} />
    <ReactVTable.ListColumn field={'1'} title={'age'} />
    <ReactVTable.ListColumn field={'2'} title={'gender'} />
    <ReactVTable.ListColumn field={'3'} title={'hobby'} />
    <ReactVTable.Menu
      renderMode={'html'}
      defaultHeaderMenuItems={['header menu 1', 'header menu 2']}
      contextMenuItems={['context menu 1', 'context menu 2']}
    />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
