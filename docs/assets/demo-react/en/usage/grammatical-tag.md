---
category: examples
group: usage
title: grammatical tag
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: Developer_Ecology/react
---

# grammatical tag

Use syntax tags to assemble a complete table configuration and generate tables in the form of subcomponents.

- ListColumn: List column, consistent with the definition of columns in option [api](../../option/ListTable-columns-text#cellType)

## code demo

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable records={records} height={'500px'}>
    <ReactVTable.ListColumn field={'0'} title={'name'} />
    <ReactVTable.ListColumn field={'1'} title={'age'} />
    <ReactVTable.ListColumn field={'2'} title={'gender'} />
    <ReactVTable.ListColumn field={'3'} title={'hobby'} />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
