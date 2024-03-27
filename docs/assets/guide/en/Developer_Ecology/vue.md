## How to use VTable in Vue？

It is recommended to use Vtable in Vue 3.x. If you use vue2, it may cause performance problems. For example, binding the instance of table to the vue component `this.tableInstance = new VTable.ListTable(dom, option)` will cause vue's Responsiveness monitors all changes to the tableInstance attribute, causing table performance to look poor. (If you need to save the variable, you can place it on the window first).

The following code uses Vue3!

Composite API usage:

You can refer to[ the online demo ](https://codesandbox.io/p/devbox/magical-nash-t6t33f)for details.

## Code Example

- Composition API

```
<template>
  <div ref="listTableRef" style="width: 1280px; height: 400px"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ListTable } from "@visactor/vtable";

const listTableRef = ref();

const records = [
  {
    230517143221027: "CA-2018-156720",
    230517143221030: "JM-15580",
    230517143221032: "Bagged Rubber Bands",
    230517143221023: "Office Supplies",
    230517143221034: "Fasteners",
    230517143221037: "West",
    230517143221024: "Loveland",
    230517143221029: "2018-12-30",
    230517143221042: "3",
    230517143221040: "3.024",
    230517143221041: "-0.605",
  },
  {
    230517143221027: "CA-2018-115427",
    230517143221030: "EB-13975",
    230517143221032: "GBC Binding covers",
    230517143221023: "Office Supplies",
    230517143221034: "Binders",
    230517143221037: "West",
    230517143221024: "Fairfield",
    230517143221029: "2018-12-30",
    230517143221042: "2",
    230517143221040: "20.72",
    230517143221041: "6.475",
  },
  {
    230517143221027: "CA-2018-115427",
    230517143221030: "EB-13975",
    230517143221032: "Cardinal Slant-D Ring Binder, Heavy Gauge Vinyl",
    230517143221023: "Office Supplies",
    230517143221034: "Binders",
    230517143221037: "West",
    230517143221024: "Fairfield",
    230517143221029: "2018-12-30",
    230517143221042: "2",
    230517143221040: "13.904",
    230517143221041: "4.519",
  },
  ...
];

const columns = [
  {
    field: "230517143221027",
    title: "Order ID",
    width: "auto",
  },
  {
    field: "230517143221030",
    title: "Customer ID",
    width: "auto",
  },
  {
    field: "230517143221032",
    title: "Product Name",
    width: "auto",
  },
  {
    field: "230517143221023",
    title: "Category",
    width: "auto",
  },
  {
    field: "230517143221034",
    title: "Sub-Category",
    width: "auto",
  },
  {
    field: "230517143221037",
    title: "Region",
    width: "auto",
  },
  {
    field: "230517143221024",
    title: "City",
    width: "auto",
  },
  {
    field: "230517143221029",
    title: "Order Date",
    width: "auto",
  },
  {
    field: "230517143221042",
    title: "Quantity",
    width: "auto",
  },
  {
    field: "230517143221040",
    title: "Sales",
    width: "auto",
  },
  {
    field: "230517143221041",
    title: "Profit",
    width: "auto",
  },
];

const option = {
  records,
  columns,
  widthMode: "standard",
};

onMounted(() => {
  const listTable = new ListTable(listTableRef.value, option);

  listTable.on("click_cell", (params) => {
    console.log(params);
  });
});
</script>

```

## Notice

If you need to use ref to save table instances, please use `shallowRef`. Using `ref` will affect internal attribute updates and cause rendering exceptions.

```
const tableInstance = shallowRef();
tableInstance.value = new ListTable(listTableRef.value, option);
```
