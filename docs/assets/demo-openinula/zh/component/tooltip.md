---
category: examples
group: component
title: tooltip组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: '../guide/table_type/List_table/list_table_define_and_generate'
option: ListTable#tooltip
---

# tooltip组件

可以直接使用`Tooltip`配置菜单组件，配置与option.tooltip一致。

## 代码演示
```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';

const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable 
    records={records} 
    height={'500px'}
  >
    <InulaVTable.ListColumn field={'0'} caption={'name'} />
    <InulaVTable.ListColumn field={'1'} caption={'age'} />
    <InulaVTable.ListColumn field={'2'} caption={'gender'} />
    <InulaVTable.ListColumn field={'3'} caption={'hobby'} />
    <InulaVTable.Tooltip 
      renderMode={'html'}
      isShowOverflowTextTooltip={true}
    />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```