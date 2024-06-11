# 在表格组件中单元格的宽高怎么根据内容自动计算？

## 问题描述

我有个需求场景是：单元格内容可能会出现换行符，并且同列的单元格内容长度不一样，同行的单元格的样式可能不一样，但是想要内容展示完整，所以要求表格组件可以实现根据内容的宽高来自动撑开单元格，如何在 VTable 中实现这个效果？

## 解决方案

VTable 中可以配置宽度高度的自动计算模式：

## 代码示例

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

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-widthmode-heightmode-56m24x)

![result](/vtable/faq/3-0.png)

## 相关文档

- [基本表格 demo](https://visactor.io/vtable/demo/table-type/list-table)
- [行高列宽教程](https://visactor.io/vtable/guide/basic_function/row_height_column_width)
- [相关 api](<https://visactor.io/vtable/option/ListTable#widthMode('standard'%20%7C%20'adaptive'%20%7C%20'autoWidth')%20=%20'standard'>)
- [github](https://github.com/VisActor/VTable)
