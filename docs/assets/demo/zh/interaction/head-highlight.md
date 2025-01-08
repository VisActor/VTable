---
category: examples
group: Interaction
title: 高亮表头
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png
link: plugin/header-highlight
---

# 高亮表头

选中单元格后，高亮对应的行头和列头。

## 关键配置

- `HeaderHighlightPlugin` 高亮表头插件
  - `columnHighlight` 是否高亮列头
  - `rowHighlight` 是否高亮行头
  - `colHighlightBGColor` 列头高亮背景色
  - `rowHighlightBGColor` 行头高亮背景色
  - `colHighlightColor` 列头高亮字体色
  - `rowHighlightColor` 行头高亮字体色

## 代码演示

```javascript livedemo template=vtable
// use this for project
// import * as VTable from '@visactor/vtable';
// import * as VTablePlugins from '@visactor/vtable-plugins';

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};

const records = generatePersons(20);

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 'auto',
    minWidth: 50,
    sort: true
  },
  {
    field: 'email1',
    title: 'email',
    width: 200,
    sort: true,
    style: {
      underline: true,
      underlineDash: [2, 0],
      underlineOffset: 3
    }
  },
  {
    title: 'full name',
    columns: [
      {
        field: 'name',
        title: 'First Name',
        width: 200
      },
      {
        field: 'name',
        title: 'Last Name',
        width: 200
      }
    ]
  },
  {
    field: 'date1',
    title: 'birthday',
    width: 200
  },
  {
    field: 'sex',
    title: 'sex',
    width: 100
  }
];

const option = {
  records,
  columns,
  rowSeriesNumber: {}
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;

const highlightPlugin = new VTablePlugins.HeaderHighlightPlugin(tableInstance, {});
```
