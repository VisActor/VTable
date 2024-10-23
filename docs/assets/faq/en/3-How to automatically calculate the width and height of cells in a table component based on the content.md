# How to automatically calculate the width and height of cells in a table component based on the content?

## Question Description

I have a requirement where the cell content in a table may contain line breaks, and the content length may vary for cells in the same column. Additionally, the style of cells in the same row may differ. However, I want the content to be fully displayed, so I need a table component that can automatically adjust the width and height of cells based on their content. How can I achieve this effect in VTable?

## Solution

VTable supports a configurable auto-sizing mode for width and height calculation!

## Code Example

```javascript
const records = [
  {
    "230517143221027": "CA-2018-156720",
    "230517143221030": "JM-15580",
    "230517143221032": "Bagged Rubber Bands",
  },
  {
    "230517143221027": "CA-2018-115427",
    "230517143221030": "EB-13975",
    "230517143221032": "GBC Binding covers",
  },
  {
    "230517143221027": "CA-2018-115427",
    "230517143221030": "EB-13975",
    "230517143221032": "Cardinal Slant-D Ring Binder,\n Heavy Gauge Vinyl",
  },
  {
    "230517143221027": "CA-2018-143259",
    "230517143221030": "PO-18865",
    "230517143221032": "Bush Westfield Collection Bookcases, Fully Assembled",
  },
  {
    "230517143221027": "CA-2018-126221",
    "230517143221030": "CC-12430",
    "230517143221032":
      "Eureka The Boss\n Plus 12-Amp Hard Box Upright Vacuum, Red"
  }
];

const columns = [
  {
    field: "230517143221027",
    title: "Order ID"
  },
  {
    field: "230517143221030",
    title: "Customer ID"
  },
  {
    field: "230517143221032",
    title: "Product Name",
    style: {
      fontSize(args: any) {
        if (args.row % 2 === 1) return 20;
        return 12;
      }
    }
  }
];

const option = {
  records,
  columns,
  limitMaxAutoWidth: 800,
  widthMode: "autoWidth",
  heightMode: "autoHeight"
};

// 创建 VTable 实例
const vtableInstance = new VTable.ListTable(
  document.getElementById("container")!,
  option
);
```

## Results

[Online demo](https://codesandbox.io/s/vtable-widthmode-heightmode-56m24x)

![result](/vtable/faq/3-0.png)

## Quote

- [List Table demo](https://visactor.io/vtable/demo/table-type/list-table)
- [rowHeight columnWidth Tutorial](https://visactor.io/vtable/guide/basic_function/row_height_column_width)
- [Related api](<https://visactor.io/vtable/option/ListTable#widthMode('standard'%20%7C%20'adaptive'%20%7C%20'autoWidth')%20=%20'standard'>)
- [github](https://github.com/VisActor/VTable)
