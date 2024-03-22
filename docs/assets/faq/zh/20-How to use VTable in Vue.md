## 如何在 Vue 中使用 VTable？

## 问题描述

VTable 没有封装 Vue 组件，那么如何在 Vue 中 VTable 呢？

## 解决方案

建议在 Vue 3.x 中使用 Vtable，如果使用 vue2 可能造成性能问题，如将 table 的实例绑定到 vue 组件上`this.tableInstance = new VTable.ListTable(dom, option)`，这样会导致 vue 的响应式去监听了 tableInstance 属性的所有变更，导致表格性能看上去不太好。（如果需要保存变量可以先放置到 window 上）。

以下代码使用基于 Vue3 ！

组合式 API 用法：

具体可以[参考在线 demo](https://codesandbox.io/p/devbox/magical-nash-t6t33f)

不同的表格，封装方式都是类似的

## 代码示例

- 组合式 API

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

## 结果展示

- [在线效果参考](https://codesandbox.io/p/sandbox/wizardly-dream-ktf74n)

## 相关文档

- [GitHub](https://github.com/VisActor/VTable)
