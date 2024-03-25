---
category: examples
group: usage
title: 使用完整option
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
order: 1-1
link: '../guide/Developer_Ecology/react'
---

# 使用语法化标签

使用语法化标签，组合出一个完整的表格配置，以子组件的形式生成表格。

- ListColumn: 列表列，同option中的columns的定义一致 [api](../../option/ListTable-columns-text#cellType)

## 代码演示
```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable records={records} height={'500px'}>
    <ReactVTable.ListColumn field={'0'} caption={'name'} />
    <ReactVTable.ListColumn field={'1'} caption={'age'} />
    <ReactVTable.ListColumn field={'2'} caption={'gender'} />
    <ReactVTable.ListColumn field={'3'} caption={'hobby'} />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```