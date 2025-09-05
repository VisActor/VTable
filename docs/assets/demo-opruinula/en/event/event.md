---
category: examples
group: event
title: event listerner
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable-columns-text#cellType
---

# event listerner

The events supported by VTable can be monitored through openinula props. For details, please refer to [Event List]([../api/event](https://www.visactor.io/vtable/guide/Developer_Ecology/openinula# %E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)).

## code demo

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';

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

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable
    option={option}
    height={'500px'}
    onMouseMoveCell={args => {
      console.log('onMouseMoveCell', args);
    }}
  />,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
