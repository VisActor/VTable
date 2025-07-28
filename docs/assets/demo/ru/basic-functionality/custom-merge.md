---
category: examples
group: Basic Features
title: Custom Merge Cells
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-merge.png
option: ListTable-columns-text#mergeCell
---

# Custom Merge cells

Customize the range, content, and style of merged cells through configuration

## Key Configurations

 - `customMergeCell`  Define rules for cell merging

## Code demo

```javascript livedemo template=vtable

let  tableInstance;

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `name${i + 1}`,
    date1: '2022-9-1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};
const records = generatePersons(10);

const columns = [
    {
      field: 'id',
      title: 'ID ff',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
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
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];


const option = {
  records,
  columns,
  widthMode:'standard',
  customMergeCell: (col, row, table) => {
    if (col >=0 && col < table.colCount && row === table.rowCount-1) {
      return {
        text: 'Summary column: This data is a basic information of personnel',
        range: {
          start: {
            col: 0,
            row: table.rowCount-1
          },
          end: {
            col: table.colCount-1,
            row: table.rowCount-1
          }
        },
        style:{
          borderLineWidth:[6,1,1,1],
          borderColor:['gray']
        }
      };
    }
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
```
