---
category: examples
group: component
title: tooltip component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#tooltip
---

# tooltip component

You can directly use `Tooltip` to configure the menu component, and the configuration is consistent with option.tooltip.

## code demo

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';

const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable records={records} height={'500px'}>
    <InulaVTable.ListColumn field={'0'} title={'name'} />
    <InulaVTable.ListColumn field={'1'} title={'age'} />
    <InulaVTable.ListColumn field={'2'} title={'gender'} />
    <InulaVTable.ListColumn field={'3'} title={'hobby'} />
    <InulaVTable.Tooltip renderMode={'html'} isShowOverflowTextTooltip={true} />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
