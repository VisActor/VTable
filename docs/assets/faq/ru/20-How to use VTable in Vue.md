## How to use VTable in Vue？

## Question Description

VTable does not encapsulate the Vue component, so how do you VTable in Vue?

## Solution

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
  {
    230517143221027: "CA-2018-143259",
    230517143221030: "PO-18865",
    230517143221032: "Wilson Jones Legal Size Ring Binders",
    230517143221023: "Office Supplies",
    230517143221034: "Binders",
    230517143221037: "East",
    230517143221024: "New York City",
    230517143221029: "2018-12-30",
    230517143221042: "3",
    230517143221040: "52.776",
    230517143221041: "19.791",
  },
  {
    230517143221027: "CA-2018-143259",
    230517143221030: "PO-18865",
    230517143221032: "Gear Head AU3700S Headset",
    230517143221023: "Technology",
    230517143221034: "Phones",
    230517143221037: "East",
    230517143221024: "New York City",
    230517143221029: "2018-12-30",
    230517143221042: "7",
    230517143221040: "90.93",
    230517143221041: "2.728",
  },
  {
    230517143221027: "CA-2018-143259",
    230517143221030: "PO-18865",
    230517143221032: "Bush Westfield Collection Bookcases, Fully Assembled",
    230517143221023: "Furniture",
    230517143221034: "Bookcases",
    230517143221037: "East",
    230517143221024: "New York City",
    230517143221029: "2018-12-30",
    230517143221042: "4",
    230517143221040: "323.136",
    230517143221041: "12.118",
  },
  {
    230517143221027: "CA-2018-126221",
    230517143221030: "CC-12430",
    230517143221032: "Eureka The Boss Plus 12-Amp Hard Box Upright Vacuum, Red",
    230517143221023: "Office Supplies",
    230517143221034: "Appliances",
    230517143221037: "Central",
    230517143221024: "Columbus",
    230517143221029: "2018-12-30",
    230517143221042: "2",
    230517143221040: "209.3",
    230517143221041: "56.511",
  },
  {
    230517143221027: "US-2018-158526",
    230517143221030: "KH-16360",
    230517143221032: "Harbour Creations Steel Folding Chair",
    230517143221023: "Furniture",
    230517143221034: "Chairs",
    230517143221037: "South",
    230517143221024: "Louisville",
    230517143221029: "2018-12-29",
    230517143221042: "3",
    230517143221040: "258.75",
    230517143221041: "77.625",
  },
  {
    230517143221027: "US-2018-158526",
    230517143221030: "KH-16360",
    230517143221032: "Global Leather and Oak Executive Chair, Black",
    230517143221023: "Furniture",
    230517143221034: "Chairs",
    230517143221037: "South",
    230517143221024: "Louisville",
    230517143221029: "2018-12-29",
    230517143221042: "1",
    230517143221040: "300.98",
    230517143221041: "87.284",
  },
  {
    230517143221027: "US-2018-158526",
    230517143221030: "KH-16360",
    230517143221032:
      "Panasonic KP-350BK Electric Pencil Sharpener with Auto Stop",
    230517143221023: "Office Supplies",
    230517143221034: "Art",
    230517143221037: "South",
    230517143221024: "Louisville",
    230517143221029: "2018-12-29",
    230517143221042: "1",
    230517143221040: "34.58",
    230517143221041: "10.028",
  },
  {
    230517143221027: "US-2018-158526",
    230517143221030: "KH-16360",
    230517143221032: "GBC ProClick Spines for 32-Hole Punch",
    230517143221023: "Office Supplies",
    230517143221034: "Binders",
    230517143221037: "South",
    230517143221024: "Louisville",
    230517143221029: "2018-12-29",
    230517143221042: "1",
    230517143221040: "12.53",
    230517143221041: "5.889",
  },
  {
    230517143221027: "US-2018-158526",
    230517143221030: "KH-16360",
    230517143221032: "DMI Arturo Collection Mission-style Design Wood Chair",
    230517143221023: "Furniture",
    230517143221034: "Chairs",
    230517143221037: "South",
    230517143221024: "Louisville",
    230517143221029: "2018-12-29",
    230517143221042: "8",
    230517143221040: "1207.84",
    230517143221041: "314.038",
  },
  {
    230517143221027: "CA-2018-130631",
    230517143221030: "BS-11755",
    230517143221032: "Hand-Finished Solid Wood Document Frame",
    230517143221023: "Furniture",
    230517143221034: "Furnishings",
    230517143221037: "West",
    230517143221024: "Edmonds",
    230517143221029: "2018-12-29",
    230517143221042: "2",
    230517143221040: "68.46",
    230517143221041: "20.538",
  },
  {
    230517143221027: "CA-2018-130631",
    230517143221030: "BS-11755",
    230517143221032: "Acco Glide Clips",
    230517143221023: "Office Supplies",
    230517143221034: "Fasteners",
    230517143221037: "West",
    230517143221024: "Edmonds",
    230517143221029: "2018-12-29",
    230517143221042: "5",
    230517143221040: "19.6",
    230517143221041: "9.604",
  },
  {
    230517143221027: "CA-2018-146626",
    230517143221030: "BP-11185",
    230517143221032: "Nu-Dell Executive Frame",
    230517143221023: "Furniture",
    230517143221034: "Furnishings",
    230517143221037: "West",
    230517143221024: "Anaheim",
    230517143221029: "2018-12-29",
    230517143221042: "8",
    230517143221040: "101.12",
    230517143221041: "37.414",
  },
  {
    230517143221027: "CA-2018-158673",
    230517143221030: "KB-16600",
    230517143221032: "Xerox 1915",
    230517143221023: "Office Supplies",
    230517143221034: "Paper",
    230517143221037: "Central",
    230517143221024: "Grand Rapids",
    230517143221029: "2018-12-29",
    230517143221042: "2",
    230517143221040: "209.7",
    230517143221041: "100.656",
  },
  {
    230517143221027: "US-2018-102638",
    230517143221030: "MC-17845",
    230517143221032: "Ideal Clamps",
    230517143221023: "Office Supplies",
    230517143221034: "Fasteners",
    230517143221037: "East",
    230517143221024: "New York City",
    230517143221029: "2018-12-29",
    230517143221042: "3",
    230517143221040: "6.03",
    230517143221041: "2.955",
  },
  {
    230517143221027: "CA-2018-118885",
    230517143221030: "JG-15160",
    230517143221032: "Adtran 1202752G1",
    230517143221023: "Technology",
    230517143221034: "Phones",
    230517143221037: "West",
    230517143221024: "Los Angeles",
    230517143221029: "2018-12-29",
    230517143221042: "3",
    230517143221040: "302.376",
    230517143221041: "22.678",
  },
  {
    230517143221027: "CA-2018-118885",
    230517143221030: "JG-15160",
    230517143221032: "Global High-Back Leather Tilter, Burgundy",
    230517143221023: "Furniture",
    230517143221034: "Chairs",
    230517143221037: "West",
    230517143221024: "Los Angeles",
    230517143221029: "2018-12-29",
    230517143221042: "4",
    230517143221040: "393.568",
    230517143221041: "-44.276",
  },
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

## Results

- [Online demo](https://codesandbox.io/p/sandbox/wizardly-dream-ktf74n)

## Related Documentation

- [GitHub](https://github.com/VisActor/VTable)
