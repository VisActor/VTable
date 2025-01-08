---
category: examples
group: Interaction
title: Highlight Header
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png
link: plugin/header-highlight
---

# Highlight Header

Highlight the header when selecting the cell.

## Key Configurations

- `HeaderHighlightPlugin` highlight plugin
  - `columnHighlight` whether highlight the column
  - `rowHighlight` whether highlight the row
  - `colHighlightBGColor` the background color of the column highlight
  - `rowHighlightBGColor` the background color of the row highlight
  - `colHighlightColor` the color of the column highlight
  - `rowHighlightColor` the color of the row highlight

## Code demo

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
