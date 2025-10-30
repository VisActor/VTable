---
category: examples
group: usage
title: use option and record
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: Developer_Ecology/openinula
---

# use option and record

Records can be separated from options and passed into the table component as a separate prop.

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
  ]
};
const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(<InulaVTable.ListTable option={option} records={records} height={'500px'} />, root);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
