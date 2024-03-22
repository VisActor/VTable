---
category: examples
group: component
title: tooltip组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: '../guide/table_type/List_table/list_table_define_and_generate'
option: ListTable#tooltip
---

# tooltip组件

可以直接使用`Tooltip`配置菜单组件，配置与option.tooltip一致。

## 代码演示
```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable 
    records={records} 
    height={'500px'}
  >
    <ReactVTable.ListColumn field={'0'} caption={'name'} />
    <ReactVTable.ListColumn field={'1'} caption={'age'} />
    <ReactVTable.ListColumn field={'2'} caption={'gender'} />
    <ReactVTable.ListColumn field={'3'} caption={'hobby'} />
    <ReactVTable.Tooltip 
      renderMode={'html'}
      isShowOverflowTextTooltip={true}
    />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```