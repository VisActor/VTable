---
category: examples
group: Animation
title: Appear Animation
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/appear-animation.gif
option: ListTable-columns-text#animationAppear
---

# Entry animation

Initialize the table with an entrance animation.

## Key configuration

- `animationAppear` Entry animation configuration
  - `type` Entry animation type, currently supports `all` and `one-by-one`
  - `direction` Entry animation direction, currently supports `row` and `column`
  - `duration` The duration of a single animation, in milliseconds, `one-by-one`, the duration of one animation
  - `delay` Animation delay, in milliseconds; `one-by-one` is the time difference between two animations, `all` is the delay of all animations

## Code demonstration

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
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto",
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
  records:data.slice(0,20),
  columns,
  widthMode:'standard',
  animationAppear: {
      duration: 300,
      delay: 100,
      type: 'one-by-one', // all
      direction: 'row' // colunm
    }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
