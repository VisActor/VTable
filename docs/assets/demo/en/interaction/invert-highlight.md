---
category: examples
group: Interaction
title: invert highlight
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/invert-highlight.png
option: ListTable#hover.highlightMode('cross'%7C'column'%7C'row'%7C'cell')%20=%20'cross'
---

# Invert highlight

Show the highlight effect when set highlight range.

## Key Configurations

- `VTable.InvertHighlightPlugin` invert highlight plugin
  - `fill` invert highlight background color
  - `opacity` invert highlight opacity
- `setInvertHighlightRange` set highlight range

## Code demo

```javascript livedemo template=vtable
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

const columns =[
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
  theme: VTable.themes.DARK
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;

const highlightPlugin = new VTable.InvertHighlightPlugin(tableInstance, {});

highlightPlugin.setInvertHighlightRange({
  start: {
    col: 0,
    row: 6
  },
  end: {
    col: 5,
    row: 6
  }
});
```
