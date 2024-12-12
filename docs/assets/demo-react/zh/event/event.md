---
category: examples
group: event
title: 事件监听
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable-columns-text#cellType
---

# 事件监听

VTable 支持的事件都可以通过 react 的 props 传入进行监听，具体可以参考[事件列表](<[../api/event](https://www.visactor.io/vtable/guide/Developer_Ecology/react#%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)>)。

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
root.render(
  <ReactVTable.ListTable
    option={option}
    height={'500px'}
    onMouseMoveCell={args => {
      console.log('onMouseMoveCell', args);
    }}
  />
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
