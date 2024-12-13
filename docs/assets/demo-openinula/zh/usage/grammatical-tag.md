---
category: examples
group: usage
title: 使用语法化标签
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
order: 1-1
link: Developer_Ecology/openinula
---

# 使用语法化标签

使用语法化标签，组合出一个完整的表格配置，以子组件的形式生成表格。

- ListColumn: 列表列，同 option 中的 columns 的定义一致 [api](../../option/ListTable-columns-text#cellType)

## 代码演示

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
const records = new Array(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable records={records} height={'500px'}>
    <InulaVTable.ListColumn field={'0'} title={'name'} />
    <InulaVTable.ListColumn field={'1'} title={'age'} />
    <InulaVTable.ListColumn field={'2'} title={'gender'} />
    <InulaVTable.ListColumn field={'3'} title={'hobby'} />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
