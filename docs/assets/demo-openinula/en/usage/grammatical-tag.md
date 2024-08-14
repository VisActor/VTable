---
category: examples
group: usage
title: grammatical tag
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: '../guide/Developer_Ecology/openinula'
---

# grammatical tag

Use syntax tags to assemble a complete table configuration and generate tables in the form of subcomponents.

- ListColumn: List column, consistent with the definition of columns in option [api](../../option/ListTable-columns-text#cellType)

## code demo
```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable records={records} height={'500px'}>
    <InulaVTable.ListColumn field={'0'} caption={'name'} />
    <InulaVTable.ListColumn field={'1'} caption={'age'} />
    <InulaVTable.ListColumn field={'2'} caption={'gender'} />
    <InulaVTable.ListColumn field={'3'} caption={'hobby'} />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```