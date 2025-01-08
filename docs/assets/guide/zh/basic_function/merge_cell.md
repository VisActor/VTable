# 单元格合并

单元格合并是指多个单元格合并为一个单元格，常用在重复内容合并显示等功能上。

## 自动单元格合并

在VTable中，可以在列上配置`mergeCell`，使同一列中内容相同的相邻单元格进行合并

### 示例

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Category",
        "title": "Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'right'
          // textBaseline:"bottom"
        }
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "title": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "title": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  hover:{
    highlightMode:'row'
  },
  sortState:{
    field:'Category',
    order:'asc'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```

配置了`mergeCell`的列，会将同一列中内容相同的相邻单元格进行合并显示

## 自定义单元格合并

在VTable中，可以配置`customMergeCell`自定义单元格的合并方式，这种方式常用来显示一些标注信息。其中`customMergeCell`可以配置回调函数会传入行列号和表格实例，在函数中判断需要合并的单元格，并返回相应的合并规则：
* text: 合并单元格内的文字
* range: 合并的范围
* style: 合并单元格的样式

`customMergeCell`也可以配置为合并规则的数组，数组中的每一项为一个合并规则，规则的配置与`customMergeCell`回调函数的返回值相同。

### 示例

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
    if (col > 0 && col < 8 && row > 7 && row < 11) {
      return {
        text: 'long long long long long long long long long long long long long long long long long long text!',
        range: {
          start: {
            col: 1,
            row: 8
          },
          end: {
            col: 7,
            row: 10
          }
        },
        style: {
          bgColor: '#ccc'
        }
      };
    }
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
```
