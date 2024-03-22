---
category: examples
group: usage
title: 使用完整option
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: '../guide/Developer_Ecology/openinula'
---

# 使用完整option

可以直接使用可以直接使用VTable的完整option，将option作为一个prop传入表格组件。

## 代码演示
```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
const option = {
  header: [
    {
      field: '0',
      caption: 'name',
    },
    {
      field: '1',
      caption: 'age',
    },
    {
      field: '2',
      caption: 'gender',
    },
    {
      field: '3',
      caption: 'hobby',
    },
  ],
  records: new Array(1000).fill(['John', 18, 'male', '🏀']),
};

const root = document.getElementById(CONTAINER_ID);
Inula.render(<InulaVTable.ListTable option={option} height={'500px'} />, root);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```