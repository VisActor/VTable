---
category: examples
group: table-type
title: 基本表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table.png
order: 1-1
link: '../guide/table_type/List_table/list_table_define_and_generate'
option: ListTable-columns-text#cellType
---

# 基本表格

基本表格

## 关键配置

-`ListTable`

## 代码演示

```javascript livedemo template=vtable
// please use "import {ListTable} from '@visactor/react-vtable'" in your code;
const {ListTable, ListColumn} = ReactVTable; // just for visactor website

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {
const root = ReactDom.createRoot(
  document.getElementById('live-demo-additional-container')
);
root.render(<ListTable
  records={data}
  widthMode={'standard'}
>
  <ListColumn
    field="Order ID"
    title="Order IDA"
    width="auto"
  />
  <ListColumn
    field="Customer ID"
    title="Customer ID"
    width="auto"
  />
  <ListColumn
    field="Product Name"
    title="Product Name"
    width="auto"
  />
  <ListColumn
    field="Category"
    title="Category"
    width="auto"
  />
  <ListColumn
    field="Sub-Category"
    title="Sub-Category"
    width="auto"
  />
  <ListColumn
    field="Region"
    title="Region"
    width="auto"
  />
  <ListColumn
    field="City"
    title="City"
    width="auto"
  />
  <ListColumn
    field="Order Date"
    title="Order Date"
    width="auto"
  />
  <ListColumn
    field="Quantity"
    title="Quantity"
    width="auto"
  />
  <ListColumn
    field="Sales"
    title="Sales"
    width="auto"
  />
  <ListColumn
    field="Profit"
    title="Profit"
    width="auto"
  />
</ListTable>);
customRelease = () => {
  root.unmount();
}
})

```

