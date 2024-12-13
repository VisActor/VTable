---
category: examples
group: usage
title: 使用完整option
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: Developer_Ecology/react
---

# 使用完整 option

可以直接使用可以直接使用 VTable 的完整 option，将 option 作为一个 prop 传入表格组件。

## 代码演示

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
root.render(<ReactVTable.ListTable option={option} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
