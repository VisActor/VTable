---
category: examples
group: usage
title: 使用option+record
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: Developer_Ecology/openinula
---

# 使用 option+record

可以将 records 从 option 中分离出来，单独作为一个 prop 传入表格组件。

## 代码演示

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
