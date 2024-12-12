---
category: examples
group: event
title: onReady
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable-columns-text#cellType
---

# onReady

The onReady callback is triggered after the table completes initialization or update. You can obtain the table instance and whether it is the first rendering.

## code demo

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const option = {
  columns: [
    {
      field: '0',
      title: 'name'
    },
    {
      field: '1',
      title: 'age'
    },
    {
      field: '2',
      title: 'gender'
    },
    {
      field: '3',
      title: 'hobby'
    }
  ],
  records: new Array(1000).fill(['John', 18, 'male', '🏀'])
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable
    option={option}
    height={'500px'}
    onReady={(tableInstance, isFirst) => {
      console.log(tableInstance, isFirst);
    }}
  />
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
